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

var extractIcons = function(data) {
    return extract(/@icon[ ]*:[ ]*(.*)/g, data);
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

var extractHtml = function(data, useStyle) {
    var enableStyle = useStyle || false;
    var re = /(data-style="([0-9a-zA-Z:;\- ]*)")/g;
    if (enableStyle) {
        return minify(extract(/@html[ ]*:[ ]*([^@|\*]{1,})/g, data), minifyOptions).trim().replace(re, 'style="$2"');
    }
    return minify(extract(/@html[ ]*:[ ]*([^@|\*]{1,})/g, data), minifyOptions).trim().replace(re, '');
};

var extractDoc = function(data) {
    return extract(/@doc[ ]*:[ ]*(.*)/g, data, 'other');
};

var extractDocVersion = function(data) {
    return extract(/@version[ ]*:[ ]*(.*)/g, data, 'Not specified');
};
var extractDocPublic = function(data) {
    return extract(/@public[ ]*:[ ]*(.*)/g, data, 'true');
};

var extractDocReturnVal = function(data) {
    return extract(/@returns[ ]*:[ ]*(.*)/g, data, 'nothing');
};

var extractDocCode = function(data) {
    var code = extract(/@code[ ]*:[ ]*([^@|\*]{1,})/g, data);
    return {
        text: extract(/(^.*)/, code, ''),
        code: code.replace(extract(/(^.*)/, code, ''), '').trim()
    };
};

var extractDocCss = function(data) {
    var code = extract(/@css[ ]*:[ ]*([^@|\*]{1,})/g, data);
    return {
        text: extract(/(^.*)/, code, ''),
        code: code.replace(extract(/(^.*)/, code, ''), '').trim()
    };
};

var getDocParamContents = function(paramFull) {
    var re, param, text, paramTypeOf, paramVarName, paramDefaultValue, matchTypeOf, matchVarName, matchDefaultValue;
    re = /@param[ ]*:[ ]*(.*)([^(@|\*)]{1,})?/g;
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
    re = /@param[ ]*:[ ]*(.*)([^(@|\*)]{1,})?/g;
    results = data.match(re);
    params = [];
    if (results !== null) {
        for (var i = 0; i < results.length; i += 1) {
            params.push(getDocParamContents(results[i]));
        }
    }
    return params;
};


var isDoc = function(data) {
    return data.match(/(@doc:)/g) !== null;
};

var extractComments = function(file, filePath) {
    var data, annotations, apolloData, fileName, html, htmlSnippet;

    annotations = file.match(/\/\*@pollo[\s\S]*?\*\//g);

    apolloData = [];

    if (annotations === null) {
        return [];
    }

    for (var i = 0; i < annotations.length; i += 1) {
        data = annotations[i];
        fileName = path.basename(filePath);
        html = extractHtml(data, true);
        htmlSnippet = beautify.html(extractHtml(data, false));

        // console.log(html, htmlSnippet);

        if (isDoc(data)) {
            apolloData.push({
                isSnippet: false,
                isDoc: true,
                date: extractDate(data),
                name: extractName(data),
                category: extractCategory(data),
                doc: extractDoc(data),
                version: extractDocVersion(data),
                public: extractDocPublic(data),
                params: extractDocParams(data),
                returns: extractDocReturnVal(data),
                code: extractDocCode(data),
                css: extractDocCss(data),
                icon: extractIcons(data),
                text: extractDescription(data),
                html: html,
                htmlSnippet: htmlSnippet,
                auth: extractAuthors(data),
                file: fileName,
                path: filePath
            });
        } else {
            apolloData.push({
                isSnippet: true,
                isDoc: false,
                date: extractDate(data),
                name: extractName(data),
                category: extractCategory(data),
                icon: extractIcons(data),
                text: extractDescription(data),
                html: html,
                htmlSnippet: htmlSnippet,
                auth: extractAuthors(data),
                file: fileName,
                path: filePath
            });
        }

    }
    return apolloData;
};

exports.format = function(file, path) {
    return extractComments(file, path);
};
