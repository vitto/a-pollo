'use strict'

const path = require('path')
const slugify = require('slugify')

function capitalizeFirstLetter (string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

function pathDocumentation (basePath, sourcePath, doc) {
  const docFilePath = doc.path.file.split(path.parse(sourcePath).base)[1]
  return path.join(basePath, path.resolve(path.parse(docFilePath).dir, doc.path.name + '.md')).toLowerCase()
}

function pathSource (basePath, sourcePath, doc) {
  return path.join(basePath, slugify(doc.category), doc.path.name).toLowerCase() + '.md'
}

function unslug (file) {
  const fileParsed = path.parse(file)
  var unslugNames = []
  var slug = fileParsed.dir.split('/').splice(1)
  slug.push(fileParsed.name)
  slug.forEach(function (name) {
    unslugNames.push(capitalizeFirstLetter(name.replace(/[-_]{1,}/g, ' ')))
  })
  return unslugNames
}

function decorate (file, doc) {
  return {
    file: file,
    breadcrumb: unslug(file),
    annotations: [doc]
  }
}

function sort (opts, pathFunc) {
  var decoratedItems = []
  opts.annotations.forEach(function (item) {
    if (item.annotation === opts.filter) {
      if (decoratedItems.length === 0) {
        decoratedItems.push(decorate(
          pathFunc(opts.base, opts.path, item)
        , item))
      } else {
        decoratedItems.forEach(function (decoratedItem) {
          if (decoratedItem.file === pathFunc(opts.base, opts.path, item)) {
            decoratedItem.annotations.push(item)
          }
        })
      }
    }
  })
  return decoratedItems
}

function normalizeCateogories (annotations) {
  var hash = Object.create(null)
  annotations.forEach(function (a) {
    hash[a.path.file] = hash[a.path.file] || a.category
  })
  annotations.forEach(function (a) {
    a.category = a.category || hash[a.path.file]
  })
  return annotations
}

function sortByDocumentation (opts) {
  opts.annotations = normalizeCateogories(opts.annotations)
  return sort(opts, pathDocumentation)
}

function sortBySource (opts) {
  return sort(opts, pathSource)
}

module.exports.sortByDocumentation = sortByDocumentation
module.exports.sortBySource = sortBySource
