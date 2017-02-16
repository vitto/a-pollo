
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

function aPollo (cb) {
  commandLine(function (args) {
    configuration(args).load(function (err, config, inlineCss) {
      if (err) throw err
      annotations(config.annotations).list(function (err, matches) {
        if (err) throw err
        filter(matches, function (err, files) {
          if (err) throw err
          parse(files, function (err, annotations) {
            if (err) throw err
            assets.build(config, function (err) {
              if (err) throw err
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
                    cb(config, annotations, inlineCss, images, fonts)
                  })
                })
              })
            })
          })
        })
      })
    })
  })
}

module.exports = aPollo
