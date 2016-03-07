var shell = require('shelljs'),
    path = require('./path'),
    json = require('jsonfile'),
    colors = require('colors'),
    fs = require('fs');

var packageJSON = json.readFileSync(path.fromModule('package.json'));

var hexoRequiredModule = function(name, rootPath) {
    var moduleFrom, moduleTarget;
    moduleFrom = rootPath + name;
    moduleTarget = path.fromModule('/node_modules/' + name);
    if (!shell.test('-e', path.fromModule('/node_modules/' + name))) {
        shell.cp('-R', moduleFrom, moduleTarget);
    }
};

exports.check = function() {
    if (!shell.test('-e', path.fromModule('/hexo/node_modules'))) {
        console.log('Hexo: Preparing dependencies...'.grey);
        var binFrom, binTo, modules;
        modules = process.env.PWD + '/node_modules/';

        for (var currentModule in packageJSON.dependencies) {
            if (packageJSON.dependencies.hasOwnProperty(currentModule)) {
                hexoRequiredModule(currentModule, modules);
                if (currentModule === 'hexo') {
                    binFrom = path.fromModule('/node_modules/' + currentModule + '/bin/hexo');
                    binTo = path.fromModule('node_modules/.bin/hexo');

                    fs.symlinkSync(binFrom, binTo);
                }
            }
        }
        fs.symlinkSync(path.trimRight(modules), path.fromModule('hexo/node_modules'));
        console.log('Hexo: Done with dependencies'.grey);
    }
};
