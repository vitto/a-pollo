'use strict'

const http = require('../../lib/http')
const tap = require('tap')
const test = tap.test

test('http server port and defaults', tap => {
  tap.equal(http.port('http://localhost:8000'), '8000')
  tap.equal(http.port('http://127.0.0.1:4545'), '4545')
  tap.equal(http.port('http://localhost'), '7777')
  tap.equal(http.port('http://127.0.0.1'), '7777')
  tap.end()
})
