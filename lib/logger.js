'use strict'

const chalk = require('chalk')
const defaults = require('defaults')
const between = require('./between')
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
const defaultsOptions = {
  muted: false,
  verbosity: 3
}

function logger (opts) {
  const options = {
    muted: defaults(opts, defaultsOptions).muted,
    verbosity: between(defaults(opts, defaultsOptions).verbosity, { min: 0, max: 3 })
  }

  return {
    options: function () {
      return options
    },
    error: error,
    intro: intro,
    notice: notice,
    speak: speak,
    success: success,
    verbose: verbose,
    warning: warning
  }

  function isVerboseEnough (verbose) {
    if (!options.muted) {
      return options.verbosity >= verbose
    }
    return false
  }

  function log (level, message, delay) {
    if (isVerboseEnough(level)) {
      console.log(message)
      if (delay !== undefined) {
        var waitTill = new Date(new Date().getTime() + delay * 1000)
        while (waitTill > new Date()) { }
      }
    }
  }

  function intro () {
    console.log('')
    console.log(theme.intro('a-pollo'))
    console.log('')
  }

  function error (message) {
    log(0, theme.error('Error: ') + message.toString().trim())
  }

  function success (message, delay) {
    log(1, theme.success(message.toString().trim()), delay)
  }

  function speak (message, delay) {
    log(2, theme.speak(message), delay)
  }

  function notice (message, delay) {
    log(2, theme.notice('Notice: ') + message.toString().trim(), delay)
  }

  function warning (message, delay) {
    log(2, theme.warning('Warning: ') + message.toString().trim(), delay)
  }

  function verbose (title, message, delay) {
    if (message !== undefined) {
      log(3, theme.verbose(title.toString().trim() + ': ') + message.toString().trim(), delay)
    } else {
      log(3, theme.verbose(title.toString().trim()), delay)
    }
  }
}

module.exports = logger
