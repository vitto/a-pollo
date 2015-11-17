var reader = require('./lib/reader'),
    formatter = require('./lib/formatter'),
    absorb = require('absorb'),
    widget = require('./lib/widget'),
    shell = require('shelljs'),
    path = require('./lib/path'),
    yaml = require('js-yaml'),
    Hexo = require('hexo'),
    glob = require('glob'),
    fs = require('fs');

var conf = yaml.safeLoad(fs.readFileSync('./apollo.yml', 'utf-8'));
var hexoConfig, mergedConfig;

var fromModule = function(targetPath) {
    return __dirname + '/' + path.trimLeft(targetPath);
};

var fromProcess = function(targetPath) {
    return process.cwd() + '/' + path.trimRight(path.trimLeft(targetPath));
};

var checkPath = function(path) {
    if (shell.test('-e', fromProcess(path))) {
        return true;
    } else {
        console.error('ERROR:\n ' + fromProcess(path) + '\n in your apollo.yml config not found.');
        return false;
    }
};

var copyHexoModule = function(moduleName) {
    shell.cp('-R', fromModule('/node_modules/' + moduleName), fromModule('/hexo/node_modules'));
};

var hexoModule = function() {
    if (!shell.test('-e', fromModule('/hexo/node_modules'))) {
        console.log('Preparing node modules...');
        shell.mkdir('-p', fromModule('/hexo/node_modules'));
        copyHexoModule('hexo');
        copyHexoModule('hexo-deployer-rsync');
        copyHexoModule('hexo-generator-archive');
        copyHexoModule('hexo-generator-category');
        copyHexoModule('hexo-generator-index');
        copyHexoModule('hexo-generator-tag');
        copyHexoModule('hexo-renderer-ejs');
        copyHexoModule('hexo-renderer-marked');
        copyHexoModule('hexo-renderer-stylus');
        copyHexoModule('hexo-server');
        console.log('Done.');
    } else {
        shell.rm('-Rf', fromModule('/hexo/node_modules'));
    }
};

var prepareFiles = function() {

    hexoConfig   = yaml.safeLoad(fs.readFileSync(fromModule('/hexo/_default_config.yml'), 'utf-8'));

    if (shell.test('-e', fromProcess(conf.public_dir))) {
        shell.rm('-Rf', fromProcess(conf.public_dir));
    }

    //conf.public_dir = path.toParent(conf.public_dir);
    mergedConfig = absorb(hexoConfig, conf);

    fs.writeFileSync(fromModule('/hexo/_config.yml'), yaml.safeDump(mergedConfig));

    shell.mkdir('-p', fromModule('/hexo/source'));
    shell.mkdir('-p', fromModule('/hexo/source/_posts'));
    shell.mkdir('-p', fromModule('/source'));

    if (conf.pages !== undefined) {
        if (checkPath(conf.pages)) {
            shell.cp('-R', path.inside(fromProcess(conf.pages)), fromModule('/hexo/source'));
        }
    } else {
        shell.cp('-R', fromModule('/hexo/_default_source/*'), fromModule('/hexo/source'));
    }

    shell.mkdir('-p', fromModule('/hexo/source/css/theme'));
    shell.mkdir('-p', fromModule('/hexo/source/css/theme/img'));
    shell.mkdir('-p', fromModule('/hexo/source/css/theme/fonts'));
    if (checkPath(conf.style.images)) {
        shell.cp('-R', path.inside(fromProcess(conf.style.images)), fromModule('/hexo/source/css/theme/img'));
    }
    if (checkPath(conf.style.fonts)) {
        shell.cp('-R', path.inside(fromProcess(conf.style.fonts)), fromModule('/hexo/source/css/theme/fonts'));
    }
};

var generateDocs = function () {
    shell.mv('-f', fromProcess('/source/_posts'), fromModule('/hexo/source'));
    shell.exec('cd ' + fromModule('/hexo') + ' && ../node_modules/.bin/hexo generate');
    shell.mv('-f', fromModule('/hexo/' + path.trimLeft(conf.public_dir)), fromProcess(conf.public_dir));
};

var cleanFiles = function() {
    setTimeout(function(){
        if (shell.test('-e', fromModule('/hexo/source'))) { shell.rm('-Rf', fromModule('/hexo/source')); }
        if (shell.test('-e', fromModule('/hexo/node_modules'))) { shell.rm('-Rf', fromModule('/hexo/node_modules')); }
        if (shell.test('-e', fromModule('/source'))) { shell.rm('-Rf', fromModule('/source')); }
        if (shell.test('-e', fromModule('/hexo/_config.yml'))) { shell.rm('-f', fromModule('/hexo/_config.yml')); }
    }, 500);
};

var postCreated = function(widgetFilesLength) {
    var posts = glob.sync(fromProcess('/source/_posts/**/*.md'));
    if (posts.length === widgetFilesLength) {
        generateDocs();
        setTimeout(function(){
            cleanFiles();
        }, 1000);
    } else {
        setTimeout(function(){
            postCreated(widgetFilesLength);
        }, 500);
    }
};

var runBuild = function() {
    var hexo, widgetFiles, cssFileData;
    hexoModule();
    prepareFiles();
    widgetFiles = reader.load(fromProcess(conf.style.docs));

    console.log('Initializing hexo...');
    hexo = new Hexo(process.cwd(), {
        debug: true,
        config: fromModule('/hexo/_config.yml')
    });

    if (checkPath(conf.style.css)) {
        cssFileData = fs.readFileSync(fromProcess(conf.style.css), 'utf8');
        cssFileData = cssFileData.replace(/url\("(.*\/)(.*)"\)/g, 'url("/css/theme/img/$2")');
        fs.writeFileSync(fromModule('/hexo/source/css/theme/theme.css'), cssFileData);
    } else {
        return false;
    }

    hexo.init().then(function(){
        var postData;

        for (var i = 0; i < widgetFiles.length; i += 1) {
            postData = formatter.toHexo(widgetFiles[i]);
            postData.content = widget.toMarkdown(widgetFiles[i], conf.author);
            hexo.post.create(postData, true);
        }
        console.log('Waiting for hexo...');
        postCreated(widgetFiles.length);
    });
};

exports.build = function() {
    runBuild();
};

runBuild();
