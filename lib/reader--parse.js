var minify = require('html-minifier').minify;

var minifyOptions = {
    collapseWhitespace : true,
    preserveLineBreaks : false
};

var extract = function(re, data) {
    var results = data.match(re);
    if (results === null) {
        return '';
    } else {
        return data.match(re)[0].replace(re, '$1').trim();
    }
};

var extractSlug = function(data) {
    return extract(/@slug[ ]*:[ ]*(.*)/g, data);
};

var extractName = function(data) {
    return extract(/@name[ ]*:[ ]*(.*)/g, data);
};

var extractCategory = function(data) {
    return extract(/@type[ ]*:[ ]*(.*)/g, data);
};

var extractDescription = function(data) {
    return extract(/@text[ ]*:[ ]*([^(@|\*\/)]{1,})*/g, data).replace(/[ ]{2,}/g, ' ').replace(/\n/g, '\n').trim();
};

var extractHtml = function(data) {
    return minify(extract(/@html[ ]*:[ ]*([^(@|\*)]{1,})/g, data), minifyOptions).trim();
};

var extractComments = function(file, path) {
    var data, comments;
    comments = file.match(/\/\*@pollo[\s\S]*?\*\//g);

    if (comments === null) {
        return [];
    }

    for (var i = 0; i < comments.length; i =+ 1) {
        data = comments[i];
        comments[i] = {
            slug : extractSlug(data),
            name : extractName(data),
            type : extractCategory(data),
            text : extractDescription(data),
            html : extractHtml(data),
            file : path
        };
    }
    return comments;
};

exports.format = function(file, path) {
    return extractComments(file, path);
};
