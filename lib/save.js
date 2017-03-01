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

function assetsPath (cachePath) {
  return path.resolve(cachePath, 'assets.md')
}

function saveDocs (config, docs, cb) {
  async.eachLimit(docs, 10,
    function (doc, done) {
      const filePath = path.resolve(config.cache, doc.file)
      const filePathParsed = path.parse(filePath, 0, 2)

      doc.annotations.breadcrumb = doc.breadcrumb

      var frontMatterAnnotations = {
        annotations: doc.annotations,
        breadcrumb: doc.breadcrumb,
        file: doc.file,
        url: doc.url
      }

      if (config.front_matter) {
        const a = frontMatterAnnotations.annotations[0]
        var name = ''
        if (a.annotation !== 'color' && a.annotation !== 'typography') {
          if (a.name) {
            name = a.name.replace(/[-_]/g, ' ')
            frontMatterAnnotations.title = name.charAt(0).toUpperCase() + name.slice(1)
          }
        } else {
          name = a.annotation.replace(/[-_]/g, ' ')
          frontMatterAnnotations.title = name.charAt(0).toUpperCase() + name.slice(1)
        }
        if (a.category) { frontMatterAnnotations.category = a.category }
        if (a.annotation) {
          frontMatterAnnotations.layout = `${a.annotation}`
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
    const filePath = assetsPath(config.cache)
    const frontMatter = toYaml({ images: data.images, fonts: data.fonts })
    fs.writeFile(filePath, frontMatter, function (err) {
      if (err) {
        cb(err)
      } else {
        cb(null)
      }
    })
  })
}

function saveMap (data, docs, cachePath, cb) {
  var pages = []
  docs.forEach(function (doc) {
    const annotation = doc.annotations[0] || { category: null, annotation: null, html: { code: null } }
    var page = {
      category: annotation.category,
      file: doc.file,
      title: doc.breadcrumb[doc.breadcrumb.length - 1],
      type: annotation.annotation,
      url: doc.url
    }

    if (annotation.annotation === 'snippet') {
      page.preview = annotation.html.code
    }
    pages.push(page)
  })

  const filePath = assetsPath(cachePath)
  const assetsBase = path.parse(filePath).base
  const assetsPage = {
    category: 'assets',
    file: assetsBase,
    title: 'Assets',
    type: 'assets',
    url: decorator.url(assetsBase)
  }

  pages.push(assetsPage)

  const mapPath = path.join(cachePath, 'map.yml')
  const pagesDataIndented = toYaml({ pages: pages })

  fs.writeFile(mapPath, pagesDataIndented, function (err) {
    if (err) {
      cb(err)
    } else {
      cb(null, { pages: pages })
    }
  })
}

function copyPosts (cachePath, postsPath, cb) {
  ncp(postsPath, cachePath, function (err) {
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

  rimraf(config.cache, function (err) {
    if (err) throw err
    saveDocs(config, docs, function (err) {
      if (err) throw err
      saveAssets(config, data, function (err) {
        if (err) throw err
        saveMap(data, docs, config.cache, function (err, map) {
          if (err) throw err
          copyPosts(config.cache, config.posts, function () {
            cb(null, config, docs, map)
          })
        })
      })
    })
  })
}

module.exports = save
