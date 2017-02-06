'use strict'

const async = require('async')
const ncp = require('ncp').ncp
const path = require('path')
const rimraf = require('rimraf')

function assets (config, cb) {
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
      const destination = path.join(config.cache, path.parse(source).base)
      rimraf(destination, function (err) {
        if (err) { throw err }
        ncp(source, destination, function (err) {
          if (err) { throw err }
          done(null)
        })
      })
    },
    function (err) {
      if (err) { cb(err) }
      cb(null)
    }
  )
}

module.exports = assets
