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

exports.header = function (widget, config) {
    var markdown;
    markdown  = widget.type + ' / ' + widget.name + '\n' + '===' + '\n\n';
    markdown += 'Author/s: ' + (widget.auth || config.auth || 'Not specified' ) + '\n\n';
    markdown += 'File: `' + widget.file + '`' + '\n\n';
    markdown += 'Block selector: `' + widget.slug.replace(/^([^.]{1,})/, '.$1') + '`' + '\n\n';
    return markdown;
};

exports.example = function (widget, skipInitialBlock) {
    var example;
    example = '';
    if (skipInitialBlock || false) {
        example += '### ' + widget.name + '\n\n';
        if (widget.auth) {
            example += 'Author/s: ' + widget.auth + '\n\n';
        }
        if (widget.text) {
            example += widget.text + '\n\n';
        }
        if (widget.slug) {
            example += 'Selector: `' + widget.slug.replace(/^([^.]{1,})/, '.$1') + '`' + '\n\n';
        }
    }
    example += '---\n\n';
    example += widget.html + '\n\n';
    example += '---\n\n';
    example += '``` html\n' + beautify(widget.html, beautifyOptions) + '\n```\n\n';
    return example;
};

exports.footer = function(totalWidgets) {
    var footer = '---\n\n';
    footer += 'Total examples: ' + totalWidgets;
    return footer;
};
