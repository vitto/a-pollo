var reader = require('./lib/reader'),
    formatter = require('./lib/formatter'),
    widget = require('./lib/widget'),
    shell = require('shelljs'),
    yaml = require('js-yaml'),
    Hexo = require('hexo'),
    fs = require('fs');

var conf = yaml.safeLoad(fs.readFileSync('./apollo.yml', 'utf-8'));

var runBuild = function() {
    var hexo, widgetFiles, cssFileData;

    widgetFiles = reader.load(conf.docs);

    hexo = new Hexo(process.cwd(), {
        config: './hexo/_config.yml'
    });

    shell.rm('-Rf', 'public');
    shell.mkdir('-p', 'hexo/source/_data');
    shell.cp('-f', './apollo.yml', 'hexo/source/_data/apollo.yml');
    shell.mkdir('-p', 'hexo/source/css/theme');
    //shell.cp('-f', conf.path.css, 'hexo/source/css/theme/theme.css');
    shell.mkdir('-p', 'hexo/source/css/theme/img');
    shell.cp('-R', conf.path.images, 'hexo/source/css/theme/img');
    shell.mkdir('-p', 'hexo/source/css/theme/fonts');
    shell.cp('-R', conf.path.fonts, 'hexo/source/css/theme/fonts');

    cssFileData = fs.readFileSync(conf.path.css, 'utf8');
    cssFileData = cssFileData.replace(/url\("(.*\/)(.*)"\)/g, 'url("/css/theme/img/$2")');
    fs.writeFileSync('hexo/source/css/theme/theme.css', cssFileData);

    hexo.init().then(function(){

        var postData;

        for (var i = 0; i < widgetFiles.length; i += 1) {
            postData = formatter.toHexo(widgetFiles[i]);
            postData.content = widget.toMarkdown(widgetFiles[i], conf.author);
            hexo.post.create(postData, true);
        }

        shell.mv('source/_posts', 'hexo/source/_posts');
        shell.exec('cd ./hexo && hexo generate');
        shell.mv('hexo/public', 'public');
        shell.rm('-Rf', 'hexo/source/_data');
        shell.rm('-Rf', 'hexo/source/_posts');
        shell.rm('-Rf', 'hexo/source/css');

    });
};

exports.build = function() {
    runBuild();
};

runBuild();
