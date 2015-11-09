var yaml = require('js-yaml'),
    fs = require('fs');

exports.load = function() {
    return yaml.safeLoad(fs.readFileSync('./apollo.yml', 'utf-8'));
};
