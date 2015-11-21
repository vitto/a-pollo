var reader = require('./lib/reader'),
    formatter = require('./lib/formatter'),
    absorb = require('absorb'),
    widget = require('./lib/widget'),
    server = require('./lib/http-server'),
    colors = require('colors/safe'),
    shell = require('shelljs'),
    path = require('./lib/path'),
    yaml = require('js-yaml'),
    Hexo = require('hexo'),
    glob = require('glob'),
    json = require('jsonfile'),
    fs = require('fs');

var fromModule = function(targetPath) {
    return __dirname + '/' + path.trimLeft(targetPath);
};

var fromProcess = function(targetPath) {
    return process.cwd() + '/' + path.trimRight(path.trimLeft(targetPath));
};

var conf = yaml.safeLoad(fs.readFileSync('./a-pollo.yml', 'utf-8'));
var packageJSON = json.readFileSync(fromModule('package.json'));
var hexoConfig, mergedConfig;

var checkPath = function(path) {
    if (shell.test('-e', path)) {
        return true;
    } else {
        console.error(colors.bgBlack(colors.red(' ERROR: ' + path + ' ')) + ' in your ' + colors.bgBlack(colors.yellow(' a-pollo.yml ')) + ' config not found.');
        return false;
    }
};

var copyHexoModule = function(moduleName) {
    shell.cp('-R', fromModule('/node_modules/' + moduleName), fromModule('/hexo/node_modules'));
};

var hexoModule = function() {
    if (!shell.test('-e', fromModule('/hexo/node_modules'))) {
        console.log('Preparing node modules');
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

    mergedConfig = absorb(hexoConfig, conf);

    fs.writeFileSync(fromModule('/hexo/_config.yml'), yaml.safeDump(mergedConfig));

    shell.mkdir('-p', fromModule('/hexo/source'));
    shell.mkdir('-p', fromModule('/hexo/source/_posts'));
    shell.mkdir('-p', fromModule('/source'));

    if (conf.pages !== undefined) {
        if (checkPath(fromProcess(conf.pages))) {
            shell.cp('-R', path.inside(fromProcess(conf.pages)), fromModule('/hexo/source'));
        }
    } else {
        shell.cp('-R', fromModule('/hexo/_default_source/*'), fromModule('/hexo/source'));
    }

    shell.mkdir('-p', fromModule('/hexo/source/css/theme'));
    shell.mkdir('-p', fromModule('/hexo/source/css/theme/img'));
    shell.mkdir('-p', fromModule('/hexo/source/css/theme/fonts'));

    console.log('Copying CSS theme images and fonts');

    if (checkPath(fromProcess(conf.style.images))) {
        shell.cp('-R', path.inside(fromProcess(conf.style.images)), fromModule('/hexo/source/css/theme/assets'));
    }
    if (checkPath(fromProcess(conf.style.fonts))) {
        shell.cp('-R', path.inside(fromProcess(conf.style.fonts)), fromModule('/hexo/source/css/theme/assets'));
    }
};

var checkTheme = function() {
    if (!shell.test('-e', fromModule('/hexo/themes/' + conf.theme))) {
        console.log('Theme ' + colors.bgBlack(colors.yellow(' ' + conf.theme + ' ')) + ' not installed, searching on project folder');
        if (!shell.test('-e', fromProcess(conf.theme))) {
            console.log('Theme ' + colors.bgBlack(colors.yellow(' ' + conf.theme + ' ')) + ' not found, will be used ' + colors.bgBlack(colors.yellow(' apollo ')) + ' as default theme');
            conf.theme = 'apollo';
        } else {
            console.log('Installing found theme ' + colors.bgBlack(colors.yellow(' ' + conf.theme + ' ')));
            shell.cp('-R', path.inside(fromProcess(conf.theme)), fromModule('/hexo/themes/' + conf.theme));
        }
    } else {
        console.log('Using selected theme ' + colors.bgBlack(colors.yellow(' ' + conf.theme + ' ')));
    }
};

var generateDocs = function () {
    shell.mv('-f', fromProcess('/source/_posts'), fromModule('/hexo/source'));
    shell.exec('cd ' + fromModule('/hexo') + ' && ../node_modules/.bin/hexo generate');
    shell.mv('-f', fromModule('/hexo/' + path.trimLeft(conf.public_dir)), fromProcess(conf.public_dir));
};

var removeFiles = function() {
    if (shell.test('-e', fromModule('/hexo/source'))) { shell.rm('-Rf', fromModule('/hexo/source')); }
    if (shell.test('-e', fromModule('/hexo/node_modules'))) { shell.rm('-Rf', fromModule('/hexo/node_modules')); }
    if (shell.test('-e', fromModule('/source'))) { shell.rm('-Rf', fromModule('/source')); }
    if (shell.test('-e', fromModule('/hexo/_config.yml'))) { shell.rm('-f', fromModule('/hexo/_config.yml')); }
};

var prepareHTTP = function() {
    setTimeout(function(){
        removeFiles();
    }, 500);
    if (conf.http_server !== undefined || conf.http_server) {
        server.start(conf.public_dir, conf.url);
    }
};

var postCreated = function(widgetFilesLength) {
    var posts = glob.sync(fromProcess('/source/_posts/**/*.md'));
    if (posts.length === widgetFilesLength) {
        generateDocs();
        setTimeout(function(){
            prepareHTTP();
        }, 1000);
    } else {
        setTimeout(function(){
            postCreated(widgetFilesLength);
        }, 500);
    }
};

var copyThemeAssets = function() {
    var cssFileData;
    if (checkPath(fromProcess(conf.style.css))) {
        console.log('Copying CSS theme');
        cssFileData = fs.readFileSync(fromProcess(conf.style.css), 'utf8');
        cssFileData = cssFileData.replace(/url\(('|"){1,}(.*\/)(.*)('|"){1,}\)/g, 'url($1/css/theme/assets/$3$4)');
        fs.writeFileSync(fromModule('/hexo/source/css/theme/theme.css'), cssFileData);
    } else {
        return false;
    }
};

var runBuild = function() {
    var hexo, widgetFiles;

    console.log('Starting ' + colors.bgBlack(colors.yellow(' Apollo ')) + ' ' + packageJSON.version);

    removeFiles();
    checkTheme();
    hexoModule();
    prepareFiles();

    console.log('Loading data from ' + colors.bgBlack(colors.yellow(' ' + conf.style.docs + ' ')) + ' folder');
    widgetFiles = reader.load(fromProcess(conf.style.docs));

    copyThemeAssets();

    console.log('Initializing ' + colors.bgBlack(colors.blue(' Hexo ')));

    if (checkPath(fromModule('/hexo/_config.yml'))) {
        console.log('Loading ' + colors.bgBlack(colors.blue(' Hexo ')) + ' configuration');
    }

    hexo = new Hexo(process.cwd(), {
        debug: false,
        config: fromModule('/hexo/_config.yml')
    });

    hexo.init().then(function(){
        var postData;
        console.log('Crunching ' + colors.bgBlack(colors.yellow(' Apollo ')) + ' annotations to ' + colors.bgBlack(colors.blue(' Hexo ')) + ' posts...');
        for (var i = 0; i < widgetFiles.length; i += 1) {
            console.log('Creating post for ' + colors.bgBlack(colors.yellow(' ' + widgetFiles[i][0].file + ' ')));
            postData = formatter.toHexo(widgetFiles[i]);
            postData.content = widget.toMarkdown(widgetFiles[i], conf);
            // console.log(postData.docs[0].htmlSnippet)
            hexo.post.create(postData, true);
        }
        console.log('Waiting for ' + colors.bgBlack(colors.blue(' Hexo ')) + ' to finish posts creation...');
        postCreated(widgetFiles.length);
    });
};

runBuild();
