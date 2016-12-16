const collections = require('metalsmith-collections')
const layouts = require('metalsmith-layouts')
const markdown = require('metalsmith-markdown')
const metalsmith = require('metalsmith')
const permalinks = require('metalsmith-permalinks')

const source = './test/samples/metalsmith/'

metalsmith(__dirname)
  .metadata({
    sitename: 'My Static Site & Blog',
    siteurl: 'http://example.com/',
    description: 'It\'s about saying »Hello« to the world.',
    generatorname: 'Metalsmith',
    generatorurl: 'http://metalsmith.io/'
  })
  .source(source + 'contents')
  .destination('./build')
  .clean(true)
  .use(collections({
    posts: source + 'contents/posts/*.md'
  }))
  .use(markdown())
  .use(permalinks({
    relative: false
  }))
  .use(layouts({
    engine: 'handlebars',
    directory: source + 'theme/layouts',
    default: 'layout.html'
  }))
  .build(function (err) {
    if (err) { throw err }
  })
