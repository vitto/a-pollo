'use strict'

const beautify = require('./beautify')
const defaults = require('defaults')
const htmlParser = require('./html')
const minify = require('html-minifier').minify
const stripIndent = require('strip-indent')

const annotationRegex = /(\/\*[ \t\n]*@a-pollo-(color|doc|snippet|typography)[\s\S]*?\*\/)|(.*\/\*[ \t\n]*@a-pollo-(color|font)[\s\S]*?\*\/)/g
const htmlRegex = /@html:(.*)(([\n\r].+?)*)(?=@author|@category|@code|@css|@date|@doc|@html|@icon|@public|@name|@param|@returns|@title|@text|@version|[\n ]+\*\/)/g
const minifyOptions = {
  collapseWhitespace: true,
  preserveLineBreaks: false,
  removeEmptyAttributes: true,
  sortAttributes: true
}

function extract (opts) {
  const optionsDefaults = {
    data: null,
    default: null,
    key: 1,
    regex: null
  }

  opts = defaults(opts, optionsDefaults)

  if (opts.data.match(opts.regex) === null) {
    return opts.default
  } else {
    return stripIndent(opts.regex.exec(opts.data)[opts.key]).trim()
  }
}

function annotation (data) {
  return extract({
    data: data,
    regex: /@a-pollo-(color|doc|snippet|typography){1}/g
  })
}

function author (data) {
  return extract({
    data: data,
    key: 2,
    regex: /@author(s){0,1}:[ ]*(.*)/g
  })
}

function category (data) {
  return extract({
    data: data,
    regex: /@category:[ ]*(.*)/g
  })
}

function code (data) {
  const regex = /@code:(.*)(([\n\r]+.+?)*)(?=@author|@category|@code|@css|@date|@doc|@html|@icon|@public|@name|@param|@returns|@title|@text|@version|[\n ]+\*\/)/g

  const code = extract({
    data: data,
    key: 2,
    regex: regex
  })

  if (code !== null) {
    return {
      code: code,
      text: extract({
        data: data,
        key: 1,
        regex: regex
      })
    }
  }
  return code
}

function colorName (data) {
  return extract({
    data: data,
    key: 3,
    regex: /(.*)[ \t]*:[ \t]*(.*)[ \t]*;.*@a-pollo-color:[ ]*(.*)[ \t]*\*\//g
  })
}

function colorVarName (data) {
  return extract({
    data: data,
    key: 1,
    regex: /(.*)[ \t]*:[ \t]*(.*)[ \t]*;.*@a-pollo-color:[ ]*(.*)[ \t]*\*\//g
  })
}

function colorVarValue (data) {
  return extract({
    data: data,
    key: 2,
    regex: /(.*)[ \t]*:[ \t]*(.*)[ \t]*;.*@a-pollo-color:[ ]*(.*)[ \t]*\*\//g
  })
}

function css (data) {
  const regex = /@css:(.*)(([\n\r].+?)*)(?=@author|@category|@code|@css|@date|@doc|@html|@icon|@public|@name|@param|@returns|@title|@text|@version|[\n ]+\*\/)/g

  const code = extract({
    data: data,
    key: 2,
    regex: regex
  })

  if (code !== null) {
    return {
      code: code,
      text: extract({
        data: data,
        key: 1,
        regex: regex
      })
    }
  }
  return code
}

function date (data) {
  return extract({
    data: data,
    key: 1,
    regex: /@date:[ ]*(.*)/g
  })
}

function hasAnnotations (data) {
  return data.match(annotationRegex) !== null
}

function htmlSnippet (data) {
  const html = extract({
    data: data,
    key: 2,
    regex: htmlRegex
  }).replace(/[ ]+data-style="([0-9a-zA-Z:%;\- ]*)"[ ]+/ig, ' ')

  return beautify.html(
    minify(html, minifyOptions)
  )
}

function html (data, cb) {
  const html = extract({
    data: data,
    key: 2,
    regex: htmlRegex
  })

  if (html !== null) {
    htmlParser.mergeDataStyles(html, function (err, htmlMerged) {
      if (err) {
        cb(err)
      }
      cb(null, {
        code: beautify.html(minify(htmlMerged, minifyOptions)),
        source: html,
        text: extract({
          data: data,
          key: 1,
          regex: htmlRegex
        })
      })
    })
  } else {
    cb(null, null)
  }
}

function icon (data) {
  return extract({
    data: data,
    regex: /@icon:[ ]*(.*)/g
  })
}

function isPublic (data) {
  const isPublic = extract({
    data: data,
    regex: /@public:[ ]*(.*)/g
  })
  return isPublic !== null ? isPublic === 'true' : isPublic
}

function name (data) {
  return extract({
    data: data,
    key: 1,
    regex: /@name:[ ]*(.*)/g
  })
}

function params (data) {
  var re = /@param:[ ]*({[\w-$@]{1,}}) ?(\([\w-$@]{1,}\)) ?(\[[\w-$@%#,'"()]{1,}])?([^@]{1,})?/g
  var match = re.exec(data)
  var results = []
  while (match != null) {
    results.push({
      default: match[3] ? match[3].replace(/[[\]]/g, '') : 'optional',
      name: match[2].replace(/[()]/g, ''),
      text: match[4] ? match[4].split('*/')[0].trim() === '' ? null : match[4].split('*/')[0].trim() : null,
      type: match[1].replace(/[{}]/g, '')
    })
    match = re.exec(data)
  }
  return results.length > 0 ? results : null
}

function returns (data) {
  return extract({
    data: data,
    regex: /@returns:[ ]*(.*)/g
  })
}

function selector (data) {
  return extract({
    data: data,
    key: 1,
    regex: /@selector:[ ]*(.*)/g
  })
}

function selectorClass (data) {
  const selectorText = selector(data)
  return selectorText ? selectorText.replace(/[. ]+/g, ' ').trim() : selectorText
}

function title (data, defaultValue) {
  return extract({
    data: data,
    default: defaultValue,
    regex: /@title:[ ]*(.*)/g
  })
}

function text (data) {
  const text = extract({
    data: data,
    regex: /@text:[ ]*(([^@])*(?!\*\/))/g
  })
  return text ? text.replace(/[ ]{2,}/g, ' ').replace(/\n/g, '\n').replace(/\*\/$/, '').trim() : text
}

function type (data) {
  return extract({
    data: data,
    default: 'snippet',
    regex: /@type:[ ]*(.*)/g
  })
}

function version (data) {
  return extract({
    data: data,
    regex: /@version:[ ]*(.*)/g
  })
}

module.exports.annotation = annotation
module.exports.annotationRegex = annotationRegex
module.exports.author = author
module.exports.category = category
module.exports.code = code
module.exports.colorName = colorName
module.exports.colorVarName = colorVarName
module.exports.colorVarValue = colorVarValue
module.exports.css = css
module.exports.date = date
module.exports.hasAnnotations = hasAnnotations
module.exports.html = html
module.exports.htmlSnippet = htmlSnippet
module.exports.icon = icon
module.exports.name = name
module.exports.params = params
module.exports.public = isPublic
module.exports.returns = returns
module.exports.selector = selector
module.exports.selectorClass = selectorClass
module.exports.title = title
module.exports.text = text
module.exports.type = type
module.exports.version = version
