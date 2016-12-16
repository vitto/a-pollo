'use strict'

const fs = require('fs')
const logger = require('./logger')
const path = require('path')
const shell = require('shelljs')

module.exports.muteLogger = logger.mute

function hexoPath () {
  return path.dirname(path.resolve(process.env.PWD, 'hexo/_default_config.yml'))
}

function nodeModulesPath () {
  return path.resolve(process.env.PWD, 'node_modules')
}

function hasHexoModules () {
  return shell.test('-e', hexoPath() + '/node_modules')
}

module.exports.hasHexoModules = hasHexoModules

module.exports.unlink = function () {
  if (hasHexoModules()) {
    fs.unlinkSync(hexoPath() + '/node_modules')
  }
}

module.exports.set = function () {
  if (!hasHexoModules()) {
    fs.symlinkSync(nodeModulesPath(), hexoPath() + '/node_modules')
    logger.verbose('Done with linking dependencies')
  }
}
