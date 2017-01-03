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
  @param: {int} ($another-name) [optional]
          Defines the block name of the BEM component
  @param: {map} ($map-name)
          Defines the block name of the BEM component
  @param: {list} ($list-name)[optional]
  @param:{last-list}($list-last-name)
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
  @icon: fa fa-developer
  @name: block
  @public: true
  @returns: css
  @text: Defines the block name of the BEM component. This mixin is required as wrapper of \`element\` and \`modifier\` mixins
  @version: 4.0.0
*/
`, `
/*
  @a-pollo
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
  tap.plan(3)
  extract.html(annotations[0], function (err, data) {
    if (err) { throw err }
    tap.equal(data.code, `<a class="button" href="#" style="width:100px;background-image:url('heilo.svg')">Visit this link</a>`)
    tap.equal(data.source, `<a class="button" data-style="width: 100px;" style="background-image:url('heilo.svg');" href="#">Visit this link</a>`)
    tap.equal(data.text, 'A simple HTML element to see how mixin works')
  })
})

test('extracts the annotation html without text', tap => {
  tap.plan(3)
  extract.html(annotations[1], function (err, data) {
    if (err) { throw err }
    tap.equal(data.code, `<a class="button" href="#" style="width:100px;background-image:url('heilo.svg')">Visit this link</a>`)
    tap.equal(data.source, `<a class="button" data-style="width: 100px;" style="background-image:url('heilo.svg');" href="#">Visit this link</a>`)
    tap.equal(data.text, '')
  })
})

test('extracts the annotation icon', tap => {
  tap.equal(extract.icon(annotations[0]), 'fa fa-css3')
  tap.equal(extract.icon(annotations[1]), 'fa fa-developer')
  tap.end()
})

test('extracts the annotation name', tap => {
  tap.equal(extract.name(annotations[0]), 'block')
  tap.equal(extract.name(annotations[1]), 'block')
  tap.end()
})

test('extracts the annotation name', tap => {
  tap.equal(extract.name(annotations[0]), 'block')
  tap.equal(extract.name(annotations[1]), 'block')
  tap.end()
})

test('extracts the annotation params', tap => {
  const params = extract.params(annotations[0])

  tap.same(params[0], {
    default: 'required',
    name: '$block-name',
    text: 'Defines the block name of the BEM component',
    type: 'string'
  })

  tap.same(params[1], {
    default: 'optional',
    name: '$another-name',
    text: 'Defines the block name of the BEM component',
    type: 'int'
  })

  tap.same(params[2], {
    default: 'optional',
    name: '$map-name',
    text: 'Defines the block name of the BEM component',
    type: 'map'
  })

  tap.same(params[3], {
    default: 'optional',
    name: '$list-name',
    text: null,
    type: 'list'
  })

  tap.same(params[4], {
    default: 'optional',
    name: '$list-last-name',
    text: null,
    type: 'last-list'
  })

  tap.end()
})

test('extracts the annotation params while not present', tap => {
  const params = extract.params(annotations[1])
  tap.equal(params, null)
  tap.end()
})

test('extracts the annotation returns', tap => {
  tap.equal(extract.returns(annotations[0]), 'css')
  tap.equal(extract.returns(annotations[2]), null)
  tap.end()
})

test('extracts the annotation text', tap => {
  tap.equal(extract.text(annotations[0]), 'Defines the block name of the BEM component. This mixin is required as wrapper of `element` and `modifier` mixins')
  tap.equal(extract.text(annotations[2]), null)
  tap.end()
})

test('extracts the annotation version', tap => {
  tap.equal(extract.version(annotations[0]), '4.0.0')
  tap.equal(extract.version(annotations[2]), null)
  tap.end()
})
