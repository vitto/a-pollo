var moment = require('moment');

var datePlurals = function(date, singular, plural) {
    return (date === 1) ? date + ' ' + singular : date + ' ' + plural;
};

exports.setProjectStats = function(config, widgets) {
    var lastWidgetDate = '2015-12-26';
    var dateDiff = moment(moment(lastWidgetDate).diff(moment(config.date))).toObject();
    dateDiff.years = dateDiff.years - 1970;
    dateDiff.years = datePlurals(dateDiff.years, 'year', 'years');
    dateDiff.months = datePlurals(dateDiff.months, 'month', 'months');
    dateDiff.date = datePlurals(dateDiff.date, 'day', 'days');
    dateDiff.hours = datePlurals(dateDiff.hours, 'hour', 'hours');
    dateDiff.minutes = datePlurals(dateDiff.minutes, 'minute', 'minutes');
    dateDiff.seconds = datePlurals(dateDiff.seconds, 'second', 'seconds');
    dateDiff.milliseconds = datePlurals(dateDiff.milliseconds, 'millisecond', 'milliseconds');

    config.stats = {
        date: moment(config.date).format(config.date_format),
        dateLastWidget: moment(lastWidgetDate).format(config.date_format),
        dateDuration: dateDiff
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
