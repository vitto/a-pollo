'use strict'

const expect = require('expect')
const logger = require('../../lib/logger')
const strip = require('strip-ansi')

describe ('lib/logger.js', function () {
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
        return strip(buf).trim()
      }
    }
  }

  var hook

  beforeEach (function () {
    hook = captureStream(process.stdout)
  })

  afterEach (function () {
    hook.unhook()
  })

  describe('config', function () {
    var errorMessage = 'Log level set is out of bounds'

    it('set log level', function (done) {
      expect(logger.logLevel(0)).toBe(0, errorMessage)
      expect(logger.logLevel(1)).toBe(1, errorMessage)
      expect(logger.logLevel(2)).toBe(2, errorMessage)
      expect(logger.logLevel(3)).toBe(3, errorMessage)
      expect(logger.logLevel('0')).toBe(0, errorMessage)
      expect(logger.logLevel('1')).toBe(1, errorMessage)
      expect(logger.logLevel('2')).toBe(2, errorMessage)
      expect(logger.logLevel('3')).toBe(3, errorMessage)
      done()
    })

    it('sanitize log level', function (done) {
      var defaultVerbosity = 3
      expect(logger.logLevel(4)).toBe(defaultVerbosity, errorMessage)
      expect(logger.logLevel('4')).toBe(defaultVerbosity, errorMessage)
      expect(logger.logLevel(-1)).toBe(defaultVerbosity, errorMessage)
      expect(logger.logLevel('se bevi')).toBe(defaultVerbosity, errorMessage)
      expect(logger.logLevel('33')).toBe(defaultVerbosity, errorMessage)
      expect(logger.logLevel('-1')).toBe(defaultVerbosity, errorMessage)
      done()
    })
  })

  describe('message', function() {
    it('logs intro message', function() {
      logger.intro()
      expect(hook.captured()).toBe('a-pollo', 'intro message is wrong')
    })

    it('logs error message', function() {
      logger.error('Something went wrong here')
      expect(hook.captured()).toBe('Error: Something went wrong here', 'error message is wrong')
    })

    it('logs success message', function() {
      logger.success('Something went nice here')
      expect(hook.captured()).toBe('Something went nice here', 'success message is wrong')
    })

    it('logs notice message', function(done) {
      logger.notice('Something just went somewhere')
      expect(hook.captured()).toBe('Notice: Something just went somewhere', 'notice message is wrong')
      done()
    })

    it('logs speak message', function(done) {
      logger.speak('Hello, how going here?')
      expect(hook.captured()).toBe('Hello, how going here?', 'speak message is wrong')
      done()
    })

    it('logs warning message', function(done) {
      logger.warning('Are you sure you checked this?')
      expect(hook.captured()).toBe('Warning: Are you sure you checked this?', 'warning message is wrong')
      done()
    })

    it('logs short verbose message', function(done) {
      logger.verbose('This is a short verbose message')
      expect(hook.captured()).toBe('This is a short verbose message', 'verbose message is wrong')
      done()
    })

    it('logs full verbose message', function(done) {
      logger.verbose('Hey', 'This is a short verbose message')
      expect(hook.captured()).toBe('Hey: This is a short verbose message', 'verbose message is wrong')
      done()
    })
  })
})
