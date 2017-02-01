
/*
const logger = require('./lib/logger')
const loggerOpts = {
  muted: false,
  verbosity: 8
}

logger(loggerOpts).intro()
logger(loggerOpts).error('Hello')
console.log(logger(loggerOpts).options())
*/

const fs = require('fs')
const yaml = require('js-yaml')
const collections = require('metalsmith-collections')
const layouts = require('metalsmith-layouts')
const markdown = require('metalsmith-markdown')
const metalsmith = require('metalsmith')
const permalinks = require('metalsmith-permalinks')
const aPollo = require('../../index')

aPollo(function (config, docs) {
  const m = yaml.safeLoad(fs.readFileSync('test/samples/metalsmith.yml', 'utf-8'))
  metalsmith(__dirname)
    .metadata(m.metadata)
    .source(m.source)
    .destination(m.destination)
    .clean(m.clean)
    .use(collections(m.collections))
    .use(markdown(m.markdown))
    .use(permalinks(m.permalinks))
    .use(layouts(m.layouts))
    .build(function (err) {
      if (err) { throw err }
      console.log('Build done')
    })
})
