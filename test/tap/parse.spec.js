'use strict'

const files = require('../tap-helper').fixtures('parse-files')
const parse = require('../../lib/parse')
const tap = require('tap')
const test = tap.test

test('parse files to docs annotations objects', tap => {
  tap.plan(2)
  parse(files, function (err, docs) {
    if (err) { throw err }
    tap.equal(files.length, 4)
    tap.equal(docs.length, 22)
  })
})
