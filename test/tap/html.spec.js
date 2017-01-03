'use strict'

const html = require('../../lib/html')
const tap = require('tap')
const test = tap.test

const htmlStrings = [
  `<a class="button" data-style="width: 100px;" style="background-image:url('heilo.svg')" href="#">Visit this link</a>`,
  `<a class="button" data-style="width: 100px" style="background-image:url('heilo.svg');" href="#">Visit this link</a>`,
  `<a class="button" style="background-image:url('heilo.svg');" href="#">Visit this link</a>`,
  `<a class="button" data-style="oveflow:auto" href="#">Visit this link</a>`
]

test('merge data-styles', tap => {
  tap.plan(2)
  html.mergeDataStyles(htmlStrings[0], function (err, html) {
    if (err) { throw err }
    tap.equal(html, `<a class="button" href="#" style="width:100px;background-image:url('heilo.svg')">Visit this link</a>`)
  })
  html.mergeDataStyles(htmlStrings[1], function (err, html) {
    if (err) { throw err }
    tap.equal(html, `<a class="button" href="#" style="width:100px;background-image:url('heilo.svg');">Visit this link</a>`)
  })
})

test('merge data-styles if not present', tap => {
  tap.plan(1)
  html.mergeDataStyles(htmlStrings[2], function (err, html) {
    if (err) {
      throw err
    }
    tap.equal(html, `<a class="button" style="background-image:url('heilo.svg');" href="#">Visit this link</a>`)
  })
})

test('merge data-styles only', tap => {
  tap.plan(1)
  html.mergeDataStyles(htmlStrings[3], function (err, html) {
    if (err) {
      throw err
    }
    tap.equal(html, `<a class="button" href="#" style="oveflow:auto">Visit this link</a>`)
  })
})
