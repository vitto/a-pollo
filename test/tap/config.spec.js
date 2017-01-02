'use strict'

const config = require('../../lib/config')
const tap = require('tap')
const test = tap.test

const existingDefaultConfig = 'a-pollo.yml'

test('fails to load custom config', tap => {
  tap.plan(1)

  config({
    config: 'non-existing-config.yml',
    defaultConfig: existingDefaultConfig,
    verbosity: 3
  }).load(function (err, data) {
    tap.throws(function () {
      throw err
    }, new Error(`config file 'non-existing-config.yml' not found`))
  })
})

test('fails to load default config', tap => {
  tap.plan(1)

  config({
    config: 'simulate-default-config.yml',
    defaultConfig: 'simulate-default-config.yml',
    verbosity: 3
  }).load(function (err, data) {
    tap.throws(function () {
      throw err
    }, new Error(`creating config, prompt dialog missing`))
  })
})

test('loads default config', tap => {
  tap.plan(1)

  config({
    config: existingDefaultConfig,
    defaultConfig: existingDefaultConfig,
    verbosity: 3
  }).load(function (err, data) {
    if (err) {
      throw err
    }
    tap.ok(data)
  })
})
