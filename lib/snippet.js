var markdown = require('./markdown');


exports.toMarkdown = function(snippets, config) {
    var page, isNew, snippet;

    isNew = true;

    for (var j = 0; j < snippets.length; j += 1) {
        snippet = snippets[j];
        if (isNew) {
            isNew = false;
            page = markdown.header(snippet, config);
            page += markdown.example(snippet, j, false);
        } else {
            page += markdown.example(snippet, j, true);
        }
    }
    page += markdown.footer(snippets.length);
    return page;
};

exports.toYaml = function(snippet) {
    return snippet;
};
