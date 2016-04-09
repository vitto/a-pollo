var minify = require('html-minifier').minify,
    path = require('path'),
    beautify = require('./beautify');

var minifyOptions = {
    collapseWhitespace : true,
    preserveLineBreaks : false
};

var extract = function(re, data, defaultValue, key) {
    var results = data.match(re);
    if (results === null) {
        return defaultValue || '';
    } else {
        return data.match(re)[0].replace(re, (key||'$1')).trim();
    }
};

var extractAuthors = function(data) {
    return extract(/@auth[ ]*:[ ]*(.*)/g, data);
};

var extractDate = function(data) {
    var re, results, dates, i;

    re = /@date[ ]*:[ ]*(\n *- *(\d{4}-\d{2}-\d{2}) [^(@|\*)]{1,})|(\d{4}-\d{2}-\d{2})/g;
    results = data.match(re);
    dates = [];

    if (results === null) {
        return '';
    } else if (results.length === 1) {
        return data.match(re)[0].replace(re, '$3').trim();
    } else if (results.length > 1) {
        for (i = 0; i < results.length; i += 1) {
            dates.push(results[i].replace(re, '$3').trim());
        }
        return dates;
    }
};

var extractName = function(data) {
    return extract(/@name[ ]*:[ ]*(.*)/g, data);
};

var extractCategory = function(data) {
    return extract(/@category[ ]*:[ ]*(.*)/g, data, 'Uncategorized');
};

var extractDescription = function(data) {
    return extract(/@text[ ]*:[ ]*([^(@|\*)]{1,})*/g, data).replace(/[ ]{2,}/g, ' ').replace(/\n/g, '\n').trim();
};

var extractHtml = function(data) {
    return minify(extract(/@html[ ]*:[ ]*([^@|\*]{1,})/g, data), minifyOptions).trim();
};

var extractComments = function(file, filePath) {
    var data, comments, widgets, fileName, html, htmlSnippet;

    comments = file.match(/\/\*@pollo[\s\S]*?\*\//g);
    widgets = [];

    if (comments === null) {
        return [];
    }

    for (var i = 0; i < comments.length; i += 1) {
        data = comments[i];
        fileName = path.basename(filePath);
        html = extractHtml(data);
        htmlSnippet = beautify.html(html);
        widgets.push({
            date : extractDate(data),
            name : extractName(data),
            category : extractCategory(data),
            text : extractDescription(data),
            html : html,
            htmlSnippet : htmlSnippet,
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
