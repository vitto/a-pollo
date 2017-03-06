'use strict'

const async = require('async')
const decorate = require('./decorate-color')
const extract = require('./extract')
const marked = require('marked')
const path = require('path')
const typography = require('./decorate-typography')

const markedOptions = {}

function markdownText (data) {
  return data ? marked(data, markedOptions) : null
}

function markdownCode (data, extension) {
  return data ? marked(`\`\`\`${extension}\n${data}\`\`\``, markedOptions) : null
}

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
            author: markdownText(extract.author(annotation.data)),
            category: extract.category(annotation.data),
            date: extract.date(annotation.data),
            html: null,
            icon: extract.icon(annotation.data),
            name: extract.name(annotation.data),
            params: extract.params(annotation.data),
            path: cleanPath(annotation.path),
            public: extract.public(annotation.data),
            returns: extract.returns(annotation.data),
            text: markdownText(extract.text(annotation.data)),
            type: extract.type(annotation.data),
            version: extract.version(annotation.data)
          }

          annotationData.title = extract.title(annotation.data, annotationData.name)

          if (annotationData.params) {
            for (var i = 0; i < annotationData.params.length; i++) {
              annotationData.params[i].text = markdownText(annotationData.params[i].text)
            }
          }

          const code = extract.code(annotation.data)
          if (code !== null) {
            const extension = cleanPath(annotation.path).ext.replace('.', '')
            annotationData.code = {
              ext: annotationData.path.ext.replace('.', ''),
              code: code.code,
              snippet: markdownCode(code.code, extension),
              text: markdownText(code.text)
            }
          }

          const css = extract.css(annotation.data)
          if (css !== null) {
            annotationData.css = {
              code: css.code,
              snippet: markdownCode(css.code, 'css'),
              text: markdownText(css.text)
            }
          }

          if (annotationData.annotation === 'color') {
            annotationData.annotation = 'color'
            annotationData.category = 'identity'
            annotationData.var = extract.colorVarName(annotation.data)
            annotationData.title = 'Color'
            annotationData.name = extract.colorName(annotation.data)
            annotationData.type = annotationData.annotation
            annotationData.value = extract.colorVarValue(annotation.data)
            annotationData.names = decorate.names(annotationData.value)
            annotationData.css = decorate.css(annotationData.value)
            annotationData.channel = decorate.channel(annotationData.value)
          }

          if (annotationData.annotation === 'typography') {
            annotationData.annotation = 'typography'
            annotationData.category = 'identity'
            annotationData.title = 'Typography'
            annotationData.alphabet = typography.alphabet()
            annotationData.selector = extract.selector(annotation.data)
            annotationData.selectorClass = extract.selectorClass(annotation.data)
            annotationData.preview = {
              title: typography.title(),
              sentence: typography.sentence(),
              paragraph: typography.paragraph()
            }
          }

          if (html !== null) {
            annotationData.html = {
              code: html.code,
              copy: extract.htmlSnippet(annotation.data),
              snippet: markdownCode(extract.htmlSnippet(annotation.data), 'html'),
              source: html.source,
              text: markdownText(html.text)
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
