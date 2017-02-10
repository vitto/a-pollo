'use strict'

const glob = require('glob')
const path = require('path')

function annotations (annotationsDir) {
  const annotationsPath = path.resolve(process.cwd(), annotationsDir)
  const searchPattern = '/**/*.{css,less,scss}'
  const searchPath = path.join(annotationsPath, searchPattern)

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
