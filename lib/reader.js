var glob = require('glob'),
    fs = require('fs');

var parser = require('./parser');

var files = [];

var prepareData = function(filesFound) {
    var file, path, fileData;
    for (var i = 0; i < filesFound.length; i += 1) {
        path = filesFound[i];
        file = fs.readFileSync(path, 'utf8');
        fileData = parser.format(file, path);
        if (fileData.length > 0) {
            files.push(fileData);
        }
    }
    return files;
};

exports.load = function(path) {
    var filesFound;
    filesFound = glob.sync(path + '/**/*.{css,less,scss}');
    return prepareData(filesFound);
};
