function log(path, useLog) {
    if (useLog !== undefined && useLog !== false) {
        console.log(path);
    }
}

exports.trimRight = function(path, useLog) {
    var pattern = /([^a-zA-Z_\-:0-9]{1,})$/;
    path = path.replace(pattern, '');
    log(path, useLog);
    return path;
};

exports.trimLeft = function(path, useLog) {
    var pattern = /^([^a-zA-Z_\-]{1,})/;
    path = path.replace(pattern, '');
    log(path, useLog);
    return path;
};

exports.trimBoth = function(path, useLog) {
    path = exports.trimRight(exports.trimLeft(path, false), false);
    log(path, useLog);
    return path;
};

exports.inside = function(path, useLog) {
    // fixPath
    path = exports.trimRight(path, false) + '/*';
    log(path, useLog);
    return path;
};

exports.toParent = function(path, useLog) {
    // cleanStartPath
    path = '../' + exports.trimLeft(path, false);
    log(path, useLog);
    return path;
};

exports.fromModule = function(targetPath) {
    return __dirname + '/../' + exports.trimLeft(targetPath);
};

exports.fromProcess = function(targetPath) {
    return process.cwd() + '/' + exports.trimBoth(targetPath);
};
