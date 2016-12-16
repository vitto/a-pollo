var shell = require('shelljs'),
    path = require('./path'),
    json = require('jsonfile'),
    colors = require('colors'),
    fs = require('fs');


var hexoRequiredModule = function(name, rootPath) {
    var moduleFrom, moduleTarget;
    moduleFrom = rootPath + name;
    moduleTarget = path.fromModule('/node_modules/' + name);
    if (!shell.test('-e', path.fromModule('/node_modules/' + name))) {
        shell.cp('-R', moduleFrom, moduleTarget);
    }
};

exports.check = function() {
    var packageJSON = json.readFileSync(path.fromModule('package.json'));
    if (!shell.test('-e', path.fromModule('/hexo/node_modules'))) {
        var modules = process.env.PWD + '/node_modules/';
        fs.symlinkSync(path.trimRight(modules), path.fromModule('hexo/node_modules'));
        console.log('Hexo: Done with linking dependencies'.grey);
    }
};
