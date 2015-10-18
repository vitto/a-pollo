var reader = require('./lib/reader'),
    Hexo = require('hexo');

var runBuild = function() {
    var hexo, files;

    files = reader.load('test');
    console.log(files[0][0]);

    files[0][0].layout = 'widget';
    files[0][0].slug = 'pipiloca';

    hexo = new Hexo(process.cwd(), {
        debug: true,
        config: '_config.yml'
    });
    hexo.init().then(function(){
        hexo.post.publish(files[0][0], false);
    });

    // console.log(files[0][0]);

};

exports.build = function() {
    runBuild();
};

runBuild();
