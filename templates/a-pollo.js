const aPollo = require('a-pollo')
const beutify = require('metalsmith-beautify')
const collections = require('metalsmith-collections')
const fs = require('fs')
const markdown = require('metalsmith-markdown')
const metalsmith = require('metalsmith')
const permalinks = require('metalsmith-permalinks')
const twig = require('metalsmith-twig')
const yaml = require('js-yaml')

aPollo({
  annotations: 'sass',
  build: './tmp',
  posts: './markdown',
  index: true,
  assets: {
    css: 'css/example.css',
    fonts: 'css/fonts',
    images: 'css/img'
  }
}, function (err, config, docs, css, images, fonts) {
  if (err) throw err
  var m = yaml.safeLoad(fs.readFileSync('metalsmith.yml', 'utf-8'))
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
})
