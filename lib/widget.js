var markdown = require('./markdown');


exports.toMarkdown = function(widgets, config) {
    var page, isNew, widget;

    isNew = true;

    for (var j = 0; j < widgets.length; j += 1) {
        widget = widgets[j];
        if (isNew) {
            isNew = false;
            page = markdown.header(widget, config);
            page += markdown.example(widget, j, false);
        } else {
            page += markdown.example(widget, j, true);
        }
    }
    page += markdown.footer(widgets.length);
    return page;
};

exports.toYaml = function(widget) {
    return widget;
};
