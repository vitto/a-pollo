var http = require('http'),
    colors = require('colors'),
    stc = require('node-static');

exports.start = function(path, url) {

    var pattern = /(:[\d]{1,})/;
    var port = url.match(pattern)[0] || 7777;
    port = port.replace(':', '');
    console.log('Starting HTTP server: ' + ('http://localhost:' + port).yellow);
    var fileServer = new stc.Server(path);
    http.createServer(function (request, response) {
        request.addListener('end', function () {
            fileServer.serve(request, response);
        }).resume();
    }).listen(port);
    console.log('Press ' + (' CTRL+C ').yellow.bgBlack + ' to stop serving files');
};
