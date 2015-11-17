var http = require('http'),
    colors = require('colors/safe'),
    stc = require('node-static');

exports.start = function(path, url) {

    var pattern = /(:[\d]{1,})/;
    var port = url.match(pattern)[0] || 7777;
    port = port.replace(':', '');
    console.log('Starting HTTP server: ' + colors.bgBlack(colors.yellow(' http://localhost:' + port + '/ ')));
    var fileServer = new stc.Server(path);
    http.createServer(function (request, response) {
        request.addListener('end', function () {
            fileServer.serve(request, response);
        }).resume();
    }).listen(port);
    console.log('Press ' + colors.bgBlack(colors.yellow(' CTRL+C ')) + ' to stop serving files');
};
