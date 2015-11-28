var minify = require('html-minifier').minify,
    path = require('path'),
    beautify = require('./beautify');

var minifyOptions = {
    collapseWhitespace : true,
    preserveLineBreaks : false
};

var extract = function(re, data, defaultValue) {
    var results = data.match(re);
    if (results === null) {
        return defaultValue || '';
    } else {
        return data.match(re)[0].replace(re, '$1').trim();
    }
};

var extractAuthors = function(data) {
    return extract(/@auth[ ]*:[ ]*(.*)/g, data);
};

var extractDate = function(data) {
    return extract(/@date[ ]*:[ ]*(.*)/g, data);
};

var extractSlug = function(data) {
    return extract(/@slug[ ]*:[ ]*(.*)/g, data);
};

var extractName = function(data) {
    return extract(/@name[ ]*:[ ]*(.*)/g, data);
};

var extractCategory = function(data) {
    return extract(/@category[ ]*:[ ]*(.*)/g, data, 'Uncategorized');
};

var extractDescription = function(data) {
    return extract(/@text[ ]*:[ ]*([^(@|\*\/)]{1,})*/g, data).replace(/[ ]{2,}/g, ' ').replace(/\n/g, '\n').trim();
};

var extractHtml = function(data) {
    return minify(extract(/@html[ ]*:[ ]*([^(@|\*)]{1,})/g, data), minifyOptions).trim();
};

var extractComments = function(file, filePath) {
    var data, comments, widgets, fileName, html;

    comments = file.match(/\/\*@pollo[\s\S]*?\*\//g);
    widgets = [];

    if (comments === null) {
        return [];
    }

    for (var i = 0; i < comments.length; i += 1) {
        data = comments[i];
        fileName = path.basename(filePath);
        html = extractHtml(data);
        widgets.push({
            date : extractDate(data),
            slug : extractSlug(data),
            name : extractName(data),
            category : extractCategory(data),
            text : extractDescription(data),
            html : html,
            htmlSnippet : beautify.html(html),
            auth : extractAuthors(data),
            file : fileName,
            path : filePath
        });
    }
    return widgets;
};

exports.format = function(file, path) {
    return extractComments(file, path);
};
