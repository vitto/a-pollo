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

var extractAuthors = function(data) {
    return extract(/@auth[ ]*:[ ]*(.*)/g, data);
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
    var data, comments, widgets;

    comments = file.match(/\/\*@pollo[\s\S]*?\*\//g);
    widgets = [];

    if (comments === null) {
        return [];
    }

    for (var i = 0; i < comments.length; i += 1) {
        data = comments[i];
        widgets.push({
            slug : extractSlug(data),
            name : extractName(data),
            type : extractCategory(data),
            text : extractDescription(data),
            html : extractHtml(data),
            auth : extractAuthors(data),
            file : path
        });
    }
    return widgets;
};

exports.format = function(file, path) {
    return extractComments(file, path);
};
