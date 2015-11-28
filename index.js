var reader = require('./lib/reader'),
    initializer = require('./lib/initializer'),
    formatter = require('./lib/formatter'),
    absorb = require('absorb'),
    widget = require('./lib/widget'),
    server = require('./lib/http-server'),
    colors = require('colors'),
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

var conf;
var packageJSON = json.readFileSync(fromModule('package.json'));
var hexoConfig, mergedConfig;

var checkPath = function(path) {
    if (shell.test('-e', path)) {
        return true;
    } else {
        console.error(' ERROR: ' + path + ' '.red.bgBlack + ' in your ' + 'a-pollo.yml'.yellow + ' config not found.');
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
        copyHexoModule('hexo-renderer-ejs');
        copyHexoModule('hexo-renderer-marked');
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
    var defaultTheme = 'a-pollo';
    if (conf.theme !== undefined) {
        if (!shell.test('-e', fromModule('/hexo/themes/' + conf.theme))) {
            console.log('Theme ' + (' ' + conf.theme + ' ').yellow.bgBlack + ' not installed, searching on project folder');
            if (!shell.test('-e', fromProcess(conf.theme))) {
                console.log('Theme ' + (' ' + conf.theme + ' ').yellow.bgBlack + ' not found, it will be used ' + (' ' + defaultTheme + ' ').yellow.bgBlack + ' as default theme');
                conf.theme = defaultTheme;
            } else {
                console.log('Installing found theme ' + (' ' + conf.theme + ' ').yellow.bgBlack);
                shell.cp('-R', path.inside(fromProcess(conf.theme)), fromModule('/hexo/themes/' + conf.theme));
            }
        } else {
            console.log('Using selected theme ' + (' ' + conf.theme + ' ').yellow.bgBlack);
        }
    } else {
        console.log('Theme not set, it will be used ' + (' ' + defaultTheme + ' ').yellow.bgBlack + ' as default theme');
        conf.theme = defaultTheme;
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

    console.log('Build finished successfully.'.green);

    if (conf.http_server !== undefined && conf.http_server !== false) {
        server.start(conf.public_dir, conf.url);
    } else {
        console.log('The style guide was generated here: ' + conf.public_dir.toString().yellow);
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

    removeFiles();
    checkTheme();
    hexoModule();
    prepareFiles();

    console.log('Loading doc annotations data from ' + (' ' + conf.style.docs + ' ').yellow.bgBlack + ' folder');
    widgetFiles = reader.load(fromProcess(conf.style.docs));

    copyThemeAssets();

    console.log('Initializing ' + 'Hexo'.blue);

    if (checkPath(fromModule('/hexo/_config.yml'))) {
        console.log('Loading ' + 'Hexo'.blue + ' configuration');
    }

    hexo = new Hexo(process.cwd(), {
        debug: false,
        config: fromModule('/hexo/_config.yml')
    });

    hexo.init().then(function(){
        var postData;
        console.log('Crunching ' + 'a-pollo'.rainbow + ' doc annotations to ' + 'Hexo'.blue + ' posts...');
        for (var i = 0; i < widgetFiles.length; i += 1) {
            console.log('Creating post for ' + (' ' + widgetFiles[i][0].file + ' ').yellow.bgBlack);
            postData = formatter.toHexo(widgetFiles[i]);
            postData.content = widget.toMarkdown(widgetFiles[i], conf);
            // console.log(postData.docs[0].htmlSnippet)
            hexo.post.create(postData, true);
        }
        console.log('Waiting for ' + 'Hexo'.blue + ' to finish...');
        postCreated(widgetFiles.length);
    });
};

var runProcess = function() {

    console.log('Starting ' + 'a-pollo '.rainbow + packageJSON.version);

    var filename = process.cwd() + '/a-pollo.yml';

    if (process.argv.length === 2) {
        if (shell.test('-e', filename)) {
            conf = yaml.safeLoad(fs.readFileSync(filename, 'utf-8'));
            runBuild();
        } else {
            console.log('ERROR: '.red + 'file ' + filename.toString().red + ' not found, please run ' + 'a-pollo init'.yellow + ' to create one.');
        }
    } else {
        process.argv.forEach(function(val, index) {
            if (val === 'init') {
                initializer.start();
                return;
            }
        });
    }
};

runProcess();
