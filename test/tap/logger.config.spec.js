const logger = require('../../lib/logger')
const tap = require('tap')
const test = tap.test

test('config log level defaults', tap => {
  tap.plan(1)
  tap.equal(logger.logLevel(), 3)
})

test('config log level with valid setting', tap => {
  tap.plan(8)
  tap.equal(logger.logLevel(0), 0)
  tap.equal(logger.logLevel(1), 1)
  tap.equal(logger.logLevel(2), 2)
  tap.equal(logger.logLevel(3), 3)
  tap.equal(logger.logLevel('0'), 0)
  tap.equal(logger.logLevel('1'), 1)
  tap.equal(logger.logLevel('2'), 2)
  tap.equal(logger.logLevel('3'), 3)
})

test('config log level with not valid setting', tap => {
  var defaultVerbosity = 3
  tap.plan(7)
  tap.equal(logger.logLevel(4), defaultVerbosity)
  tap.equal(logger.logLevel('4'), defaultVerbosity)
  tap.equal(logger.logLevel(-1), defaultVerbosity)
  tap.equal(logger.logLevel('se bevi'), defaultVerbosity)
  tap.equal(logger.logLevel('33'), defaultVerbosity)
  tap.equal(logger.logLevel('-1'), defaultVerbosity)
  tap.equal(logger.logLevel('#'), defaultVerbosity)
})
