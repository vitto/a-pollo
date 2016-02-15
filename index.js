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

var conf, defaultConf;
var packageJSON = json.readFileSync(fromModule('package.json'));
var hexoConfig, mergedConfig;
var widgetFiles;

var checkPath = function(path, configVarName, canSkip) {
    var skip = canSkip || false;
    if (shell.test('-e', path)) {
        return true;
    } else {
        if (skip) {
            return false;
        }
        var varName = configVarName || false;
        if (varName) {
            console.error(' ERROR: '.red + ' the file ' + (path).red + ' in ' + (varName).yellow + ' property from your ' + 'a-pollo.yml'.yellow + ' config not found.');
        } else {
            console.error(' ERROR: '.red + ' file ' + (path).red + ' in your ' + 'a-pollo.yml'.yellow + ' config not found.');
        }
        return false;
    }
};

var checkPageFile = function(filter, defaultFileName) {
    var filesToFind, filesFound, defaultFile, pages, destinationFile;

    pages = path.trimRight(process.cwd() + '/' + path.trimLeft(conf.pages));
    filesToFind = pages + filter;
    filesFound = glob.sync(filesToFind);
    defaultFile = fromModule('/hexo/_default_source/' + defaultFileName);
    destinationFile = pages + '/' + defaultFileName;

    if (filesFound.length === 0) {
        if (!shell.test('-e', destinationFile)) {
            console.log('Default index file not found, ' + 'a-pollo'.yellow + ' will create it for you');
            shell.cp('-f', defaultFile, destinationFile);
        }
    }
};

var hexoModule = function() {
    if (!shell.test('-e', fromModule('/hexo/node_modules'))) {
        console.log('Preparing modules...');
        fs.symlinkSync(fromModule('node_modules'), fromModule('/hexo/node_modules'));
        console.log('Done.');
    }
};

var addThemeImage = function(imageName) {
    var defaultLogoSource, defaultLogoTarget, defaultLogoTargetPath;
    defaultLogoTarget = fromModule('/hexo/source/css/theme/assets/' + imageName);
    defaultLogoTargetPath = path.trimRight(fromModule('/hexo/source/css/theme/assets/'));
    if (!shell.test('-e', defaultLogoTarget)) {
        defaultLogoSource = fromModule('/frontsize/themes/a-pollo/img/' + imageName);
        shell.cp('-f', defaultLogoSource, defaultLogoTargetPath);
    }
};

var prepareFiles = function() {

    if (shell.test('-e', fromProcess(conf.public_dir))) {
        shell.rm('-Rf', fromProcess(conf.public_dir));
    }

    shell.mkdir('-p', fromModule('/hexo/source'));
    shell.mkdir('-p', fromModule('/hexo/source/_posts'));
    shell.mkdir('-p', fromModule('/source'));

    if (conf.pages !== undefined || conf.pages) {
        if (checkPath(fromProcess(conf.pages), 'pages')) {
            //checkPageFile('index.{md,html}', 'index.md');
            shell.cp('-R', path.inside(fromProcess(conf.pages)), fromModule('/hexo/source'));
        }
    } else {
        shell.cp('-R', fromModule('/hexo/_default_source/*'), fromModule('/hexo/source'));
    }

    shell.mkdir('-p', fromModule('/hexo/source/css/theme'));
    shell.mkdir('-p', fromModule('/hexo/source/css/theme/img'));
    shell.mkdir('-p', fromModule('/hexo/source/css/theme/fonts'));

    console.log('Copying CSS theme images and fonts');

    if (checkPath(fromProcess(conf.style.images), 'style.images')) {
        shell.cp('-R', path.inside(fromProcess(conf.style.images)), fromModule('/hexo/source/css/theme/assets'));
        addThemeImage('apollo-logo__icon.svg');
        addThemeImage('apollo-logo__icon-grey.svg');
        addThemeImage('apollo-logo__icon-black.svg');
    }
    if (checkPath(fromProcess(conf.style.fonts), 'style.fonts')) {
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
    var cssFileData, url;
    if (checkPath(fromProcess(conf.style.css), 'style.css')) {
        console.log('Copying style CSS to display');
        url = path.trimRight(conf.url);
        cssFileData = fs.readFileSync(fromProcess(conf.style.css), 'utf8');
        cssFileData = cssFileData.replace(/url\(('|"){1,}(.*\/)(.*)('|"){1,}\)/g, 'url($1' + url + '/css/theme/assets/$3$4)');
        fs.writeFileSync(fromModule('/hexo/source/css/theme/theme.css'), cssFileData);
    } else {
        return false;
    }
};

var runBuild = function() {
    var hexo;
    checkTheme();
    hexoModule();
    prepareFiles();

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
        console.log('Crunching ' + 'a-pollo'.yellow + ' doc annotations to ' + 'Hexo'.blue + ' posts...');
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

    removeFiles();

    var initializerStarted = false;

    process.argv.forEach(function(val) {
        if (val === 'init') {
            initializer.start();
            return;
        }
    });

    if (initializerStarted) {
        return;
    }

    var filename = process.cwd() + '/a-pollo.yml';
    process.argv.forEach(function(val) {
        if (val.indexOf('config=') === 0) {
            filename = process.cwd() + val.replace('config=', '/');
        }
    });

    if (shell.test('-e', filename)) {
        var confToMerge = yaml.safeLoad(fs.readFileSync(filename, 'utf-8'));
        confToMerge.apollo = {
            version: packageJSON.version,
            homepage: packageJSON.homepage
        };
        defaultConf = yaml.safeLoad(fs.readFileSync(fromModule('/a-pollo.yml'), 'utf-8'));

        delete defaultConf.pages;
        delete defaultConf.libs;

        conf = absorb(confToMerge, defaultConf, false, true);
        hexoConfig   = yaml.safeLoad(fs.readFileSync(fromModule('/hexo/_default_config.yml'), 'utf-8'));

        if (conf.libs !== undefined) {
            if (conf.libs.node !== undefined) {
                if (checkPath(fromProcess(conf.libs.node), 'libs.node')) {
                    conf.libs.nodeDependencies = yaml.safeLoad(fs.readFileSync(fromProcess(conf.libs.node))).dependencies;
                }
            }
            if (conf.libs.bower !== undefined) {
                if (checkPath(fromProcess(conf.libs.bower), 'libs.bower')) {
                    conf.libs.bowerDependencies = yaml.safeLoad(fs.readFileSync(fromProcess(conf.libs.bower))).dependencies;
                }
            }
        }

        console.log('Loading doc annotations data from ' + (' ' + conf.style.docs + ' ').yellow.bgBlack + ' folder');
        widgetFiles = reader.load(fromProcess(conf.style.docs));

        conf = formatter.setProjectStats(conf, widgetFiles);
        mergedConfig = absorb(conf, hexoConfig, false, true);

        fs.writeFileSync(fromModule('/hexo/_config.yml'), yaml.safeDump(mergedConfig));

        runBuild();
    } else {
        var isInitProcess = false;
        process.argv.forEach(function(val) {
            if (val.indexOf('init') === 0) {
                isInitProcess = true;
            }
        });
        if (!isInitProcess) {
            console.log('ERROR: '.red + 'file ' + filename.toString().red + ' not found, please run ' + 'a-pollo init'.yellow + ' or ' + './node_modules/.bin/a-pollo init'.yellow + ' to create one.');
        }
    }
};

runProcess();
