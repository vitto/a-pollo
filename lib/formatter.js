var moment = require('moment');

var numberPlurals = function(value, singular, plural) {
    return (value === 1) ? value + ' ' + singular : value + ' ' + plural;
};

var getTotalExamples = function(snippets) {
    var i, examples = 0;
    for (i = 0; i < snippets.length; i += 1) {
        examples = examples + snippets[i].length;
    }
    return examples;
};

var getLastSnippetDate = function(snippets) {
    var i, j, x, latestDate = 0;
    for (i = 0; i < snippets.length; i += 1) {
        for (j = 0; j < snippets[i].length; j += 1) {
            if (snippets[i][j].date !== undefined) {
                if (typeof snippets[i][j].date === 'string') {
                    if (latestDate === 0 || latestDate < snippets[i][j].date) {
                        latestDate = snippets[i][j].date;
                    }
                } else {
                    var dates = snippets[i][j].date;
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

var getSnippetWorkingDays = function(snippets) {
    var i, j, x, snippetDevelopmentDays, snippetDates, latestDate;
    latestDate = '';
    snippetDevelopmentDays = 0;
    snippetDates = [];
    for (i = 0; i < snippets.length; i += 1) {
        for (j = 0; j < snippets[i].length; j += 1) {
            if (snippets[i][j].date !== undefined) {
                if (typeof snippets[i][j].date === 'string') {
                    snippetDates[moment(snippets[i][j].date).format('YYYY-MM-DD')] = '';
                } else {
                    var dates = snippets[i][j].date;
                    for (x = 0; x < dates.length; x += 1) {
                        snippetDates[moment(dates[x]).format('YYYY-MM-DD')] = '';
                    }
                }
            }
        }
    }
    return Object.keys(snippetDates).length;
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

exports.setProjectStats = function(config, snippets) {

    var lastSnippetDate, dateDiff, dateDuration,
        dateBusinessDays, daysTotal,
        snippetWorkingDays, snippetsTotal, snippetExamplesCount, snippetExamplesTotal;

    lastSnippetDate = getLastSnippetDate(snippets);
    snippetWorkingDays = getSnippetWorkingDays(snippets);
    dateBusinessDays = getWorkdays(moment(config.date), moment(lastSnippetDate));
    daysTotal = moment(lastSnippetDate).diff(moment(config.date), 'days');
    dateDiff = moment(moment(lastSnippetDate).diff(moment(config.date)));
    dateDuration = dateDiff.toObject();
    dateDuration.years = dateDuration.years - 1970;
    dateDuration.years = numberPlurals(dateDuration.years, 'year', 'years');
    dateDuration.months = numberPlurals(dateDuration.months, 'month', 'months');
    dateDuration.days = numberPlurals(dateDuration.date, 'day', 'days');
    dateDuration.hours = numberPlurals(dateDuration.hours, 'hour', 'hours');
    dateDuration.minutes = numberPlurals(dateDuration.minutes, 'minute', 'minutes');
    dateDuration.seconds = numberPlurals(dateDuration.seconds, 'second', 'seconds');
    dateDuration.milliseconds = numberPlurals(dateDuration.milliseconds, 'millisecond', 'milliseconds');

    snippetsTotal = numberPlurals(snippets.length, 'snippet', 'snippets');
    snippetExamplesCount = getTotalExamples(snippets);
    snippetExamplesTotal = numberPlurals(snippetExamplesCount, 'example', 'examples');

    config.stats = {
        date : {
            begin: moment(config.date).format(config.date_format),
            end: moment(lastSnippetDate).format(config.date_format),
            business: dateBusinessDays,
            total: dateDuration,
            days: daysTotal
        },
        snippet : {
            activity: (snippetWorkingDays / dateBusinessDays * 100).toFixed(0),
            days: snippetWorkingDays,
            count: snippets.length,
            countExamples: snippetExamplesCount,
            total: snippetsTotal,
            totalExamples: snippetExamplesTotal
        }
    };
    return config;
};


exports.toHexo = function(data) {
    var post = {
        engine : 'ejs',
        title : data[0].name,
        tags : [data[0].category]
    };

    if (data[0].isDoc) {
        post.layout = 'doc';
        post.category = 'documentation';
        post.annotations = data;
    } else {
        post.layout = 'snippet';
        post.category = 'snippet';
        post.annotations = data;
    }

    return post;
};
