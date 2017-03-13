'use strict'

const async = require('async')
const fs = require('fs')
const glob = require('glob')
const imageinfo = require('imageinfo')
const ncp = require('ncp').ncp
const path = require('path')
const prettyBytes = require('pretty-bytes')
const sizeOf = require('image-size')

function save (config, cb) {
  if (config.assets) {
    var sources = []
    if (config.assets.fonts) { sources.push(config.assets.fonts) }
    if (config.assets.images) { sources.push(config.assets.images) }
  } else {
    cb()
    return
  }
  async.each(sources,
    function (source, done) {
      const destination = path.join(config.build, path.parse(source).base)
      ncp(source, destination, function (err) {
        if (err) throw err
        done(null)
      })
    },
    function (err) {
      if (err) throw err
      cb(null)
    }
  )
}

function image (file, data, dimensions) {
  var filePath = path.parse(file)
  const info = imageinfo(data)
  const size = prettyBytes(data.length)
  filePath.full = path.join(filePath.dir, filePath.base)

  if (info) {
    return {
      format: info.format,
      mimeType: info.mimeType,
      size: size,
      width: info.width,
      height: info.height,
      path: filePath
    }
  } else {
    return {
      format: 'SVG',
      mimeType: 'image/svg+xml',
      size: size,
      width: dimensions.width,
      height: dimensions.height,
      path: filePath
    }
  }
}

function imageFiles (searchPath, cb) {
  glob(searchPath, function (err, files) {
    if (err) throw err
    if (files.length === 0) {
      cb(new Error(`No image files found in search`))
    } else {
      var filesFound = []
      async.each(files,
        function (file, done) {
          fs.readFile(file, function (err, data) {
            if (err) throw err
            sizeOf(file, function (err, dimensions) {
              if (err) throw err
              filesFound.push(image(file, data, dimensions))
              done()
            })
          })
        },
        function (err) {
          if (err) throw err
          cb(null, filesFound)
        }
      )
    }
  })
}

function fontsFiles (searchPath, cb) {
  glob(searchPath, function (err, files) {
    if (err) throw err
    if (files.length === 0) {
      cb(new Error(`No font files found in search`))
    } else {
      var filesFound = []
      async.each(files,
        function (file, done) {
          fs.readFile(file, function (err, data) {
            if (err) throw err
            filesFound.push({
              name: path.parse(file).name.replace(/(-)+/g, ' ').replace(/(([a-z])([A-Z]))+/g, '$2 $3'),
              file: file,
              size: prettyBytes(data.length),
              path: path.parse(file)
            })
            done()
          })
        },
        function (err) {
          if (err) throw err
          cb(null, filesFound)
        }
      )
    }
  })
}

function images (config, cb) {
  if (!config.assets) { cb(); return }
  if (!config.assets.images) { cb(); return }
  const searchPattern = '/**/*.{png,svg,svgz,jpg,jpeg,PNG,SVG,SVGZ,JPG,JPEG}'
  const searchPath = path.join(config.assets.images, searchPattern)
  imageFiles(searchPath, cb)
}

function fonts (config, cb) {
  if (!config.assets) { cb(); return }
  if (!config.assets.fonts) { cb(); return }
  const searchPattern = '/**/*.{eot,woff2,woff,ttf,svg,EOT,WOFF2,WOFF,TTF,SVG}'
  const searchPath = path.join(config.assets.fonts, searchPattern)
  fontsFiles(searchPath, cb)
}

module.exports.save = save
module.exports.fonts = fonts
module.exports.images = images
