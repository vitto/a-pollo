var beautify = require('./beautify'),
    path = require('./path');

exports.header = function (snippet, config) {
    var markdown;
    markdown  = '<h1 class="apollo-widget__title">' + snippet.name + '</h1>';
    markdown += '**Category** <span>' + snippet.category + '</span>\n';
    markdown += '<span class="apollo-widget__filename" title="' + path.trimRight(path.trimLeft(config.style.docs)) + '/' + snippet.file + '"><strong>File</strong> `' + snippet.file.replace('./', '') + '`</span>' + '\n';
    markdown += '**Author/s** ' + (snippet.auth || config.author || 'Not specified' ) + '\n\n';
    if (snippet.text) {
        markdown += '<p>' + snippet.text + '</p>\n';
    }
    return markdown;
};

exports.example = function (snippet, index, skipInitialBlock) {
    var example;
    example = '';
    if (skipInitialBlock || false) {
        example += '<hr class="apollo-widget__hr">\n';
        example += '### ' + snippet.name + '\n\n';
        if (snippet.auth) {
            example += '**Author/s** ' + snippet.auth + '\n\n';
        }
        if (snippet.text) {
            example += '\n\n' + snippet.text + '\n\n';
        }
        if (snippet.slug) {
            example += '**Selector** `' + snippet.slug.replace(/^([^.]{1,})/, '.$1') + '`' + '\n\n';
        }
    }

    example += '<div class="apollo-title-spacer">';
    example += '**HTML example**';
    example += '</div>';
    example += '<div class="apollo-html-example">';
    example += '<div class="apollo-html-example__inner">';
    example += '<div class="apollo-html-example__bg"></div>';
    example += '<div class="apollo-html-example__container">';
    example += snippet.html;
    example += '</div>';
    example += '</div>';
    example += '</div>';
    example += '<div class="apollo-title-spacer">';
    example += '**HTML code**';
    example += '</div>';
    example += '<div id="html-example-' + index + '" class="apollo-code-example" data-clipboard-target="#html-example-' + index + ' .highlight .code">\n';
    example += '<div class="apollo-code-example__message" data-text="Click to copy">Click to copy</div>\n';
    example += '```html \n' + beautify.html(snippet.html) + '\n```\n';
    example += '</div>';
    return example;
};

exports.footer = function(totalSnippets) {
    var footer = '<hr class="apollo-widget__hr">\n';
    footer += '**Total examples** <span>' + totalSnippets + '</span>';
    return footer;
};
