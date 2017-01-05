'use strict'

const path = require('path')
const slugify = require('slugify')

function pathSource (base, doc) {
  const docFilePath = doc.path.file.split(path.parse(base).base)[1]
  return path.resolve(path.parse(docFilePath).dir, doc.path.name + '.md')
}

function item (file, doc) {
  return {
    file: file,
    data: doc
  }
}

function sortByDocumentation (opts, cb) {
  // var structure = opts.structure || []
  // console.log(opts.applyTo, opts.base)
  // opts.docs.forEach(function (doc) {
  //   console.log(pathSource(opts.base, doc));
  //     structure = add()
  // })

  sortBySource(opts, cb)
}

function sortBySource (opts, cb) {
  var structure = opts.structure || []
  console.log(opts.docType, opts.base)
  opts.docs.forEach(function (doc) {
    if (opts.docType === 'snippet' && doc.type === null) {
      structure.push(item(pathSource(opts.base, doc), doc))
    }
  })
  console.log(structure)
}

module.exports.sortByDocumentation = sortByDocumentation
module.exports.sortBySource = sortBySource
