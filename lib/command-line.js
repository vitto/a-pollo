'use strict'

const ansi = require('ansi-escape-sequences')
const commandLineArgs = require('command-line-args')
const commandLineUsage = require('command-line-usage')
const fs = require('fs')
const path = require('path')

const header = require('./command-line-header')
const logger = require('./logger')

const defaultConfigName = 'a-pollo.yml'
const packagePath = path.resolve(__dirname, '../package.json')
const optionDefinitions = [
  {
    alias: 'c',
    defaultOption: true,
    defaultValue: path.resolve(process.cwd(), defaultConfigName),
    description: 'The configuration file a-pollo will use to handle your CSS style guide.',
    name: 'config',
    type: String,
    typeLabel: `[underline]{file}`
  }, {
    alias: 'h',
    defaultValue: false,
    description: 'Print this usage guide.',
    name: 'help',
    type: Boolean
  }, {
    defaultValue: 3,
    description: 'Set the log level of the builds',
    name: 'verbose',
    type: Number,
    typeLabel: `[underline]{int}`
  }, {
    alias: 'v',
    description: 'Gets a-pollo release version',
    name: 'version'
  }
]

const optionDefinitionsUsage = [
  {
    content: ansi.format(header, 'red'),
    raw: true
  },
  {
    header: 'a-pollo',
    content: 'Command line usage guide'
  },
  {
    header: 'Options',
    optionList: optionDefinitions
  }
]

function version () {
  try {
    const packageFile = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
    logger().speak(packageFile.version)
  } catch (err) {
    logger().error(`File '${packagePath}' not found, see below for details`)
    console.error(err)
  }
}

function commandLine (cb) {
  const args = commandLineArgs(optionDefinitions)
  if (args.help) {
    console.log(commandLineUsage(optionDefinitionsUsage))
  } else if (args.version) {
    version()
  } else {
    cb({
      config: args.config,
      defaultConfig: defaultConfigName,
      verbosity: args.verbose
    })
  }
}

module.exports = commandLine
