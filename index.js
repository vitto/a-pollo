var reader = require('./lib/reader'),
    yaml = require('js-yaml'),
    Hexo = require('hexo'),
    fs = require('fs');

var config = yaml.safeLoad(fs.readFileSync('./apollo.yml', 'utf-8'));

var runBuild = function() {
    var hexo, widgetFiles;

    widgetFiles = reader.load(config.sassFolder);

    widgetFiles[0][0].layout = 'post';
    widgetFiles[0][0].slug = 'widget-' + widgetFiles[0][0].slug;
    widgetFiles[0][0].engine = 'ejs';

    hexo = new Hexo(process.cwd(), {
        debug: true,
        config: '_config.yml'
    });

    hexo.init().then(function(){
        var widgetFile = widgetFiles[0][0];

        hexo.render.render({text: widgetFile.text}, widgetFile).then(function(result){
            console.log(result);
        });
    });

    // console.log(files[0][0]);

};

exports.build = function() {
    runBuild();
};

runBuild();
