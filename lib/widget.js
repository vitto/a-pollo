var headerTitle = function(value) {
    return value + '\n' + '===' + '\n\n';
};

var headerFile = function(value) {
    return 'File: `' + value + '`' + '\n\n';
};

var headerBlock = function(value) {
    return 'Block selector: `' + value + '`' + '\n\n';
};

var header = function (widget) {
    var markdown;
    markdown  = headerTitle(widget.type + ' / ' + widget.name);
    markdown += headerFile(widget.file);
    markdown += headerBlock(widget.slug);
    return markdown;
};

var example = function (widget) {
    // slug
    // name
    // text
    // html
    return '';
};

exports.toPage = function(widget) {
    var page, isNew, widgetBlock;

    isNew = true;

    for (var j = 0; j < widget.length; j += 1) {
        widgetBlock = widget[j];
        if (isNew) {
            isNew = false;
            page = header(widgetBlock);
        }
        page += example(widgetBlock);
    }
    return page;
};
