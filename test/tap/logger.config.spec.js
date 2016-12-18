'use strict'

const logger = require('../../lib/logger')
const tap = require('tap')
const test = tap.test

test('config log level defaults', tap => {
  var options = logger({ muted: false, verbosity: 3 }).options()
  tap.equal(options.muted, false)
  tap.equal(options.verbosity, 3)

  options = logger({ muted: true, verbosity: 0 }).options()
  tap.equal(options.muted, true)
  tap.equal(options.verbosity, 0)

  options = logger({ muted: true, verbosity: -1 }).options()
  tap.equal(options.muted, true)
  tap.equal(options.verbosity, 0)

  options = logger({ muted: true, verbosity: 8 }).options()
  tap.equal(options.muted, true)
  tap.equal(options.verbosity, 3)

  options = logger().options()
  tap.equal(options.muted, false)
  tap.equal(options.verbosity, 3)

  tap.end()
})
