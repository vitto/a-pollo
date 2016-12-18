'use strict'

const between = require('../../lib/between')
const tap = require('tap')
const test = tap.test

test('between value limit', tap => {
  tap.equal(between(-3, { default: 3, min: 0, max: 5 }), 0)
  tap.equal(between(-2, { default: 3, min: 0, max: 5 }), 0)
  tap.equal(between(-1, { default: 3, min: 0, max: 5 }), 0)
  tap.equal(between(0, { default: 3, min: 0, max: 5 }), 0)
  tap.equal(between(1, { default: 3, min: 0, max: 5 }), 1)
  tap.equal(between(2, { default: 3, min: 0, max: 5 }), 2)
  tap.equal(between(3, { default: 3, min: 0, max: 5 }), 3)
  tap.equal(between(4, { default: 3, min: 0, max: 5 }), 4)
  tap.equal(between(5, { default: 3, min: 0, max: 5 }), 5)
  tap.equal(between(6, { default: 3, min: 0, max: 5 }), 5)
  tap.equal(between(7, { default: 3, min: 0, max: 5 }), 5)
  tap.equal(between(8, { default: 3, min: 0, max: 5 }), 5)
  tap.equal(between(null, { default: 3, min: 0, max: 5 }), 3)
  tap.equal(between(undefined, { default: 3, min: 0, max: 5 }), 3)
  tap.end()
})
