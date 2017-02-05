'use strict'

const regexUrl = /\burl\(["']?(.*\/)*([^"')]+)["']?\)/gi

function changePaths (cssData, assetsPath) {
  return cssData.replace(regexUrl, `url("${assetsPath}/$2")`)
}

module.exports.inline = changePaths
