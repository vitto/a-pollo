const aPollo = require('../../index')
const fs = require('fs')
const beutify = require('metalsmith-beautify')
const collections = require('metalsmith-collections')
const markdown = require('metalsmith-markdown')
const metalsmith = require('metalsmith')
const permalinks = require('metalsmith-permalinks')
const twig = require('metalsmith-twig')
const yaml = require('js-yaml')
const ncp = require('ncp').ncp

function generator (css) {
  var m = yaml.safeLoad(fs.readFileSync('a-pollo-metalsmith.yml', 'utf-8'))
  m.twig.global = {
    css: css
  }
  metalsmith(__dirname)
    .metadata(m.metadata)
    .source(m.source)
    .destination(m.destination)
    .clean(m.clean)
    .use(collections(m.collections))
    .use(markdown(m.markdown))
    .use(permalinks(m.permalinks))
    .use(twig(m.twig))
    .use(beutify(m.beautify))
    .build(function (err) {
      if (err) throw err
      console.log('Build done')
    })
}

aPollo({
  annotations: 'sass',
  build: './tmp',
  posts: './markdown',
  index: '../test.md',
  assets: {
    css: 'css/example.css',
    fonts: 'css/fonts',
    images: 'css/img'
  }
}, function (err, config, docs, css, images, fonts) {
  if (err) throw err
  ncp('../../theme/dist/a-pollo', 'tmp/a-pollo', function (err) {
    if (err) throw err
    generator(css)
  })
})
