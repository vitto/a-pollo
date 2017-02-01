'use strict'

const Color = require('color')

function css (value) {
  const color = Color(value)
  return {
    rgb: color.rgb().round().string(),
    hsl: color.hsl().round().string(),
    hex: color.hex()
  }
}

function object (value) {
  const color = Color(value)
  const cmyk = color.cmyk().round().color
  return {
    rgb: color.rgb().object(),
    hsl: color.hsl().round().object(),
    cmyk: {
      'c': cmyk[0],
      'm': cmyk[1],
      'y': cmyk[2],
      'k': cmyk[3]
    }
  }
}

module.exports.css = css
module.exports.object = object
