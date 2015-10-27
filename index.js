var reader = require('./lib/reader'),
    formatter = require('./lib/formatter'),
    widget = require('./lib/widget'),
    shell = require('shelljs'),
    yaml = require('js-yaml'),
    Hexo = require('hexo'),
    fs = require('fs');

var config = yaml.safeLoad(fs.readFileSync('./apollo.yml', 'utf-8'));

var runBuild = function() {
    var hexo, widgetFiles;

    widgetFiles = reader.load(config.sassFolder);

    hexo = new Hexo(process.cwd(), {
        debug: true,
        config: './hexo/_config.yml'
    });

    shell.rm('-rf', 'public');
    shell.rm('-rf', 'hexo/public');
    shell.rm('-rf', 'hexo/source');

    hexo.init().then(function(){

        var postData, postContent;

        for (var i = 0; i < widgetFiles.length; i += 1) {
            postData = formatter.toHexo(widgetFiles[i]);
            postData.content = widget.toMarkdown(widgetFiles[i], config);
        }

        hexo.post.create(postData, true);

        shell.mv('source', 'hexo/source');
        shell.rm('-rf', 'source');
        setTimeout(function(){
            shell.exec('cd ./hexo && hexo generate && rm -rf source');
            shell.mv('hexo/public', 'public');
        }, 100);

    });
};

exports.build = function() {
    runBuild();
};

runBuild();
