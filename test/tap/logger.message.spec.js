'use strict'

const logger = require('../../lib/logger')
const strip = require('strip-ansi')
const tap = require('tap')
const test = tap.test

var hook

function captureStream (stream) {
  var oldWrite = stream.write
  var buf = ''
  stream.write = function (chunk) {
    buf += chunk.toString()
    oldWrite.apply(stream, arguments)
  }

  return {
    unhook: function unhook () {
      stream.write = oldWrite
    },
    captured: function () {
      var singleLineBuffer = strip(buf).trim().split('\n')
      return singleLineBuffer[singleLineBuffer.length - 1]
    }
  }
}

tap.beforeEach(done => {
  hook = captureStream(process.stdout)
  done()
})

tap.afterEach(done => {
  hook.unhook()
  done()
})

test('logger message intro', tap => {
  tap.plan(1)
  logger.intro()
  tap.equal(hook.captured(), 'a-pollo')
})

test('logger message error', tap => {
  tap.plan(1)
  logger.error('Something went wrong here')
  tap.equal(hook.captured(), 'Error: Something went wrong here')
})

test('logger message success', tap => {
  tap.plan(1)
  logger.success('Something went nice here')
  tap.equal(hook.captured(), 'Something went nice here')
})

test('logger message notice', tap => {
  tap.plan(1)
  logger.notice('Something just went somewhere')
  tap.equal(hook.captured(), 'Notice: Something just went somewhere')
})

test('logger message speak', tap => {
  tap.plan(1)
  logger.speak('Hello, how going here?')
  tap.equal(hook.captured(), 'Hello, how going here?')
})

test('logger message warning', tap => {
  tap.plan(1)
  logger.warning('Are you sure you checked this?')
  tap.equal(hook.captured(), 'Warning: Are you sure you checked this?')
})

test('logger message verbose short', tap => {
  tap.plan(1)
  logger.verbose('This is a short verbose message')
  tap.equal(hook.captured(), 'This is a short verbose message')
})

test('logger message verbose long', tap => {
  tap.plan(1)
  logger.verbose('Hey', 'This is a short verbose message')
  tap.equal(hook.captured(), 'Hey: This is a short verbose message')
})
