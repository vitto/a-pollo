const fs = require('fs')
const yaml = require('js-yaml')

const aPollo = require('../../index')

const beutify = require('metalsmith-beautify')
const collections = require('metalsmith-collections')
const layouts = require('metalsmith-layouts')
const markdown = require('metalsmith-markdown')
const metalsmith = require('metalsmith')
const permalinks = require('metalsmith-permalinks')

aPollo(function (config, docs, map, inlineCss, images, fonts) {
  var m = yaml.safeLoad(fs.readFileSync('metalsmith.yml', 'utf-8'))
  m.metadata.css = inlineCss
  m.metadata.map = map
  metalsmith(__dirname)
    .metadata(m.metadata)
    .source(m.source)
    .destination(m.destination)
    .clean(m.clean)
    .use(collections(m.collections))
    .use(markdown(m.markdown))
    .use(permalinks(m.permalinks))
    .use(layouts(m.layouts))
    .use(beutify(m.beautify))
    .build(function (err) {
      if (err) throw err
      console.log('Build done')
    })
})
