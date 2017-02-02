'use strict'

const decorate = require('../../lib/decorate-color')
const tap = require('tap')
const test = tap.test

const color = '#135AA3'
const decoratedColor = require('../tap-helper').fixtures('decorate-color')

test('generate names object with HEX color passed', tap => {
  tap.same(decorate.names(color), decoratedColor.names)
  tap.end()
})

test('generate CSS object with HEX color passed', tap => {
  tap.same(decorate.css(color), decoratedColor.css)
  tap.end()
})

test('generate channel object with HEX color passed', tap => {
  tap.same(decorate.channel(color), decoratedColor.channel)
  tap.end()
})
