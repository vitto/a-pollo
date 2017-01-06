'use strict'

const async = require('async')
const decorator = require('./decorator')
const fs = require('fs')
const fse = require('fs-extra')
const path = require('path')

const stripIndent = require('strip-indent')
// const YAML = require('yamljs')
const YAML = require('json2yaml')

function save (config, annotations, cb) {
  var docs = []

  docs = docs.concat(decorator.sortByDocumentation({
    annotations: annotations,
    base: 'docs',
    filter: 'doc',
    path: config.styleguide.docs
  }))

  docs = docs.concat(decorator.sortBySource({
    annotations: annotations,
    base: 'snippets',
    filter: 'snippet',
    path: config.styleguide.docs
  }))

  docs.forEach(function (doc) {
    // console.log(doc.doc)
    // docPath(config.styleguide.docs, doc.path.file)
  })
  //console.log(config.styleguide.docs)



  // remove first filePathParsed.dir

  async.eachLimit(docs, 10,
    function (doc, done) {
      const filePath = path.resolve(config.temp, doc.file)
      const filePathParsed = path.parse(filePath, 0, 2)

      doc.annotations.breadcrumb = doc.breadcrumb

      const ymlText = YAML.stringify({ annotations: doc.annotations })
      const frontMatter = stripIndent(`${ymlText}\n`)

      fse.mkdirs(filePathParsed.dir, function (err) {
        if (err) { throw err }
        fs.writeFile(filePath, frontMatter, function (err) {
          if (err) { throw err }
          done()
        })
      })
    },
    function (err) {
      if (err) { cb(err) }
      cb(null, config, docs)
    }
  )
}

module.exports = save
