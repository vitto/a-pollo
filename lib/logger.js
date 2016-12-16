'use strict'

const chalk = require('chalk')

const theme = {
  error: chalk.red.bold,
  event: chalk.magenta,
  intro: chalk.white.underline,
  notice: chalk.grey,
  speak: chalk.white,
  success: chalk.green,
  task: chalk.white,
  verbose: chalk.blue,
  warning: chalk.yellow
}

const defaults = {
  verbosity: 3
}

var isMuted = false
var verbosity = defaults.verbosity

function isVerboseEnough (verbosity) {
  if (!isMuted) {
    return defaults.verbosity >= verbosity
  }
  return false
}

function log (level, message, delay) {
  if (isVerboseEnough(level)) {
    console.log(message)
    if (typeof delay !== 'undefined') {
      var waitTill = new Date(new Date().getTime() + delay * 1000)
      while (waitTill > new Date()) { }
    }
  }
}

function logLevel (verbosityLevel) {
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

module.exports.logLevel = logLevel

module.exports.mute = function (setMute) {
  isMuted = setMute || true
  return isMuted
}

module.exports.intro = function () {
  console.log('')
  console.log(theme.intro('a-pollo'))
  console.log('')
}

module.exports.error = function (message) {
  log(0, theme.error('Error: ') + message.toString().trim())
}

module.exports.success = function (message, delay) {
  log(1, theme.success(message.toString().trim()), delay)
}

module.exports.speak = function (message, delay) {
  log(2, theme.speak(message), delay)
}

module.exports.notice = function (message, delay) {
  log(2, theme.notice('Notice: ') + message.toString().trim(), delay)
}

module.exports.warning = function (message, delay) {
  log(2, theme.warning('Warning: ') + message.toString().trim(), delay)
}

module.exports.verbose = function (title, message, delay) {
  if (message !== undefined) {
    log(3, theme.verbose(title.toString().trim() + ': ') + message.toString().trim(), delay)
  } else {
    log(3, theme.verbose(title.toString().trim()), delay)
  }
}

logLevel(defaults.verbosity)
