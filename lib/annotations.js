'use strict'

const glob = require('multi-glob').glob
const path = require('path')

function annotations (annotationsDirs) {
  const searchPattern = '/**/*.{css,less,scss}'
  var searchPath = []

  if (annotationsDirs instanceof Array) {
    for (var i = 0; i < annotationsDirs.length; i++) {
      const annotationsPath = path.resolve(process.cwd(), annotationsDirs[i])
      const singleSearchPath = path.join(annotationsPath, searchPattern)
      searchPath.push(singleSearchPath)
    }
  } else {
    const annotationsPath = path.resolve(process.cwd(), annotationsDirs)
    searchPath = path.join(annotationsPath, searchPattern)
  }

  return {
    list: list
  }

  function list (cb) {
    glob(searchPath, function (err, files) {
      if (err) throw err
      if (files.length === 0) {
        cb(new Error(`No annotations found in search`))
      } else {
        cb(null, files)
      }
    })
  }
}

module.exports = annotations
