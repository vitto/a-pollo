'use strict'
'use strict'

const async = require('async')
const decorator = require('./decorate-data')
const assets = require('./assets')
const fs = require('fs')
const fse = require('fs-extra')
const path = require('path')
const rimraf = require('rimraf')
const stripIndent = require('strip-indent')
const YAML = require('json2yaml')
const ncp = require('ncp').ncp

function toYaml (data) {
  // YAML.stringify options desn't seems to work properly
  // YAML.stringify(data [, 0, 4])
  const ymlText = YAML.stringify(data, 0, 4).replace('---\n', '')
  const formattedData = stripIndent(`${ymlText}\n`)
  return `---\n${formattedData}\n`
}

function assetsPath (buildPath) {
  return path.resolve(buildPath, 'assets.md')
}

function saveDocs (config, docs, cb) {
  async.eachLimit(docs, 10,
    function (doc, done) {
      const filePath = path.resolve(config.build, doc.file)
      const filePathParsed = path.parse(filePath, 0, 2)

      doc.annotations.breadcrumb = doc.breadcrumb

      var frontMatterAnnotations = {
        annotations: doc.annotations,
        breadcrumb: doc.breadcrumb,
        file: doc.file,
        url: doc.url
      }

      if (config.frontMatter) {
        const a = frontMatterAnnotations.annotations[0]
        var name = ''
        if (a.annotation !== 'color' && a.annotation !== 'typography') {
          if (a.name) {
            name = a.title.replace(/[-_]/g, ' ')
            frontMatterAnnotations.title = a.title || name.charAt(0).toUpperCase() + name.slice(1)
          }
        } else {
          name = a.title.replace(/[-_]/g, ' ')
          frontMatterAnnotations.title = name.charAt(0).toUpperCase() + name.slice(1)
        }
        if (a.category) { frontMatterAnnotations.category = a.category }
        if (a.annotation) {
          if (a.annotation !== 'color' && a.annotation !== 'typography') {
            frontMatterAnnotations.collection = a.annotation
          } else {
            frontMatterAnnotations.collection = 'identity'
          }
          frontMatterAnnotations.layout = a.annotation
          frontMatterAnnotations.view = `${a.annotation}.twig`
        }
        if (a.date) { frontMatterAnnotations.date = a.date }
        if (a.icon) { frontMatterAnnotations.icon = a.icon }
      }

      const frontMatter = toYaml(frontMatterAnnotations)

      fse.mkdirs(filePathParsed.dir, function (err) {
        if (err) throw err
        fs.writeFile(filePath, frontMatter, function (err) {
          if (err) throw err
          done()
        })
      })
    },
    function (err) {
      if (err) { cb(err) }
      cb(null)
    }
  )
}

function saveAssets (config, data, cb) {
  assets.save(config, function () {
    const filePath = assetsPath(config.build)
    const assetsData = {
      fonts: data.fonts,
      images: data.images,
      layout: 'assets',
      title: 'Assets',
      view: 'assets.twig'
    }
    const frontMatter = toYaml(assetsData)
    fs.writeFile(filePath, frontMatter, function (err) {
      if (err) {
        cb(err)
      } else {
        cb(null)
      }
    })
  })
}

function saveSnippets (data, docs, buildPath, cb) {
  var annotations = []
  docs.forEach(function (doc) {
    const annotation = doc.annotations[0] || { category: null, annotation: null, html: { code: null } }
    if (annotation.annotation === 'snippet') {
      annotations.push(annotation)
    }
  })

  var annotationsData = {
    layout: 'snippets',
    annotations: annotations,
    title: 'Snippets',
    view: 'snippets.twig'
  }

  const mapPath = path.join(buildPath, 'snippets.md')
  const annotationsDataIndented = toYaml(annotationsData)

  fs.writeFile(mapPath, annotationsDataIndented, function (err) {
    if (err) {
      cb(err)
    } else {
      cb(null)
    }
  })
}

function saveIndex (config, cb) {
  const buildPath = config.build
  if (config.index === true) {
    fs.writeFile(path.join(buildPath, 'index.md'), fs.readFileSync(path.join(path.join(__dirname, '../'), 'index.md'), 'utf-8'), function (err) {
      if (err) {
        cb(err)
      } else {
        cb(null)
      }
    })
  } else if (config.index !== false) {
    fs.writeFile(path.join(buildPath, 'index.md'), fs.readFileSync(config.index, 'utf-8'), function (err) {
      if (err) {
        cb(err)
      } else {
        cb(null)
      }
    })
  } else {
    cb(null)
    return
  }
}

function copyPosts (buildPath, postsPath, cb) {
  ncp(postsPath, buildPath, function (err) {
    if (err) throw err
    cb()
  })
}

function save (config, data, cb) {
  const docs = decorator.sortByDocumentation({
    annotations: data.annotations,
    slugBase: 'docs',
    filter: 'doc',
    path: config.annotations
  })
  .concat(decorator.sortBySource({
    annotations: data.annotations,
    slugBase: 'snippets',
    filter: 'snippet',
    path: config.annotations
  }))
  .concat(decorator.sortBySnippetType({
    annotations: data.annotations,
    slugBase: '',
    filter: 'color',
    path: config.annotations
  }))
  .concat(decorator.sortBySnippetType({
    annotations: data.annotations,
    slugBase: '',
    filter: 'typography',
    path: config.annotations
  }))

  rimraf(config.build, function (err) {
    if (err) throw err
    saveDocs(config, docs, function (err) {
      if (err) throw err
      saveIndex(config, function (err) {
        if (err) throw err
        saveAssets(config, data, function (err) {
          if (err) throw err
          saveSnippets(data, docs, config.build, function (err) {
            if (err) throw err
            copyPosts(config.build, config.posts, function () {
              cb(null, config, docs)
            })
          })
        })
      })
    })
  })
}

module.exports = save
