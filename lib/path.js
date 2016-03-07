var log = function(path, useLog) {
    if (useLog !== undefined && useLog !== false) {
        console.log(path);
    }
};

var trimRight = function(path, useLog) {
    var pattern = /([^a-zA-Z_-]{1,})$/;
    path = path.replace(pattern, '');
    log(path, useLog);
    return path;
};

var trimLeft = function(path, useLog) {
    var pattern = /^([^a-zA-Z_-]{1,})/;
    path = path.replace(pattern, '');
    log(path, useLog);
    return path;
};

var trimBoth = function(path, useLog) {
    path = trimRight(trimLeft(path, false), false);
    log(path, useLog);
    return path;
};

var inside = function(path, useLog) {
    // fixPath
    path = trimRight(path, false) + '/*';
    log(path, useLog);
    return path;
};

var toParent = function(path, useLog) {
    // cleanStartPath
    path = '../' + trimLeft(path, false);
    log(path, useLog);
    return path;
};

var fromModule = function(targetPath) {
    return __dirname + '/../' + trimLeft(targetPath);
};

var fromProcess = function(targetPath) {
    return process.cwd() + '/' + trimRight(trimLeft(targetPath));
};

exports.fromModule = function(targetPath) {
    return fromModule(targetPath);
};

exports.fromProcess = function(targetPath) {
    return fromProcess(targetPath);
};

exports.inside = function(path, useLog) {
    // fixPath
    return inside(path, useLog);
};

exports.trimRight = function(path, useLog) {
    // cleanEndPath
    return trimRight(path, useLog);
};

exports.trimLeft = function(path, useLog) {
    // trimLeft
    return trimLeft(path, useLog);
};

exports.trimBoth = function(path, useLog) {
    // trimBoth
    return trimBoth(path, useLog);
};

exports.toParent = function(path, useLog) {
    // cleanStartPath
    return toParent(path, useLog);
};

exports.fromModule = function(path, useLog) {
    // filePath
    return fromModule(path, useLog);
};

exports.fromProcess = function(path, useLog) {
    // callerPath
    return fromProcess(path, useLog);
};
