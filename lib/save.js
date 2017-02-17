'use strict'

const async = require('async')
const decorator = require('./decorate-data')
const fs = require('fs')
const fse = require('fs-extra')
const path = require('path')
const rimraf = require('rimraf')
const stripIndent = require('strip-indent')
const YAML = require('json2yaml')

function assetsPath (cachePath) {
  return path.resolve(cachePath, 'assets.md')
}

function saveDocs (config, docs, cb) {
  async.eachLimit(docs, 10,
    function (doc, done) {
      const filePath = path.resolve(config.cache, doc.file)
      const filePathParsed = path.parse(filePath, 0, 2)

      doc.annotations.breadcrumb = doc.breadcrumb

      const cleanDir = path.resolve(config.cache, path.parse(doc.file).dir.split(path.sep)[0])
      const ymlText = YAML.stringify({ annotations: doc.annotations })
      const frontMatter = stripIndent(`${ymlText}\n`)

      rimraf(cleanDir, function (err) {
        if (err) throw err
        fse.mkdirs(filePathParsed.dir, function (err) {
          if (err) throw err
          fs.writeFile(filePath, frontMatter, function (err) {
            if (err) throw err
            done()
          })
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
  const filePath = assetsPath(config.cache)
  const ymlText = YAML.stringify({ images: data.images, fonts: data.fonts })
  const frontMatter = stripIndent(`${ymlText}\n`)

  rimraf(filePath, function (err) {
    if (err) throw err
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
    var page = {
      type: doc.annotations[0].annotation,
      title: doc.breadcrumb[doc.breadcrumb.length - 1],
      category: doc.annotations[0].category,
      file: doc.file,
      url: doc.url
    }

    if (page.annotation === 'snippet') {
      page.preview = doc.annotations[0].html.code
    }
    pages.push(page)
  })

  const filePath = assetsPath(cachePath)
  const assetsBase = path.parse(filePath).base
  const assetsPage = {
    type: 'assets',
    title: 'Assets',
    category: 'assets',
    file: assetsBase,
    url: decorator.url(assetsBase)
  }

  pages.push(assetsPage)

  const mapPath = path.join(cachePath, 'map.yml')
  const pagesData = YAML.stringify(pages)

  rimraf(mapPath, function (err) {
    if (err) throw err
    fs.writeFile(mapPath, pagesData, function (err) {
      if (err) {
        cb(err)
      } else {
        cb(null, pages)
      }
    })
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
    slugBase: 'identity',
    filter: 'color',
    path: config.annotations
  }))
  .concat(decorator.sortBySnippetType({
    annotations: data.annotations,
    slugBase: 'identity',
    filter: 'typography',
    path: config.annotations
  }))

  saveDocs(config, docs, function (err) {
    if (err) throw err
    saveAssets(config, data, function (err) {
      if (err) throw err
      saveMap(data, docs, config.cache, function (err, map) {
        if (err) throw err
        cb(null, config, docs, map)
      })
    })
  })

  //
  /*
  const sitemap = decorator.siteMap(docs)
  console.log(sitemap);
  process.exit()
  */

}

module.exports = save
