'use strict'

const async = require('async')
const decorator = require('./decorate-data')
const fs = require('fs')
const fse = require('fs-extra')
const path = require('path')
const rimraf = require('rimraf')
const stripIndent = require('strip-indent')
const YAML = require('json2yaml')

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
  const filePath = path.resolve(config.cache, 'assets.md')
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
      cb(null, config, docs)
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
