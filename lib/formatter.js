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
    var i, j, x, latestDate = 0;
    for (i = 0; i < widgets.length; i += 1) {
        for (j = 0; j < widgets[i].length; j += 1) {
            if (widgets[i][j].date !== undefined) {
                if (typeof widgets[i][j].date === 'string') {
                    if (latestDate === 0 || latestDate < widgets[i][j].date) {
                        latestDate = widgets[i][j].date;
                    }
                } else {
                    var dates = widgets[i][j].date;
                    for (x = 0; x < dates.length; x += 1) {
                        if (latestDate === 0 || latestDate < dates[x]) {
                            latestDate = dates[x];
                        }
                    }
                }
            }
        }
    }
    return latestDate;
};

var getWidgetWorkingDays = function(widgets) {
    var i, j, x, widgetDevelopmentDays, widgetDates, latestDate;
    latestDate = '';
    widgetDevelopmentDays = 0;
    widgetDates = [];
    for (i = 0; i < widgets.length; i += 1) {
        for (j = 0; j < widgets[i].length; j += 1) {
            if (widgets[i][j].date !== undefined) {
                if (typeof widgets[i][j].date === 'string') {
                    widgetDates[moment(widgets[i][j].date).format('YYYY-MM-DD')] = '';
                } else {
                    var dates = widgets[i][j].date;
                    for (x = 0; x < dates.length; x += 1) {
                        widgetDates[moment(dates[x]).format('YYYY-MM-DD')] = '';
                    }
                }
            }
        }
    }
    return Object.keys(widgetDates).length;
};

var getWorkdays = function(start, end) {
    var first = start.clone().endOf('week'); // end of first week
    var last = end.clone().startOf('week'); // start of last week
    var days = last.diff(first,'days') * 5 / 7; // this will always multiply of 7
    var wfirst = first.day() - start.day(); // check first week
    if (start.day() === 0) {
        wfirst = wfirst - 1;
    }
    var wlast = end.day() - last.day(); // check last week
    if (end.day() === 6) {
        wlast = wlast - 1;
    }
    return wfirst + days + wlast; // get the total
};

exports.setProjectStats = function(config, widgets) {

    var lastWidgetDate, dateDiff, dateDuration,
        dateBusinessDays, daysTotal,
        widgetWorkingDays, widgetsTotal, widgetExamplesCount, widgetExamplesTotal;

    lastWidgetDate = getLastWidgetDate(widgets);
    widgetWorkingDays = getWidgetWorkingDays(widgets);
    dateBusinessDays = getWorkdays(moment(config.date), moment(lastWidgetDate));
    daysTotal = moment(lastWidgetDate).diff(moment(config.date), 'days');
    dateDiff = moment(moment(lastWidgetDate).diff(moment(config.date)));
    dateDuration = dateDiff.toObject();
    dateDuration.years = dateDuration.years - 1970;
    dateDuration.years = numberPlurals(dateDuration.years, 'year', 'years');
    dateDuration.months = numberPlurals(dateDuration.months, 'month', 'months');
    dateDuration.days = numberPlurals(dateDuration.date, 'day', 'days');
    dateDuration.hours = numberPlurals(dateDuration.hours, 'hour', 'hours');
    dateDuration.minutes = numberPlurals(dateDuration.minutes, 'minute', 'minutes');
    dateDuration.seconds = numberPlurals(dateDuration.seconds, 'second', 'seconds');
    dateDuration.milliseconds = numberPlurals(dateDuration.milliseconds, 'millisecond', 'milliseconds');

    widgetsTotal = numberPlurals(widgets.length, 'widget', 'widgets');
    widgetExamplesCount = getTotalExamples(widgets);
    widgetExamplesTotal = numberPlurals(widgetExamplesCount, 'example', 'examples');

    config.stats = {
        date : {
            begin: moment(config.date).format(config.date_format),
            end: moment(lastWidgetDate).format(config.date_format),
            business: dateBusinessDays,
            total: dateDuration,
            days: daysTotal
        },
        widget : {
            activity: (widgetWorkingDays / dateBusinessDays * 100).toFixed(0),
            days: widgetWorkingDays,
            count: widgets.length,
            countExamples: widgetExamplesCount,
            total: widgetsTotal,
            totalExamples: widgetExamplesTotal
        }
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
