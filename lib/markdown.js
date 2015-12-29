var beautify = require('./beautify'),
    path = require('./path');

exports.header = function (widget, config) {
    var markdown;
    markdown  = '<h1 class="apollo-widget__title">' + widget.name + '</h1>';
    markdown += '**Category** <span>' + widget.category + '</span>\n';
    markdown += '<span class="apollo-widget__filename" title="' + path.trimRight(path.trimLeft(config.style.docs)) + '/' + widget.file + '"><strong>File</strong> `' + widget.file.replace('./', '') + '`</span>' + '\n';
    markdown += '**Author/s** ' + (widget.auth || config.author || 'Not specified' ) + '\n\n';
    if (widget.text) {
        markdown += '<p>' + widget.text + '</p>\n';
    }
    return markdown;
};

exports.example = function (widget, index, skipInitialBlock) {
    var example;
    example = '';
    if (skipInitialBlock || false) {
        example += '<hr class="apollo-widget__hr">\n';
        example += '### ' + widget.name + '\n\n';
        if (widget.auth) {
            example += '**Author/s** ' + widget.auth + '\n\n';
        }
        if (widget.text) {
            example += '\n\n' + widget.text + '\n\n';
        }
        if (widget.slug) {
            example += '**Selector** `' + widget.slug.replace(/^([^.]{1,})/, '.$1') + '`' + '\n\n';
        }
    }

    example += '<div class="apollo-title-spacer">';
    example += '**HTML example**';
    example += '</div>';
    example += '<div class="apollo-html-example">';
    example += '<div class="apollo-html-example__inner">';
    example += '<div class="apollo-html-example__bg"></div>';
    example += '<div class="apollo-html-example__container">';
    example += widget.html;
    example += '</div>';
    example += '</div>';
    example += '</div>';
    example += '<div class="apollo-title-spacer">';
    example += '**HTML code**';
    example += '</div>';
    example += '<div id="html-example-' + index + '" class="apollo-code-example" data-clipboard-target="#html-example-' + index + ' .highlight .code">\n';
    example += '<div class="apollo-code-example__message" data-text="Click to copy">Click to copy</div>\n';
    example += '```html \n' + beautify.html(widget.html) + '\n```\n';
    example += '</div>';
    return example;
};

exports.footer = function(totalWidgets) {
    var footer = '<hr class="apollo-widget__hr">\n';
    footer += '**Total examples** <span>' + totalWidgets + '</span>';
    return footer;
};
