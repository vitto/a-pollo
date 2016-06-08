'use strict';

var gulp = require('gulp'),
  autoprefixer = require('gulp-autoprefixer'),
  analyzer     = require('analyze-css'), // https://github.com/macbre/analyze-css
  colors       = require('colors'),
  concat       = require('gulp-concat'),
  csslint      = require('gulp-csslint'),
  moment       = require('moment'),
  plugins      = require('gulp-load-plugins')(),
  run          = require('run-sequence'),
  sass         = require('gulp-sass'),
  jshint       = require('gulp-jshint'), // https://github.com/spalger/gulp-jshint
  sourcemaps   = require('gulp-sourcemaps'),
  stylestats   = require('gulp-stylestats'),
  uglify       = require('gulp-uglify'),
  uglifyCss    = require('gulp-uglifycss'),
  yaml         = require('js-yaml'),
  fs           = require('fs'),
  twig         = require('gulp-twig'),
  prettify     = require('gulp-html-prettify'),
  faker        = require('faker'),
  browserSync  = require('browser-sync');

var buildIndex = 0,
  c = false,
  cssThemes = [],
  startBuildDate,
  themeBuildTasks = [],
  themesTotal = 0,
  phrases = {};

phrases.change = [
  'Hey, something\'s happened to %file%, this is a work for DUSTMAN...',
  'Dear %file%, do you really though I wouldn\'t noticed you? Hahaha!',
  'Aha! %file%! You are under build!'
];
phrases.unlink = [
  'We have lost %file%, this is a work for DUSTMAN...',
  'Oh my god... %file%... Nooooo!',
  'Another good %file% gone... I will avange you...'
];
phrases.add = [
  'What the hell is %file%?? I, DUSTMAN will do something to solve this situation...',
  'I made a sensational discovery, %file% was found right there!',
  'Hey %file%, welcome to the build',
];

/* = = = = = = = = = = = = = = = = = = = = = = = = = */

for (var i = 0; i < process.argv.length; i += 1) {
    if (process.argv[i] === '--config') {
        if (process.argv[i+1] !== undefined) {
            var file = process.argv[i + 1];
            c = yaml.safeLoad(fs.readFileSync(file, 'utf-8'));
        }
    }
}

if (!c) {
  c = yaml.safeLoad(fs.readFileSync('./dustman.yml', 'utf-8'));
}

if (c.css === undefined) {
  console.log(colors.red('Error: object dustman is NOT present in YAML configuration.'));
  process.exit();
}

faker.locale = c.config.faker ? c.config.faker.locale ? c.config.faker.locale : 'en' : 'en';
themesTotal = c.css.themes.length;

/* = = = = = = = = = = = = = = = = = = = = = = = = = */

var messageVerbose = function(title, message) {
  if (c.css.verbose !== undefined && c.css.verbose >= 3) {
    if (message !== undefined) {
      console.log(colors.yellow(title.trim() + ': ') + message.trim());
    } else {
      console.log(colors.yellow(title.trim()));
    }
  }
};

var message = function(message, force) {
  if (force !== undefined && force || c.css.verbose !== undefined && c.css.verbose >= 2) {
    console.log(message);
  }
};

var messageFile = function(phrases, file) {
  var min, max, phrase, splitPhrase, index;
  min = 1;
  max = phrases.length;
  index = (Math.floor(Math.random() * (max - min + 1)) + min) - 1;
  phrase = phrases[index];
  splitPhrase = phrase.split('%file%');
  message(colors.magenta(splitPhrase[0]) + file + colors.magenta(splitPhrase[1]));
  messageVerbose('');
};

var messageError = function(message) {
  if (c.css.verbose !== undefined && c.css.verbose >= 1) {
    console.log(colors.red('Error: ') + message.trim());
  }
};

/* = = = = = = = = = = = = = = = = = = = = = = = = = */

var check = function(path, throwErr) {
  var throwError = throwErr || false;
  try {
    path = path.replace(new RegExp(/\*.*$/), '');
    fs.accessSync(path, fs.F_OK);
      return true;
  } catch (e) {
    if (throwError) {
      messageError(path + colors.red(' not found'));
      if (c.css.verbose !== undefined && c.css.verbose >= 3) {
        console.log(e);
      }
      process.exit();
    } else {
      return false;
    }
  }
};

var checkConfig = function(name, value) {
  if (value === undefined) {
    messageError('No "' + name + '" defined in config YAML');
    process.exit();
  } else {
    return true;
  }
};

/* = = = = = = = = = = = = = = = = = = = = = = = = = */

var watchList = function() {
  var list = [];
  if (checkConfig('twig.watch', c.twig.watch)) {
    list.push(c.twig.watch);
  }

  if (checkConfig('css.watch', c.css.watch)) {
    list.push(c.css.watch);
  }

  if (checkConfig('js.watch', c.js.watch)) {
    list.push(c.js.watch);
  }
  return list;
};

/* = = = = = = = = = = = = = = = = = = = = = = = = = */

var taskPrefix = function(themeName, action) {
  return 'css:theme:' + themeName + ':' + action;
};

var tasksList = function(theme, taskNames) {
  var tasks = [];
  for (var i = 0; i < taskNames.length; i += 1) {
    tasks.push(taskPrefix(theme.name, taskNames[i]));
  }
  return tasks;
};

var tasks = function(theme, taskNames) {
  var tasks = {};
  for (var i = 0; i < taskNames.length; i += 1) {
    tasks[taskNames[i]] = taskPrefix(theme.name, taskNames[i]);
  }
  return tasks;
};

/* = = = = = = = = = = = = = = = = = = = = = = = = = */

var addTask = function(theme, index){

  var compile = theme.compile,
    destinationPath = c.paths.css,
    file = theme.file,
    fonts = theme.fonts || false,
    images = theme.images || false,
    name = theme.name,
    prefixAutoprefixer = c.config.autoprefixer ? theme.autoprefixer ? true : false : false,
    reportStylestats = c.config.stylestats ? theme.stylestats ? true : false : false,
    task = {},
    tasksToBuild = [],
    testCsslint = c.config.csslint ? theme.csslint ? true : false : false,
    themeBuildSubTasks = [];

  check(compile, true);

  tasksToBuild = ['build', 'css'];

  if (testCsslint) { tasksToBuild.push('testCsslint'); }
  if (reportStylestats) { tasksToBuild.push('reportStylestats'); }
  if (prefixAutoprefixer) { tasksToBuild.push('prefixAutoprefixer'); }
  if (images) { tasksToBuild.push('images'); }
  if (fonts) { tasksToBuild.push('fonts'); }

  task = tasks(theme, tasksToBuild);
  themeBuildTasks.push(task.build);
  themeBuildSubTasks = tasksList(theme, tasksToBuild.slice(1));

  if (!prefixAutoprefixer) {
    cssThemes.push(destinationPath + file);
  } else {
    cssThemes.push(destinationPath + 'autoprefixer/' + file);
  }

  gulp.task(task.css, function () {
    if (buildIndex === 0 && index > 0 ) {
      messageVerbose('');
    }
    message('Build CSS theme');

    if (themesTotal >= 1) {
      messageVerbose('Theme task', name + ' ' + (index + 1) + ' of ' + themesTotal);
    }
    messageVerbose('File', destinationPath + file);

    return gulp.src(compile)
      .pipe(sourcemaps.init())
      .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
      .pipe(concat(file))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(destinationPath));
  });

  if (prefixAutoprefixer) {
    gulp.task(task.prefixAutoprefixer, function () {
      messageVerbose('');
      message('Browser compatibility');
      messageVerbose('Theme', name);
      if (c.config.autoprefixer.browsers) {
        messageVerbose('Autoprefixer browsers', c.config.autoprefixer.browsers.toString().replace(new RegExp(',', 'g'), ', '));
      } else {
        messageVerbose('Autoprefixer', 'Enabled');
      }
      messageVerbose('Adding prefixes to file', destinationPath + file);
      messageVerbose('Browser prefixes saved to', destinationPath + 'autoprefixer/' + file);
      return gulp.src(destinationPath + file)
        .pipe(autoprefixer(c.config.autoprefixer))
        .pipe(gulp.dest(destinationPath + 'autoprefixer/'));
    });
  }

  if (testCsslint) {
    gulp.task(task.testCsslint, function () {
      messageVerbose('');
      message('CSSlint');
      messageVerbose('Theme', name);
      return gulp.src(destinationPath + file)
        .pipe(csslint(c.config.csslint))
        .pipe(csslint.reporter());
    });
  }

  if (reportStylestats) {
    gulp.task(task.reportStylestats, function () {
      return gulp.src(destinationPath + file)
        .pipe(stylestats({
          type: 'md',
          config: c.config.stylestats
        }));
    });
  }

  if (images) {
    gulp.task(task.images, function () {
      messageVerbose('Copy theme images', c.paths.images + name);
      return gulp.src(images)
        .pipe(gulp.dest(c.paths.images + name));
    });
  }

  if (fonts) {
    gulp.task(task.fonts, function () {
      messageVerbose('Copy theme fonts', c.paths.fonts + name);
      return gulp.src(fonts)
        .pipe(gulp.dest(c.paths.fonts + name));
    });
  }

  gulp.task(task.build, gulp.series(themeBuildSubTasks, function(done){
    done();
  }));
};

/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = */

gulp.task('message:start', function (done) {
  if (buildIndex === 0) {
    message('', true);
    message(colors.magenta('   D U S T M A N   '), true);
    message('', true);
  }
  done();
});

gulp.task('timer:start', function(done){
  startBuildDate = Date.now();
  done();
});

if (checkConfig('css', c.css)) {
  if (checkConfig('css.themes', c.css.themes)) {
    for (var t = 0; t < c.css.themes.length; t += 1) {
      addTask(c.css.themes[t], t);
    }
  }
}

gulp.task('vendors:fonts', function (done) {
  if (c.vendors !== undefined && c.vendors.fonts !== undefined) {
    messageVerbose('');
    message('Copying fonts from vendors');
    var i = 0;
    for (i = 0; i < c.vendors.fonts.length; i += 1) {
      messageVerbose('Font vendor', c.vendors.fonts[i]);
      check(c.vendors.fonts[i], true);
    }
    messageVerbose('Vendor fonts copied to', c.paths.fonts);
    return gulp.src(c.vendors.fonts)
      .pipe(gulp.dest(c.paths.fonts));
  }
  messageVerbose('Notice', 'Vendor\'s Fonts not found, skipping task');
  done();
});

gulp.task('vendors:images', function (done) {
  if (c.vendors !== undefined && c.vendors.images !== undefined) {
    messageVerbose('');
    message('Copying images from vendors');
    var i = 0;
    for (i = 0; i < c.vendors.images.length; i += 1) {
      messageVerbose('Image vendor', c.vendors.images[i]);
      check(c.vendors.images[i], true);
    }
    messageVerbose('Vendor images copied to', c.paths.images);
    return gulp.src(c.vendors.images)
      .pipe(gulp.dest(c.paths.images));
  }
  messageVerbose('Notice', 'Vendor\'s Images not found, skipping task');
  done();
});

gulp.task('vendors:css', function (done) {
  if (c.vendors !== undefined && c.vendors.css !== undefined) {
    messageVerbose('');
    message('Merging CSS vendors');
    var i = 0;
    for (i = 0; i < c.vendors.css.files.length; i += 1) {
      messageVerbose('CSS vendor', c.vendors.css.files[i]);
      check(c.vendors.css.files[i], true);
    }
    messageVerbose('Vendor CSS files merged to', c.paths.css + c.vendors.css.file);
    return gulp.src(c.vendors.css.files)
      .pipe(uglifyCss())
      .pipe(concat(c.vendors.css.file))
      .pipe(gulp.dest(c.paths.css));
  }
  messageVerbose('Notice', 'Vendor\'s CSS not found, skipping task');
  done();
});

gulp.task('message:end', function(done){
  var stopBuildDate = Date.now();
  var timeSpent = (stopBuildDate - startBuildDate)/1000 + ' secs';

  messageVerbose('');

  if (buildIndex > 0) {
    message('Build ' + colors.yellow('[ ' + buildIndex + ' ]') + ' done at ' + colors.yellow(moment().format('HH:mm')) + ' and ' + colors.yellow(moment().format('ss')) + ' seconds.', true);
    message(colors.green('The dust was cleaned successfully in ' + timeSpent));
    message('Waiting for file changes...');
  } else {
    message(colors.green('The dust was cleaned successfully in ' + timeSpent));
  }

  messageVerbose('');

  buildIndex += 1;
  done();
});

gulp.task('js:build', function (done) {
  if (c.js !== undefined && c.js.files !== undefined) {
    messageVerbose('');
    message('Merging JavaScript files');
    var i = 0;
    for (i = 0; i < c.js.files.length; i += 1) {
      messageVerbose('JavaScript file', c.js.files[i]);
      check(c.js.files[i], true);
    }
    messageVerbose('JavaScript files merged to', c.paths.js + c.js.file);
    return gulp.src(c.js.files)
      .pipe(sourcemaps.init())
      .pipe(uglify())
      .pipe(concat(c.js.file))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(c.paths.js));

  }
  messageVerbose('Notice', 'Vendor\'s JavaScript not found, skipping task');
  done();
});

gulp.task('vendors:build', gulp.series(['vendors:css', 'vendors:images', 'vendors:fonts'], function (done) {
  done();
}));

gulp.task('css:merge', function(done){
  if (c.vendors !== undefined && c.vendors.css !== undefined) {
    messageVerbose('');
    message('Merging all CSS files');
    messageVerbose('CSS to merge', c.paths.css + c.vendors.css.file);
    for (var i = 0; i < cssThemes.length; i += 1) {
      messageVerbose('CSS to merge', cssThemes[i]);
    }
    messageVerbose('All CSS files merged to', c.paths.css + c.css.file);
    var css = [c.paths.css + c.vendors.css.file].concat(cssThemes);
    return gulp.src(css)
      .pipe(uglifyCss())
      .pipe(concat(c.css.file))
      .pipe(gulp.dest(c.paths.css));
  }
  messageVerbose('Notice', 'CSS vendors not found, skipping merge');
  done();
});

gulp.task('watch:js', function () {
    var tasks = [
      'js:build'
    ];
    run(tasks);
    var watchList = [ c.css.watch ];
    if (c.js !== undefined && c.js.watch !== undefined) {
      watchList.push(c.js.watch);
    }
    return gulp.watch(watchList, gulp.series(tasks, function(done){ done(); }));
});

/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = */


gulp.task('twig:html', function (done) {
  if (c.twig !== undefined && c.twig.files !== undefined) {
    var twigConfig = {};
    if (c.config !== undefined && c.config.twig !== undefined) {
      twigConfig = c.config.twig;
    }
    twigConfig.data = {
      faker: faker
    };

    messageVerbose('');
    message('Twig to HTML');
    checkConfig('paths.server', c.paths.server);
    for (var i = 0; i < c.twig.files.length; i += 1) {
      messageVerbose('Twig view', c.twig.files[i]);
    }
    messageVerbose('All Twig files converted in', c.paths.server);
    return gulp.src(c.twig.files)
      .pipe(twig(twigConfig))
      .pipe(prettify(c.prettify || {}))
      .pipe(gulp.dest(c.paths.server));
  }
  messageVerbose('Notice', 'Twig files not found, skipping task');
  done();
});

gulp.task('twig:build', gulp.series(['twig:html'], function(done){
  done();
}));

/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = */

gulp.task('css:build', gulp.series(
  themeBuildTasks.concat([
  'vendors:build',
  'css:merge'
]), function(done){
  done();
}));

/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = */

gulp.task('watch:http', function() {
  return browserSync.stream();
});

gulp.task('http', gulp.series(['css:build', 'watch:http'], function() {
  browserSync.init({
    server: {
        baseDir: c.paths.server
    },
    logLevel: 'info',
    notify: true
  });

  return gulp.watch(watchList(), gulp.parallel(['css:build', 'twig:build', 'js:build'], browserSync.reload))
    .on('change', function(path) {
      messageFile(phrases.change, path);
    })
    .on('unlink', function(path) {
      messageFile(phrases.unlink, path);
    })
    .on('add', function(path) {
      messageFile(phrases.add, path);
    });
}));

gulp.task('watch', gulp.series([
  'css:build',
  'twig:build',
  'js:build'
], function() {
  return gulp.watch(watchList(), gulp.parallel(['css:build', 'twig:build', 'js:build']))
    .on('change', function(path) {
      messageFile(phrases.change, path);
    })
    .on('unlink', function(path) {
      messageFile(phrases.unlink, path);
    })
    .on('add', function(path) {
      messageFile(phrases.add, path);
    });
}));

gulp.task('default', gulp.series([
  'message:start',
  'timer:start']
  .concat(themeBuildTasks).concat([
  'vendors:build',
  'css:merge',
  'js:build',
  'twig:build',
  'message:end'
]), function(done) {
  done();
}));
