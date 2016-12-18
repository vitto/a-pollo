
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

const between = require('./lib/between')
between()
process.exit()


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
  .source(`${source}contents`)
  .destination('./build')
  .clean(true)
  .use(collections({
    posts: `${source}contents/posts/*.md`,
    sortBy: 'date'
  }))
  .use(markdown())
  .use(permalinks({
    relative: false
  }))
  .use(layouts({
    default: 'layout.html',
    directory: `${source}theme/layouts`,
    engine: 'handlebars',
    partials: `${source}theme/partials`
  }))
  .build(function (err) {
    if (err) { throw err }
  })
