require('colors')
const jsdiff = require('diff')

module.exports.diff = function (first, second) {
  var diff = jsdiff.diffChars(first, second)
  diff.forEach(function (part) {
    var color = part.added ? 'green' :
      part.removed ? 'red' : 'grey';
    process.stderr.write(part.value[color])
  })
  console.log()
}
