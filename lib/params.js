exports.configFile = function(argv, apolloDefaultConfPath) {
    var prevProp, filename;
    filename = apolloDefaultConfPath;
    prevProp = '';

    argv.forEach(function(val) {

        if (val.indexOf('config=') === 0) {
            filename = val.replace('config=', '');
        }

        if (prevProp === '--config') {
            filename = val;
            prevProp = '';
        }

        if (val.indexOf('--config') === 0) {
            prevProp = '--config';
            filename = val.replace('--config ', '');
        }
    });
    return filename;
};
