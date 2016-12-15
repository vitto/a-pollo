'use strict'

// https://github.com/edelprino/ritardato/blob/master/index.js

const colour = require('colour')

colour.setTheme({
  error: 'red bold',
  event: 'magenta',
  intro: 'rainbow',
  notice: 'grey',
  speak: 'white',
  success: 'green',
  task: 'white',
  verbose: 'blue',
  warning: 'yellow'
})

const defaults = {
  verbosity: 3
}

var verbosity = defaults.verbosity

var isVerboseEnough = function (verbosity) {
  return defaults.verbosity >= verbosity
}

var log = function (level, message, delay) {
  if (isVerboseEnough(level)) {
    console.log(message)
    if (typeof delay !== 'undefined') {
      var waitTill = new Date(new Date().getTime() + delay * 1000)
      while (waitTill > new Date()) { }
    }
  }
}

var logLevel = function (verbosityLevel) {
  if (typeof verbosityLevel === 'string') {
    if (verbosityLevel === parseInt(verbosityLevel).toString()) {
      verbosityLevel = parseInt(verbosityLevel)
    }
  }

  if (typeof verbosityLevel === 'number') {
    if (verbosityLevel >= 0 && verbosityLevel <= 3) {
      verbosity = verbosityLevel
    }
  }
  return verbosity
}

module.exports.logLevel = function (level) {
  return logLevel(level)
}

module.exports.intro = function () {
  console.log('')
  console.log(colour.intro('a-pollo'))
  console.log('')
}

module.exports.error = function (message) {
  log(0, colour.error('Error: ') + message.toString().trim())
}

module.exports.success = function (message, delay) {
  log(1, colour.success(message.toString().trim()), delay)
}

module.exports.speak = function (message, delay) {
  log(2, colour.speak(message), delay)
}

module.exports.notice = function (message, delay) {
  log(2, colour.notice('Notice: ') + message.toString().trim(), delay)
}

module.exports.warning = function (message, delay) {
  log(2, colour.warning('Warning: ') + message.toString().trim(), delay)
}

module.exports.verbose = function (title, message, delay) {
  if (message !== undefined) {
    log(3, colour.verbose(title.toString().trim() + ': ') + message.toString().trim(), delay)
  } else {
    log(3, colour.verbose(title.toString().trim()), delay)
  }
}

logLevel(defaults.verbosity)
