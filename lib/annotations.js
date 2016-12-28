
const glob = require('glob')
const path = require('path')

function annotations (annotationsDir) {
  const annotationsPath = path.resolve(process.cwd(), annotationsDir)
  const searchPattern = '/**/*.{css,less,scss}'
  const searchPath = path.join(annotationsPath, searchPattern)

  return {
    list: list
  }

  function list (cb) {
    glob(searchPath, null, function (err, matches) {
      if (err) {
        cb(err)
      } else {
        cb(null, matches)
      }
    })
  }
}

module.exports = annotations
