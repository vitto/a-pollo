var beautify = require('js-beautify').html;
var beautifyOptions = {
    'indent_size': 4,
    'indent_char': ' ',
    'eol': '\n',
    'indent_level': 0,
    'indent_with_tabs': false,
    'preserve_newlines': true,
    'max_preserve_newlines': 10,
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
    'wrap_attributes': 'auto',
    'wrap_attributes_indent_size': 4,
    'end_with_newline': false
};

exports.header = function (widget, author) {
    var markdown;
    markdown  = '<h1 class="apollo-widget__title">' + widget.name + '</h1>';
    markdown += '**Category** ' + widget.type + '\n';
    markdown += '**File** `' + widget.file.replace('./', '') + '`' + '\n';
    markdown += '**Block selector** `' + widget.slug + '`' + '\n';
    markdown += '<div class="apollo-widget__description">';
    markdown += '**Author/s** ' + (widget.auth || author || 'Not specified' ) + '\n';
    if (widget.text) {
        markdown += widget.text + '</div>\n\n';
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
    example += widget.html;
    example += '</div>';
    example += '</div>';
    example += '<div class="apollo-title-spacer">';
    example += '**HTML code**';
    example += '</div>';
    example += '<div id="html-example-' + index + '" class="apollo-code-example" data-clipboard-target="#html-example-' + index + ' .highlight .code">\n';
    example += '<div class="apollo-code-example__message" data-text="Click to copy">Click to copy</div>\n';
    example += '```html \n' + beautify(widget.html, beautifyOptions) + '\n```\n';
    example += '</div>';
    return example;
};

exports.footer = function(totalWidgets) {
    var footer = '<hr class="apollo-widget__hr">\n';
    footer += '**Total examples** ' + totalWidgets;
    return footer;
};
