var moment = require('moment');

var numberPlurals = function(value, singular, plural) {
    return (value === 1) ? value + ' ' + singular : value + ' ' + plural;
};

var getTotalExamples = function(widgets) {
    var i, examples = 0;
    for (i = 0; i < widgets.length; i += 1) {
        examples = examples + widgets[i].length;
    }
    return examples;
};

var getLastWidgetDate = function(widgets) {
    var i, j, latestDate = 0;
    for (i = 0; i < widgets.length; i += 1) {
        for (j = 0; j < widgets[i].length; j += 1) {
            if (widgets[i][j].date !== undefined) {
                if (latestDate === 0 || latestDate < widgets[i][j].date) {
                    latestDate = widgets[i][j].date;
                }
            }
        }
    }
    return latestDate;
};

exports.setProjectStats = function(config, widgets) {

    var lastWidgetDate, dateDiff;
    lastWidgetDate = getLastWidgetDate(widgets);
    dateDiff = moment(moment(lastWidgetDate).diff(moment(config.date))).toObject();
    dateDiff.years = dateDiff.years - 1970;
    dateDiff.years = numberPlurals(dateDiff.years, 'year', 'years');
    dateDiff.months = numberPlurals(dateDiff.months, 'month', 'months');
    dateDiff.date = numberPlurals(dateDiff.date, 'day', 'days');
    dateDiff.hours = numberPlurals(dateDiff.hours, 'hour', 'hours');
    dateDiff.minutes = numberPlurals(dateDiff.minutes, 'minute', 'minutes');
    dateDiff.seconds = numberPlurals(dateDiff.seconds, 'second', 'seconds');
    dateDiff.milliseconds = numberPlurals(dateDiff.milliseconds, 'millisecond', 'milliseconds');

    config.stats = {
        date: moment(config.date).format(config.date_format),
        dateDuration: dateDiff,
        widgetsTotal: numberPlurals(widgets.length, 'widget', 'widgets'),
        widgetExamplesTotal: numberPlurals(getTotalExamples(widgets), 'example', 'examples'),
        widgetLastDate: moment(lastWidgetDate).format(config.date_format)
    };
    return config;
};


exports.toHexo = function(data) {

    return {
        layout : 'post',
        engine : 'ejs',
        category : data[0].category,
        title : data[0].name,
        docs : data
    };
};
