'use strict'

const annotations = require('../../lib/annotations')
const tap = require('tap')
const test = tap.test

test('load file list of annotations', tap => {
  tap.plan(1)

  annotations('test/samples/sass').list(function (err, data) {
    if (err) {
      throw err
    }
    tap.notEqual(data.length, 0)
  })
})

test('load empty file list of annotations', tap => {
  tap.plan(1)

  annotations('non/existing/folder').list(function (err) {
    tap.throws(function () {
      throw err
    }, new Error(`No annotations found in search`))
  })
})
