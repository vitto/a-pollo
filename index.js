var reader = require('./lib/reader'),
    formatter = require('./lib/formatter'),
    absorb = require('absorb'),
    widget = require('./lib/widget'),
    shell = require('shelljs'),
    yaml = require('js-yaml'),
    Hexo = require('hexo'),
    fs = require('fs');

var conf = yaml.safeLoad(fs.readFileSync('./apollo.yml', 'utf-8'));
var hexoConfig, mergedConfig;

var fixPath = function(path) {
    return path.replace(/(\/\*?)$/, '/*');
};

var cleanPath = function(path) {
    return path.replace(/(\/\*?)$/, '');
};

var cleanStartPath = function(path) {
    if (/^([^.\/])/.test(path)) {
        return path.replace(/^([^.\/])/, '../$1');
    }
    if (/^(^.\/)/.test(path)) {
        return path.replace(/^(^.\/)/, '.$1');
    }
    return path;
};

var prepareFiles = function() {
    hexoConfig   = yaml.safeLoad(fs.readFileSync('hexo/_default_config.yml', 'utf-8'));

    if (shell.test('-e', conf.public_dir)) {
        shell.rm('-Rf', conf.public_dir);
    }

    conf.public_dir = cleanStartPath(conf.public_dir);
    mergedConfig = absorb(hexoConfig, conf);
    fs.writeFileSync('hexo/_config.yml', yaml.safeDump(mergedConfig));

    shell.mkdir('-p', 'hexo/source');

    if (conf.pages !== undefined) {
        if (shell.test('-e', cleanPath(conf.pages))) {
            shell.cp('-R', fixPath(conf.pages), 'hexo/source');
        } else {
            console.error('ERROR: ' + cleanPath(conf.pages) + ' in your apollo.yml config not found.');
        }
    } else {
        shell.cp('-R', 'hexo/_default_source/*', 'hexo/source');
    }

    shell.mkdir('-p', 'hexo/source/css/theme');
    shell.mkdir('-p', 'hexo/source/css/theme/img');
    shell.mkdir('-p', 'hexo/source/css/theme/fonts');
    shell.cp('-R', fixPath(conf.style.images), 'hexo/source/css/theme/img');
    shell.cp('-R', fixPath(conf.style.fonts), 'hexo/source/css/theme/fonts');
};

var generateDocs = function () {
    shell.exec('cd ./hexo && ../node_modules/.bin/hexo generate');
};

var cleanFiles = function() {
    setTimeout(function(){
        if (shell.test('-e', 'hexo/source')) { shell.rm('-Rf', 'hexo/source'); }
        if (shell.test('-e', 'source')) { shell.rm('-Rf', 'source'); }
        if (shell.test('-e', 'hexo/_config.yml')) { shell.rm('-f', 'hexo/_config.yml'); }
    }, 500);
};

var runBuild = function() {
    var hexo, widgetFiles, cssFileData;

    prepareFiles();

    widgetFiles = reader.load(conf.style.docs);

    hexo = new Hexo(process.cwd(), {
        config: './hexo/_config.yml'
    });

    cssFileData = fs.readFileSync(conf.style.css, 'utf8');
    cssFileData = cssFileData.replace(/url\("(.*\/)(.*)"\)/g, 'url("/css/theme/img/$2")');
    fs.writeFileSync('hexo/source/css/theme/theme.css', cssFileData);

    hexo.init().then(function(){
        var postData;

        for (var i = 0; i < widgetFiles.length; i += 1) {
            postData = formatter.toHexo(widgetFiles[i]);
            postData.content = widget.toMarkdown(widgetFiles[i], conf.author);
            hexo.post.create(postData, true);
        }
        generateDocs();
        cleanFiles();
    });
};

exports.build = function() {
    runBuild();
};

runBuild();
