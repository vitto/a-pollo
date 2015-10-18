var reader = require('./lib/reader'),
    Metalsmith = require('metalsmith');

var widgets, metalsmith;

widgets = reader.load('test');

var concat = function(files, metalsmith, done){

  widgets

  done();
};

metalsmith = Metalsmith(__dirname)
    .use(concat)
    .build(function(err) {
        if (err) { throw err; }
    });

console.log(widgets);
