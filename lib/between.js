'use strict'

const defaults = require('defaults')
const optionsDefaults = {
  default: null,
  max: null,
  min: null
}

function limit (value, min, max) {
  return value <= max ? value >= min ? value : min : max
}

function between (value, options) {
  if (options === undefined) {
    throw new Error('Options cannot be empty')
  }

  options = defaults(options, optionsDefaults)

  if (value !== undefined) {
    if (typeof options.default === 'number') {
      if (isNaN(parseInt(value))) {
        return options.default
      }
    }
    return limit(value, options.min, options.max)
  } else {
    return options.default
  }
}

module.exports = between
