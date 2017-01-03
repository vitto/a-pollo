'use strict'

const fs = require('fs')
const extract = require('./extract')

function filter (matches, cb) {
  var fileData, files
  files = []
  matches.forEach(function (filePath) {
    fileData = fs.readFileSync(filePath, 'utf8')
    if (extract.hasAnnotations(fileData)) {
      files.push({
        data: fileData,
        path: filePath
      })
    }
  })

  if (files.length !== 0) {
    cb(null, files)
  } else {
    cb(new Error(`No docs data found inside documents list`))
  }
}

module.exports = filter
