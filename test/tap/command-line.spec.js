'use strict'

const commandLine = require('../../lib/command-line')
const tap = require('tap')
const test = tap.test

test('gets defaults parameters from command line', tap => {
  commandLine(function (args) {
    tap.match(args.config, 'a-pollo.yml')
    tap.equal(args.defaultConfig, 'a-pollo.yml')
    tap.equal(args.verbosity, 3)
  })
  tap.end()
})
