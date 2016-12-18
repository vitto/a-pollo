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
  logger().intro()
  tap.equal(hook.captured(), 'a-pollo')
  tap.end()
})

test('logger message error', tap => {
  logger().error('Something went wrong here')
  tap.equal(hook.captured(), 'Error: Something went wrong here')
  tap.end()
})

test('logger message success', tap => {
  logger().success('Something went nice here')
  tap.equal(hook.captured(), 'Something went nice here')
  tap.end()
})

test('logger message notice', tap => {
  logger().notice('Something just went somewhere')
  tap.equal(hook.captured(), 'Notice: Something just went somewhere')
  tap.end()
})

test('logger message speak', tap => {
  logger().speak('Hello, how going here?')
  tap.equal(hook.captured(), 'Hello, how going here?')
  tap.end()
})

test('logger message warning', tap => {
  logger().warning('Are you sure you checked this?')
  tap.equal(hook.captured(), 'Warning: Are you sure you checked this?')
  tap.end()
})

test('logger message verbose short', tap => {
  logger().verbose('This is a short verbose message')
  tap.equal(hook.captured(), 'This is a short verbose message')
  tap.end()
})

test('logger message verbose long', tap => {
  logger().verbose('Hey', 'This is a short verbose message')
  tap.equal(hook.captured(), 'Hey: This is a short verbose message')
  tap.end()
})

test('logger message verbose long', tap => {
  logger({ verbosity: 0 }).verbose('Hey', 'This is a short verbose message')
  tap.equal(hook.captured(), '')
  tap.end()
})

test('logger message verbose long', tap => {
  logger({ muted: true }).verbose('Hey', 'This is a short verbose message')
  tap.equal(hook.captured(), '')
  tap.end()
})

test('logger message verbose long', tap => {
  tap.plan(1)
  logger({ delay: 100 }).verbose('Delayed message')
  tap.equal(hook.captured(), 'Delayed message')
})
