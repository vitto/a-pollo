'use strict'

const beautifyHtml = require('js-beautify').html
const beautifyOptions = {
  'brace_style': 'collapse',
  'break_chained_methods': false,
  'end_with_newline': false,
  'eol': '\n',
  'eval_code': false,
  'indent_char': ' ',
  'indent_level': 0,
  'indent_size': 4,
  'indent_with_tabs': false,
  'jslint_happy': false,
  'keep_array_indentation': false,
  'keep_function_indentation': false,
  'max_preserve_newlines': 10,
  'preserve_newlines': true,
  'space_after_anon_function': false,
  'space_before_conditional': true,
  'unescape_strings': false,
  'wrap_attributes_indent_size': 4,
  'wrap_attributes': 'auto',
  'wrap_line_length': 0
}

module.exports.html = function (html) {
  return beautifyHtml(html, beautifyOptions)
}
