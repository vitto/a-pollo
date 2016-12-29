'use strict'

const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')

function config (opts) {
  const configFile = path.resolve(process.cwd(), opts.config)
  const defaultConfig = opts.defaultConfig || 'a-pollo.yml'

  return {
    load: load
  }

  function load (cb) {
    const configExists = fs.existsSync(configFile)
    const configName = path.parse(configFile).base

    if (configExists) {
      cb(null, yaml.safeLoad(fs.readFileSync(configFile, 'utf-8')))
    } else if (configName === defaultConfig) {
      cb(new Error(`creating config, prompt dialog missing`))
    } else {
      cb(new Error(`config file '${configName}' not found`))
    }
  }
}

module.exports = config
