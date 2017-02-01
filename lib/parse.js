'use strict'

const async = require('async')
const decorate = require('./decorate-color')
const extract = require('./extract')
const path = require('path')

function filesToAnnotations (files) {
  var annotationsMatches
  var annotations = []
  files.forEach(function (file) {
    annotationsMatches = file.data.match(extract.annotationRegex)
    annotationsMatches.forEach(function (annotation) {
      annotations.push({
        path: file.path,
        data: annotation
      })
    })
  })
  return annotations
}

function cleanPath (filePath) {
  var filePathCleaned = path.parse(filePath)
  filePathCleaned.relative = path.relative(process.cwd(), filePathCleaned.dir)
  const outside = path.relative(filePathCleaned.root, process.cwd() + path.sep + '..' + path.sep)
  filePathCleaned.project = filePathCleaned.dir.replace(outside, '').replace(path.sep + path.sep, path.sep)
  filePathCleaned.file = filePath
  return filePathCleaned
}

function clean (annotation) {
  Object.keys(annotation).forEach(function (key) {
    if (annotation[key] === null) {
      delete annotation[key]
    }
  })
  return annotation
}

function parse (files, cb) {
  var docs = []

  function toData (files, cb) {
    const annotations = filesToAnnotations(files)
    async.each(annotations,
      function (annotation, done) {
        extract.html(annotation.data, function (err, html) {
          if (err) { done(err) }
          var annotationData = {
            annotation: extract.annotation(annotation.data),
            author: extract.author(annotation.data),
            category: extract.category(annotation.data),
            code: extract.code(annotation.data),
            css: extract.css(annotation.data),
            date: extract.date(annotation.data),
            html: null,
            icon: extract.icon(annotation.data),
            name: extract.name(annotation.data),
            params: extract.params(annotation.data),
            path: cleanPath(annotation.path),
            public: extract.public(annotation.data),
            returns: extract.returns(annotation.data),
            text: extract.text(annotation.data),
            type: extract.type(annotation.data),
            version: extract.version(annotation.data)
          }

          if (annotationData.annotation === 'color') {
            annotationData.name = extract.colorVarName(annotation.data)
            annotationData.title = extract.colorTitle(annotation.data)
            annotationData.type = annotationData.annotation
            annotationData.value = extract.colorVarValue(annotation.data)
            annotationData.format = {
              css: decorate.css(annotationData.value),
              object: decorate.object(annotationData.value)
            }
          }

          if (html !== null) {
            annotationData.html = {
              code: html.code,
              snippet: extract.htmlSnippet(annotation.data),
              source: html.code,
              text: html.text
            }
          } else {
            annotationData.html = null
          }
          docs.push(clean(annotationData))
          done(null)
        })
      },
      function (err) {
        if (err) { cb(err) }
        cb(null, docs)
      }
    )
  }

  toData(files, cb)
}

module.exports = parse
