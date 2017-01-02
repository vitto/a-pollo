'use strict'

const html = require('../../lib/html')
const tap = require('tap')
const test = tap.test

const htmlStrings = [
  `<a class="button" data-style="width: 100px;" style="background-image:url('heilo.svg')" href="#">Visit this link</a>`
]

test('extracts the annotation author', tap => {
  tap.plan(1)
  html.mergeDataStyles(htmlStrings[0], function (err, html) {
    if (err) {
      throw err
    }
    tap.equal(html, `<a class="button" href="#" style="width:100px;background-image:url('heilo.svg')">Visit this link</a>`)
  })
})
