'use strict'

const extract = require('../../lib/extract')
const tap = require('tap')
const test = tap.test

const annotations = [`
/*
  @a-pollo
  @author: Vittorio Vittori
  @category: BEM
  @code: Example on using the mixin block with some static property
    @include block (button) {
      background: #3f6c44;
      color: #fff;
      display: inline-block;
      font-size: 12px;
      padding: 4px 8px;
    }
  @css: This is the CSS generated
    .button {
      background: #3f6c44;
      color: #fff;
      display: inline-block;
      font-size: 12px;
      padding: 4px 8px;
    }
  @date: 2016-12-28T17:40:42+01:00
  @doc: mixin
  @html: A simple HTML element to see how mixin works
    <a class="button" data-style="width: 100px;" style="background-image:url('heilo.svg');" href="#">Visit this link</a>
  @icon: fa fa-css3
  @name: block
  @param: {string} ($block-name) [required]
          Defines the block name of the BEM component
  @public: true
  @returns: css
  @text: Defines the block name of the BEM component. This mixin is required as wrapper of \`element\` and \`modifier\` mixins
  @version: 4.0.0
*/
`, `
/*
  @a-pollo
  @author: Vittorio Vittori
  @category: BEM
  @code:
    @include block (button) {
      background: #3f6c44;
      color: #fff;
      display: inline-block;
      font-size: 12px;
      padding: 4px 8px;
    }
  @css:
    .button {
      background: #3f6c44;
      color: #fff;
      display: inline-block;
      font-size: 12px;
      padding: 4px 8px;
    }
  @date:2016-12-31T15:42:05+01:00
  @html:
    <a class="button" data-style="width: 100px;" style="background-image:url('heilo.svg');" href="#">Visit this link</a>
  @icon: fa fa-css3
  @name: block
  @param: {string} ($block-name) [required]
          Defines the block name of the BEM component
  @param: {boolean} ($active) [false]
          Defines if the element is active or not by default
  @public: true
  @returns: css
  @text: Defines the block name of the BEM component. This mixin is required as wrapper of \`element\` and \`modifier\` mixins
  @version: 4.0.0
*/
`]

const codeExtracted = `@include block (button) {
  background: #3f6c44;
  color: #fff;
  display: inline-block;
  font-size: 12px;
  padding: 4px 8px;
}`

const cssExtracted = `.button {
  background: #3f6c44;
  color: #fff;
  display: inline-block;
  font-size: 12px;
  padding: 4px 8px;
}`

const htmlExtracted = `<a class="button" data-style="width: 100px;" style="background-image:url('heilo.svg')" href="#">Visit this link</a>`
const htmlExtractedAlt = `<a class="button" style="width: 100px; background-image:url('heilo.svg')" href="#">Visit this link</a>`

test('extracts the annotation author', tap => {
  tap.equal(extract.author(annotations[0]), 'Vittorio Vittori')
  tap.end()
})

test('extracts the annotation category', tap => {
  tap.equal(extract.category(annotations[0]), 'BEM')
  tap.end()
})

test('extracts the annotation code', tap => {
  const code = extract.code(annotations[0]).code
  const text = extract.code(annotations[0]).text

  tap.equal(code, codeExtracted)
  tap.equal(text, 'Example on using the mixin block with some static property')
  tap.end()
})

test('extracts the annotation code without text', tap => {
  const code = extract.code(annotations[1]).code
  const text = extract.code(annotations[1]).text

  tap.equal(code, codeExtracted)
  tap.equal(text, '')
  tap.end()
})

test('extracts the annotation css', tap => {
  const code = extract.css(annotations[0]).code
  const text = extract.css(annotations[0]).text

  tap.equal(code, cssExtracted)
  tap.equal(text, 'This is the CSS generated')
  tap.end()
})

test('extracts the annotation css without text', tap => {
  const code = extract.css(annotations[1]).code
  const text = extract.css(annotations[1]).text

  tap.equal(code, cssExtracted)
  tap.equal(text, '')
  tap.end()
})

test('extracts the annotation date', tap => {
  tap.equal(extract.date(annotations[0]), '2016-12-28T17:40:42+01:00')
  tap.equal(extract.date(annotations[1]), '2016-12-31T15:42:05+01:00')
  tap.end()
})

test('extracts the annotation doc', tap => {
  tap.equal(extract.doc(annotations[0]), 'mixin')
  tap.equal(extract.doc(annotations[1]), 'snippet')
  tap.end()
})

test('checks if the string has annotations', tap => {
  tap.equal(extract.hasAnnotations(annotations[0]), true)
  tap.equal(extract.hasAnnotations(cssExtracted), false)
  tap.end()
})

test('extracts the annotation html', tap => {
  tap.plan(2)
  extract.html(annotations[0], function (data) {
    tap.equal(data.code, htmlExtracted)
  })
  extract.html(annotations[0], function (data) {
    tap.equal(data.text, 'A simple HTML element to see how mixin works')
  })
})

// test('extracts the annotation html without text', tap => {
//   const code = extract.html(annotations[1]).code
//   const text = extract.html(annotations[1]).text
//
//   tap.equal(code, htmlExtracted)
//   tap.equal(text, '')
//   tap.end()
// })
