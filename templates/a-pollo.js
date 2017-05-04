const aPollo = require('a-pollo')
const beutify = require('metalsmith-beautify')
const collections = require('metalsmith-collections')
const fs = require('fs')
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
  annotations: 'core',
  build: './node_modules/a-pollo/tmp',
  posts: './wiki',
  index: true,
  assets: {
    css: 'test/css/frontsize.test.css',
    // fonts: 'css/fonts',
    images: 'themes/default/img'
  }
}, function (err, config, docs, css, images, fonts) {
  if (err) throw err
  ncp('node_modules/a-pollo/theme/dist/a-pollo/*', 'node_modules/a-pollo/tmp/a-pollo/', function (err) {
    if (err) throw err
    generator(css)
  })
})
