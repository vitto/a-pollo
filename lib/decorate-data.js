'use strict'

const path = require('path')
const slugify = require('slugify')

function url (file) {
  return {
    short: file.replace('.md', ''),
    folder: file.replace('.md', '/'),
    full: file.replace('.md', '/index.html')
  }
}

function capitalizeFirstLetter (string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

function pathDocumentation (slugBase, sourcePath, doc) {
  const docFilePath = doc.path.file.split(path.parse(sourcePath).base)[1]
  return path.join(slugBase, path.resolve(path.parse(docFilePath).dir, doc.path.name + '.md')).toLowerCase()
}

function pathSource (slugBase, sourcePath, doc) {
  return path.join(slugBase, slugify(doc.category || ''), doc.path.name).toLowerCase() + '.md'
}

function pathSnippetType (slugBase, sourcePath, doc) {
  return path.join(slugBase, slugify(doc.category || ''), doc.annotation).toLowerCase() + '.md'
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
    annotation: doc.annotation,
    annotations: [doc],
    breadcrumb: unslug(file),
    category: doc.category,
    file: file,
    title: doc.name,
    url: url(file)
  }
}

function decorateAnnotations (annotationFiles, opts, cb) {
  var decoratedItems = []

  for (var i in annotationFiles) {
    var annotationFileAnnotations = annotationFiles[i]
    var isFirstItem = true
    decoratedItems.push(decorate(
      cb(opts.slugBase, opts.path, annotationFileAnnotations[0])
    , annotationFileAnnotations[0]))
    annotationFileAnnotations.forEach(function (annotation) {
      if (!isFirstItem) {
        decoratedItems[decoratedItems.length - 1].annotations.push(annotation)
      }
      isFirstItem = false
      if (annotation.path.file) {
        delete annotation.path.file
      }
    })
    isFirstItem = true
  }
  return decoratedItems
}

function sort (opts, cb) {
  var annotationFiles = []
  opts.annotations.forEach(function (item) {
    if (item.annotation === opts.filter) {
      if (!annotationFiles[item.path.file]) {
        annotationFiles[item.path.file] = []
      }
      annotationFiles[item.path.file].push(item)
    }
  })
  return decorateAnnotations(annotationFiles, opts, cb)
}

function sortSnippetType (opts, cb) {
  var annotationFiles = []
  opts.annotations.forEach(function (item) {
    if (item.annotation === opts.filter) {
      if (!annotationFiles[opts.filter]) {
        annotationFiles[opts.filter] = []
      }
      annotationFiles[opts.filter].push(item)
    }
  })
  return decorateAnnotations(annotationFiles, opts, cb)
}

function normalizeCateogories (annotations) {
  var hash = Object.create(null)
  annotations.forEach(function (annotation) {
    if (hash[annotation.path.file] || annotation.category) {
      hash[annotation.path.file] = hash[annotation.path.file] || annotation.category
    }
  })
  annotations.forEach(function (annotation) {
    if (annotation.category || hash[annotation.path.file]) {
      annotation.category = annotation.category || hash[annotation.path.file]
    }
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

function sortBySnippetType (opts) {
  return sortSnippetType(opts, pathSnippetType)
}

module.exports.sortByDocumentation = sortByDocumentation
module.exports.sortBySnippetType = sortBySnippetType
module.exports.sortBySource = sortBySource
module.exports.url = url
