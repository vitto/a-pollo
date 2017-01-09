'use strict'

const decorator = require('../../lib/decorator')
const tap = require('tap')
const test = tap.test

const decoratedAnnotations = require('../tap-helper').fixtures('decorated-annotations')
const docsPath = './test/samples/sass/frontsize'
const parsedAnnotations = require('../tap-helper').fixtures('parsed-annotations')

test('generates two elements', tap => {
  const decoratedData = decorator.sortByDocumentation({
    annotations: parsedAnnotations,
    slugBase: 'docs',
    filter: 'doc',
    path: docsPath
  }).concat(decorator.sortBySource({
    annotations: parsedAnnotations,
    slugBase: 'snippets',
    filter: 'snippet',
    path: docsPath
  }))

  tap.same(decoratedData, decoratedAnnotations)
  tap.end()
})
