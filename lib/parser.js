var minify = require('html-minifier').minify,
    path = require('path'),
    beautify = require('js-beautify').html;

var beautifyOptions = {
    'indent_size': 4,
    'indent_char': ' ',
    'eol': '\n',
    'indent_level': 0,
    'indent_with_tabs': false,
    'preserve_newlines': false,
    'max_preserve_newlines': 0,
    'jslint_happy': false,
    'space_after_anon_function': false,
    'brace_style': 'collapse',
    'keep_array_indentation': false,
    'keep_function_indentation': false,
    'space_before_conditional': true,
    'break_chained_methods': false,
    'eval_code': false,
    'unescape_strings': false,
    'wrap_line_length': 0,
    'wrap_attributes': false,
    'wrap_attributes_indent_size': 4,
    'end_with_newline': false
};
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

var extractSlug = function(data) {
    return extract(/@slug[ ]*:[ ]*(.*)/g, data);
};

var extractName = function(data) {
    return extract(/@name[ ]*:[ ]*(.*)/g, data);
};

var extractCategory = function(data) {
    return extract(/@type[ ]*:[ ]*(.*)/g, data, 'Uncategorized');
};

var extractDescription = function(data) {
    return extract(/@text[ ]*:[ ]*([^(@|\*\/)]{1,})*/g, data).replace(/[ ]{2,}/g, ' ').replace(/\n/g, '\n').trim();
};

var extractHtml = function(data) {
    return minify(extract(/@html[ ]*:[ ]*([^(@|\*)]{1,})/g, data), minifyOptions).trim();
};

var beautyfyHtml = function(html) {
    return beautify(html, beautifyOptions);
};

var extractComments = function(file, filePath) {
    var data, comments, widgets, fileName;

    comments = file.match(/\/\*@pollo[\s\S]*?\*\//g);
    widgets = [];

    if (comments === null) {
        return [];
    }

    for (var i = 0; i < comments.length; i += 1) {
        data = comments[i];
        fileName = path.basename(filePath);
        widgets.push({
            slug : extractSlug(data),
            name : extractName(data),
            type : extractCategory(data),
            text : extractDescription(data),
            html : extractHtml(data),
            htmlBeauty : beautyfyHtml(extractHtml(data)),
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
