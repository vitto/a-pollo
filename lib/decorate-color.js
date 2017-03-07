'use strict'

const Color = require('color')
const namer = require('color-namer')

function css (value) {
  const color = Color(value)
  const c = color.cmyk().round().color[0]
  const m = color.cmyk().round().color[1]
  const y = color.cmyk().round().color[2]
  const k = color.cmyk().round().color[3]
  return {
    rgb: color.rgb().round().string(),
    hsl: color.hsl().round().string(),
    hex: color.hex(),
    cmyk: `cmyk(${c}%, ${m}%, ${y}%, ${k}%)`
  }
}

function channel (value) {
  const color = Color(value)
  const cmyk = color.cmyk().round().color
  const hsl = color.hsl().round().color
  return {
    cmyk: {
      c: cmyk[0],
      m: cmyk[1],
      y: cmyk[2],
      k: cmyk[3]
    },
    hsl: {
      h: hsl[0],
      s: hsl[1],
      l: hsl[2]
    },
    rgb: color.rgb().object()
  }
}

function names (value) {
  const color = Color(value)
  const names = namer(color.hex())
  return {
    basic: names.basic[0].name,
    html: names.html[0].name,
    ntc: names.ntc[0].name,
    pantone: names.pantone[0].name,
    roygbiv: names.roygbiv[0].name,
    x11: names.x11[0].name
  }
}

module.exports.css = css
module.exports.names = names
module.exports.channel = channel
