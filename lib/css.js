'use strict'

const assetsPath = 'assets'
const regexUrl = /\burl\(["']?(.*\/)*([^"')]+)["']?\)/gi

function changePaths (cssData, assetsPath) {
  return cssData.replace(regexUrl, `url("${assetsPath}/$2")`)
}

module.exports.changePaths = changePaths
