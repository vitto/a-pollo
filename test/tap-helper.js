require('colors')
const fs = require('fs')
const jsdiff = require('diff')
const path = require('path')

module.exports.diff = function (first, second) {
  var diff = jsdiff.diffChars(first, second)
  diff.forEach(function (part) {
    var color = part.added ? 'green' : part.removed ? 'red' : 'grey'
    process.stderr.write(part.value[color])
  })
  console.log()
}

module.exports.fixtures = function (file) {
  return JSON.parse(fs.readFileSync(path.resolve(__dirname, `tap/data/${file}.json`), 'utf8'))
}
