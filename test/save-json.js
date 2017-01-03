const fs = require('fs')

function saveJson (path, data, exit) {
  const exitWhenFinished = exit || true
  fs.writeFileSync(path, JSON.stringify(data), 'utf8')
  if (exitWhenFinished) {
    process.exit()
  }
}

module.exports = saveJson
