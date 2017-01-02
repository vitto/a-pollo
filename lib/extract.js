'use strict'

const beautify = require('./beautify')
const htmlParser = require('./html')
const defaults = require('defaults')
const minify = require('html-minifier').minify
const stripIndent = require('strip-indent')

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
    default: 'Uncategorized',
    regex: /@category:[ ]*(.*)/g
  })
}

function code (data) {
  const regex = /@code:(.*)(([\n\r].+?)*)(?=@author|@category|@code|@css|@date|@doc|@html|@icon|@public|@name|@params|@returns|@text|@version|\n\*\/)/g

  return {
    code: extract({
      data: data,
      key: 2,
      regex: regex
    }),
    text: extract({
      data: data,
      key: 1,
      regex: regex
    })
  }
}

function css (data) {
  const regex = /@css:(.*)(([\n\r].+?)*)(?=@author|@category|@code|@css|@date|@doc|@html|@icon|@public|@name|@params|@returns|@text|@version|\n\*\/)/g

  return {
    code: extract({
      data: data,
      key: 2,
      regex: regex
    }),
    text: extract({
      data: data,
      key: 1,
      regex: regex
    })
  }
}

function date (data) {
  return extract({
    data: data,
    key: 1,
    regex: /@date:[ ]*(.*)/g
  })
}

function doc (data) {
  return extract({
    data: data,
    default: 'snippet',
    regex: /@doc:[ ]*(.*)/g
  })
}

function hasAnnotations (data) {
  return data.match(/\/\*[ \t\n]*@a-pollo[\s\S]*?\*\//g) !== null
}

function htmlSnippet (data) {
  const regex = /@html:(.*)(([\n\r].+?)*)(?=@author|@category|@code|@css|@date|@doc|@html|@icon|@public|@name|@params|@returns|@text|@version|\n\*\/)/g

  const html = extract({
    data: data,
    key: 2,
    regex: regex
  }).replace(/[ ]{1,}data-style="([0-9a-zA-Z:;\- ]*)"[ ]{1,}/g, ' ')

  return beautify.html(
    minify(html, minifyOptions)
  )
}

function html (data, cb) {
  const regex = /@html:(.*)(([\n\r].+?)*)(?=@author|@category|@code|@css|@date|@doc|@html|@icon|@public|@name|@params|@returns|@text|@version|\n\*\/)/g


  const html = extract({
    data: data,
    key: 2,
    regex: regex
  })

  // html.mergeDataStyles(htmlStrings[0], function (err, html) {
  //   if (err) {
  //     throw err
  //   }
  //   tap.equal(html, `<a class="button" href="#" style="width:100px;background-image:url('heilo.svg')">Visit this link</a>`)
  // })
  htmlParser.mergeDataStyles(html, function (err, htmlMerged) {
    console.log(htmlMerged);
    if (err) {
      cb(err)
    }
    cb(null, {
      code: beautify.html(
        minify(htmlMerged, minifyOptions)
      ),
      text: extract({
        data: data,
        key: 1,
        regex: regex
      })
    })
  })
}










function icon (data) {
  return extract({
    data: data,
    regex: /@icon:[ ]*(.*)/g
  })
}

function name (data) {
  return extract({
    data: data,
    regex: /@name:[ ]*(.*)/g
  })
}

function text (data) {
  return extract({
    data: data,
    default: 'Uncategorized',
    regex: /@text:[ ]*([^(@|*)]{1,})*/g
  })
  .replace(/[ ]{2,}/g, ' ')
  .replace(/\n/g, '\n')
  .trim()
}

// function html (data, useStyle) {
//   const applyStyle = useStyle || false
//   const regexStyle = /(data-style="([0-9a-zA-Z:;\- ]*)")/g
//   const replaceStyle = applyStyle ? 'style="$2"' : ''
//
//   return minify(extract({
//     data: data,
//     default: 'Uncategorized',
//     regex: /@html[ ]*:[ ]*([^@|*]{1,})/g
//   }), minifyOptions)
//   .trim()
//   .replace(regexStyle, replaceStyle)
// }



function version (data) {
  return extract({
    data: data,
    default: 'Not specified',
    regex: /@version:[ ]*(.*)/g
  })
}

function isPublic (data) {
  return extract({
    data: data,
    default: true,
    regex: /@public:[ ]*(.*)/g
  })
}

function returns (data) {
  return extract({
    data: data,
    default: 'null',
    regex: /@returns:[ ]*(.*)/g
  })
}

/*


var getDocParamContents = function(paramFull) {
    var re, param, text, paramTypeOf, paramVarName, paramDefaultValue, matchTypeOf, matchVarName, matchDefaultValue;
    re = /@param(eter){0,1}[ ]*:[ ]*(.*)([^(@|\*)]{1,})?/g;
    param = paramFull.replace(re, '$1').trim();

    text = paramFull.replace(re, '$2').trim();

    matchTypeOf = param.match(/\{([A-Za-z-_$@]*)\}/i);
    matchVarName = param.match(/\(([A-Za-z-_$@]*)\)/i);
    matchDefaultValue = param.match(/\[([A-Za-z-_$@]*)\]/i);

    paramTypeOf = matchTypeOf !== null ? matchTypeOf[1].trim() : '';
    paramVarName = matchVarName !== null ? matchVarName[1].trim() : '';
    paramDefaultValue = matchDefaultValue !== null ? matchDefaultValue[1].trim() : '';

    return {
        type: paramTypeOf,
        name: paramVarName,
        defaultValue: paramDefaultValue,
        text: text
    };
};

var extractDocParams = function(data) {
    var re, results, params;
    re = /@param(eter){0,1}[ ]*:[ ]*(.*)([^(@|\*)]{1,})?/g;
    results = data.match(re);
    params = [];
    if (results !== null) {
        for (var i = 0; i < results.length; i += 1) {
            params.push(getDocParamContents(results[i]));
        }
    }
    return params;
};

*/



module.exports.author = author
module.exports.category = category
module.exports.code = code
module.exports.css = css
module.exports.date = date
module.exports.doc = doc
module.exports.hasAnnotations = hasAnnotations
module.exports.html = html
module.exports.htmlSnippet = htmlSnippet
module.exports.icon = icon
module.exports.public = isPublic
module.exports.name = name
module.exports.params = 'params'
module.exports.returns = returns
module.exports.text = text
module.exports.version = version
