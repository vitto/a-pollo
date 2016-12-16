'use strict'

const http = require('http')
const logger = require('./logger')
const stc = require('node-static')
const url = require('url')

module.exports.muteLogger = logger.mute

module.exports.start = function (path, serverUrl) {
  const pattern = /(:[\d]{1,})/
  var port = 7777

  if (serverUrl !== undefined) {
    const parsedUrl = url.parse(serverUrl)
    console.log(parsedUrl)
    port = (serverUrl.match(pattern)[0] || 7777).toString().replace(':', '')
  }

  logger.verbose('Starting HTTP server', 'http://localhost:' + port)

  var fileServer = new stc.Server(path)
  http.createServer(function (request, response) {
    request.addListener('end', function () {
      fileServer.serve(request, response)
      logger.speak('Press CTRL+C to stop serving files')
    }).resume()
  }).listen(port)
}
