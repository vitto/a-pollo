const async = require('async')
const fs = require('fs')
const fse = require('fs-extra')
const path = require('path')
const slugify = require('slugify')
const stripIndent = require('strip-indent')
const YAML = require('yamljs')

function save (config, docs, cb) {
  async.eachLimit(docs, 10,
    function (doc, done) {
      const fileName = slugify(doc.name.toLowerCase()) + '.md'
      const categorySlug = slugify(doc.category || '').toLowerCase()
      const filePath = path.resolve(path.resolve(config.temp, categorySlug), fileName)
      const filePathParsed = path.parse(filePath, 0, 2)
      const ymlText = YAML.stringify(doc)
      const frontMatter = stripIndent(`---\n${ymlText}\n`)

      fse.mkdirs(filePathParsed.dir, function (err) {
        if (err) { throw err }
        fs.writeFile(filePath, frontMatter, function (err) {
          if (err) { throw err }
          done()
        })
      })
    },
    function (err) {
      if (err) { cb(err) }
      cb(null, config, docs)
    }
  )
}

module.exports = save
