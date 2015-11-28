var colors = require('colors/safe'),
    prompt = require('prompt'),
    moment = require('moment'),
    shell = require('shelljs'),
    yaml = require('js-yaml'),
    fs = require('fs');

var toTitleCase = function(str) {
    return str.replace(/\w\S*/g, function(text){
        return text.charAt(0).toUpperCase() + text.substr(1).toLowerCase();
    });
};

var saveConfig = function(result) {
    var config = {
        title: result.title,
        date: result.date,
        author: toTitleCase(result.author),
        public_dir: result.public_dir,
        url: result.url,
        pages: result.pages,
        http_server: result.http_server,
        use_markdown: true,
        theme: result.theme,
        style: {
            docs: result['style.docs'],
            css: result['style.css'],
            images: result['style.images'],
            fonts: result['style.fonts']
        }
    };
    var configFile = process.cwd() + '/a-pollo.yml';
    fs.writeFileSync(process.cwd() + '/a-pollo.yml', yaml.safeDump(config));
    console.log('Configuration successfully saved to ' + configFile.toString().yellow);
    console.log('If you\'d like to customize default theme header and footer please check out the config example here: ' + 'https://www.npmjs.com/package/a-pollo'.yellow);
    console.log('Now you can run a-pollo without '+ 'init'.yellow +' parameter');
};

var proceed = function () {
    prompt.start();
    prompt.message = '';
    prompt.delimiter = '';

    prompt.get([
        {
            name: 'title',
            description: 'title'.yellow,
            default: 'Untitled client project',
            type: 'string'
        },{
            name: 'date',
            description: 'date'.yellow,
            default: moment().format('YYYY-MM-DD'),
            type: 'string'
        },{
            name: 'author',
            description: 'author'.yellow + ' (Your Name)'.red,
            required: true,
            message: 'Please, insert your name',
            type: 'string'
        },{
            name: 'public_dir',
            description: 'public_dir'.yellow,
            default: 'public',
            type: 'string'
        },{
            name: 'url',
            description: 'url'.yellow,
            default: 'http://localhost:7777',
            type: 'string'
        },{
            name: 'pages',
            description: 'pages'.yellow + ' (Path to markdown or HTML static pages, you can leave it empty)'.white,
            type: 'string'
        },{
            name: 'http_server',
            description: 'http_server'.yellow,
            default: true,
            type: 'string'
        },{
            name: 'theme',
            description: 'theme'.yellow,
            default: 'a-pollo',
            type: 'string'
        },{
            name: 'style.docs',
            description: 'style.docs'.yellow + ' (Path to documented files, SASS, LESS or CSS supported)'.red,
            required: true,
            message: 'Insert something like: ' + 'path/to/widgets/'.yellow,
            type: 'string'
        },{
            name: 'style.css',
            description: 'style.css'.yellow + ' (Path to generated CSS)'.red,
            required: true,
            message: 'A-pollo will copy CSS inside the generated style guide, something like: ' + 'path/to/css/'.yellow,
            type: 'string'
        },{
            name: 'style.images',
            description: 'style.images'.yellow + ' (Path to images loaded by your CSS)'.red,
            type: 'string'
        },{
            name: 'style.fonts',
            description: 'style.fonts'.yellow + ' (Path to fonts loaded by your CSS)'.red,
            type: 'string'
        }
    ], function (err, result) {
        saveConfig(result);
    });
};

exports.start = function () {

    var filename = process.cwd() + 'a-pollo.yml';
    if (shell.test('-e', filename)) {
        console.log('Config file ' + colors.bgBlack(colors.green(' a-pollo.yml ')) + ' found.');
        console.log('If you want to create it again, please delete it first, or run a-pollo without ' + 'init'.yellow + ' param.');
    } else {
        console.log('This procell will help you to generate the config ' + colors.bgBlack(colors.green(' a-pollo.yml ')) + ' file into your project.');
        proceed();
    }
};
