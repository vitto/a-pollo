
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
const commandLine = require('./lib/command-line')
const configuration = require('./lib/config')
const filter = require('./lib/filter')
const parse = require('./lib/parse')
const save = require('./lib/save')

function aPollo (cb) {
  commandLine(function (args) {
    configuration(args).load(function (err, config, inlineCss) {
      if (err) { throw err }
      annotations(config.annotations).list(function (err, matches) {
        if (err) { throw err }
        filter(matches, function (err, files) {
          if (err) { throw err }
          parse(files, function (err, docs) {
            if (err) { throw err }
            save(config, docs, function (err, config, docs) {
              if (err) { throw err }
              cb(config, docs, inlineCss)
            })
          })
        })
      })
    })
  })
}

module.exports = aPollo
