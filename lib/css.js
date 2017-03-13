'use strict'

const regexUrl = /\burl\(["']?(.*\/)*([^"')]+)["']?\)/gi

function changePaths (assets, cssData) {
  const imagesSourceRegex = new RegExp(assets.images.urlSource, 'g')
  const fontsSourceRegex = new RegExp(assets.fonts.urlSource, 'g')
  return cssData.replace(imagesSourceRegex, assets.images.urlReplace).replace(fontsSourceRegex, assets.fonts.urlReplace)
}

module.exports.changePaths = changePaths
