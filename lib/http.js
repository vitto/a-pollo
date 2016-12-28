'use strict'

const http = require('http')
const logger = require('./logger')
const stc = require('node-static')
const url = require('url')

function getServerPort (serverUrl) {
  var defaultPort = '7777'
  if (serverUrl !== undefined) {
    return url.parse(serverUrl).port || defaultPort
  } else {
    return defaultPort
  }
}

module.exports.port = function (serverUrl) {
  return getServerPort(serverUrl)
}

module.exports.start = function (path, serverUrl) {
  const port = getServerPort(serverUrl)
  const loggerOptions = { muted: false, verbosity: 3 }

  logger(loggerOptions).verbose('Starting HTTP server', `http://localhost:${port}`)

  var fileServer = new stc.Server(path)
  http.createServer(function (request, response) {
    request.addListener('end', function () {
      fileServer.serve(request, response)
      logger(loggerOptions).speak('Press CTRL+C to stop serving files')
    }).resume()
  }).listen(port)
}
