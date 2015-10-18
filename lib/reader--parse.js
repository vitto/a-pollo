var extractTitle = function(data) {
    var re = /@title[ ]*:[ ]*(.*)/g;
    return data.match(re)[0].replace(re, '$1');
};

var extractName = function(data) {
    var re = /@name[ ]*:[ ]*(.*)/g;
    return data.match(re)[0].replace(re, '$1');
};

var extractCategory = function(data) {
    var re = /@category[ ]*:[ ]*(.*)/g;
    return data.match(re)[0].replace(re, '$1');
};

var extractDescription = function(data) {
    var re = /@description[ ]*:[ ]*([^(@|\*\/)]{1,})*/g;
    return data.match(re)[0].replace(re, '$1').replace(/[ ]{2,}/g, ' ').trim();
};

var extractHtml = function(data) {
    var re = /@html[ ]*:[ ]*([^(@|\*)]{1,})/g;
    return data.match(re)[0].replace(re, '$1').trim();
};

var extractComments = function(file, path) {
    var data, comments;
    comments = file.match(/\/\*@pollo[\s\S]*?\*\//g);

    if (comments === null) {
        return [];
    }

    for (var i = 0; i < comments.length; i =+ 1) {
        data = comments[i];
        comments[i] = {
            title : extractTitle(data),
            name : extractName(data),
            category : extractCategory(data),
            description : extractDescription(data),
            html : extractHtml(data),
            path : path
        };
    }
    return comments;
};

exports.format = function(file, path) {
    return extractComments(file, path);
};
