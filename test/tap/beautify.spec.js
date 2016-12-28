'use strict'

const beautify = require('../../lib/beautify')
const tap = require('tap')
const test = tap.test

test('beautify html with preset config', tap => {
  const htmlSource = '<div class="class-selector"><div class="child-class-selector"></div></div>'
  const htmlResult = '<div class="class-selector">\n  <div class="child-class-selector"></div>\n</div>'
  tap.equal(beautify.html(htmlSource), htmlResult)
  tap.end()
})
