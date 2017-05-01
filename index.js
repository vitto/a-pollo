
/*
const logger = require('./lib/logger')
const loggerOpts = {
  muted: false,
  verbosity: 8
}

logger(loggerOpts).intro()
logger(loggerOpts).error('Hello')
console.log(logger(loggerOpts).options())
*/
const annotations = require('./lib/annotations')
const assets = require('./lib/assets')
const commandLine = require('./lib/command-line')
const configuration = require('./lib/config')
const filter = require('./lib/filter')
const parse = require('./lib/parse')
const save = require('./lib/save')
const fs = require('fs')

function initAnnotations (config, inlineCss, cb) {
  annotations(config.annotations).list(function (err, matches) {
    if (err) throw err
    filter(matches, function (err, files) {
      if (err) throw err
      parse(files, function (err, annotations) {
        if (err) throw err
        // require('./test/save-json')('../tap/data/parsed-annotations-2.json', annotations, true)
        assets.images(config, function (err, images) {
          if (err) throw err
          assets.fonts(config, function (err, fonts) {
            if (err) throw err
            save(config, {
              annotations: annotations,
              fonts: fonts,
              images: images,
              css: inlineCss
            }, function (err, config, annotations) {
              if (err) throw err
              // require('./test/save-json')('../tap/data/decorated-annotations-2.json', annotations, true)
              cb(null, config, annotations, inlineCss, images, fonts)
            })
          })
        })
      })
    })
  })
}

function aPollo (config, cb) {
  if (config instanceof Function) {
    const callback = config
    commandLine(function (args) {
      configuration(args).load(function (err, config, inlineCss) {
        if (err) throw err
        initAnnotations(config, inlineCss, callback)
      })
    })
  } else {
    const inlineCss = fs.readFileSync(config.assets.css, 'utf-8')
    initAnnotations(config, inlineCss, cb)
  }
}

module.exports = aPollo
