'use strict';

/*
  D U S T M A N
  1.2.18

  A Gulp 4 automation boilerplate
  by https://github.com/vitto
*/

var gulp = require('gulp');


var message = (function(){
  var colour = require('colour');
  colour.setTheme({
    error: 'red bold',
    event: 'magenta',
    intro: 'rainbow',
    notice: 'yellow',
    speak: 'white',
    success: 'green',
    task: 'white',
    verbose: 'blue',
    warning: 'yellow bold'
  });

  var verbose = 3;

  var phrases = {
    add: [
      'What the hell is %file%?? I, DUSTMAN will do something to solve this situation...',
      'I\'ve found a sensational discovery, %file% is alive!',
      'Hey %file%, welcome to da build',
      'File %file% detected. Updating the build.'
    ],
    change: [
      'Hey, something\'s happened to %file%, this is a work for DUSTMAN...',
      'Dear %file%, do you really though I wouldn\'t noticed you? Hahaha!',
      'Aha! %file%! You are under build!',
      'We change every day, just as you, %file%'
    ],
    unlink: [
      'We have lost %file%, this is a work for DUSTMAN...',
      'Oh my god... %file%... Nooooo!',
      'Another good %file% gone... I will avange you...',
      'Good bye %file%. I will clean your past without pain.'
    ],
    wait: [
      'Waiting silently if something changes, is unlinked or added',
      'Dustman is watching them',
      'The dust is never clear totally, waiting for changes',
      'I will seek and clean. Again, and again'
    ]
  };

  var isVerboseEnough = function(verbosity) {
    return verbose >= verbosity;
  };

  var log = function(level, message) {
    if (isVerboseEnough(level)) {
      console.log(message);
    }
  };

  var event = function(eventType, file) {
    var min, max, phrase, splitPhrase, finalPhrase, index;
    min = 1;
    max = phrases[eventType].length;
    index = (Math.floor(Math.random() * (max - min + 1)) + min) - 1;
    phrase = phrases[eventType][index];

    if (typeof file !== 'undefined') {
      splitPhrase = phrase.split('%file%');
      finalPhrase = colour.event(splitPhrase[0]) + file + colour.event(splitPhrase[1]);
    } else {
      finalPhrase = colour.event(phrase + '...');
    }

    log(1, finalPhrase);
  };

  return {
    intro: function() {
      console.log('');
      console.log(colour.intro('   D U S T M A N   '));
      console.log('');
    },
    error: function(message) {
      log(0, colour.error('Error: ') + message.trim());
      process.exit();
    },
    event: function(eventType, file) {
      event(eventType, file);
    },
    wait: function() {
      log(3, '');
      event('wait');
    },
    notice: function(message) {
      log(2, colour.notice('Notice: ') + message.trim());
    },
    setVerbosity: function(verbosity) {
      verbose = verbosity;
    },
    speak: function(message) {
      log(2, colour.speak(message));
    },
    success: function(message) {
      log(1, colour.success(message.trim()));
    },
    task: function(message) {
      log(3, '');
      log(2, colour.task(message));
    },
    verbose: function(title, message) {
      if (typeof message !== 'undefined') {
        log(3, colour.verbose(title.trim() + ': ') + message.trim());
      } else {
        log(3, colour.verbose(title.trim()));
      }
    },
    warning: function(message){
      log(2, colour.warning('Warning: ') + message.trim());
    },
  };
})();


var config = (function(){
  var colour = require('colour');
  var fs = require('fs');
  var yaml = require('js-yaml');
  var merge = require('merge');
  var path = require('path');

  var configFile = 'dustman.yml';

  var data = {
    config: {
      autoprefixer: {
        browsers: [
          'last 3 versions'
        ]
      },
      faker: {
        locale: 'en'
      },
      prettify: {
        indent_char: ' ',
        indent_size: 2
      },
      twig: {
        cache: false
      },
      verbose: 3,
      verify: false
    },
    css: {
      file: 'dustman.min.css',
      watch: './**/*.css'
    },
    js: {
      file: 'dustman.min.js',
      watch: './**/*.js'
    },
    paths: {
      css: 'dustman/css/',
      fonts: 'dustman/fonts/',
      images: 'dustman/img/',
      js: 'dustman/js/',
      server: 'dustman/'
    },
    tasks: [
      'css',
      'js',
      'html'
    ]
  };

  var configFileExists = function(configFile) {
    try {
      fs.accessSync(configFile, fs.F_OK);
      return true;
    } catch (e) {
      message.error('config file configFile NOT found');
    }
  };

  var checkDefaultConfig = function(loadedConfig, configFile){
    if (!loadedConfig) {
      configFileExists(configFile);
      return yaml.safeLoad(fs.readFileSync(configFile, 'utf-8'));
    }
    return loadedConfig;
  };

  var pathClean = function(configPath) {
    return path.normalize(configPath).replace(/\/$/, '') + '/';
  };

  var checkArguments = function(){
    var loadedConfig = false;
    for (var i = 0; i < process.argv.length; i += 1) {
      if (process.argv[i] === '--silent') {
        message.warning('You\'ve set --silent or --S flag to che gulp process, this could hide some errors not handled by Dustman');
      }
      if (process.argv[i] === '--config' && process.argv[i + 1] !== undefined) {
        configFile = process.argv[i + 1];
        configFileExists(configFile);
        loadedConfig = yaml.safeLoad(fs.readFileSync(configFile, 'utf-8'));
      }
    }
    loadedConfig = checkDefaultConfig(loadedConfig, configFile);
    data = merge.recursive(true, data, loadedConfig);

    data.paths.css = pathClean(data.paths.css);
    data.paths.fonts = pathClean(data.paths.fonts);
    data.paths.images = pathClean(data.paths.images);
    data.paths.js = pathClean(data.paths.js);
    data.paths.server = pathClean(data.paths.server);

    message.setVerbosity(data.config.verbose);
  };

  var ifProp = function(propName) {
    return typeof data[propName] !== 'undefined' ? true : false;
  };

  return {
    file: function() {
      return configFile;
    },
    get: function(propName){
      if (!ifProp(propName)) {
        message.error('Required property ' + colour.yellow(propName) + ' NOT found in ' + colour.yellow(configFile));
      }
      return data[propName];
    },
    hasTask: function(taskName) {
      if (!ifProp('tasks')) {
        message.error('Required property ' + colour.yellow('tasks') + ' NOT found in ' + colour.yellow(configFile));
      }
      for (var i = 0; i < data.tasks.length; i += 1) {
        if (data.tasks[i] === taskName) {
          return true;
        }
      }
      return false;
    },
    if: function(propName){
      return ifProp(propName);
    },
    load: function(){
      checkArguments();
    },
    pathClean : function(configPath) {
      return path.normalize(configPath).replace(/\/$/, '') + '/';
    }
  };
})();

var task = task || {};

task.core = (function(){

  var fs = require('fs');

  return {
    action: function(name, actionName) {
      return name + ':' + actionName;
    },
    fileCheck: function(path){
      try {
        path = path.replace(new RegExp(/\*.*$/), '');
        fs.accessSync(path, fs.F_OK);
        return true;
      } catch (e) {
        message.error(path + ' NOT found');
        console.log(e);
        process.exit();
      }
    },
    fileExists: function(path) {
      try {
        path = path.replace(new RegExp(/\*.*$/), '');
        fs.accessSync(path, fs.F_OK);
        return true;
      } catch (e) {
        return false;
      }
    },
    has: function(task, property) {
      return property in task ? true : false;
    }
  };
})();

var tasks = (function(){

  var browserSync = require('browser-sync');
  var path = require('path');

  var paths;
  var pipeline = {
    before:[],
    middle:[],
    after:[]
  };
  var cssConfig = {};
  var tasksConfig = {};
  var watchFolders = [];

  var getWatchFolder = function(property) {
    if (config.if(property)) {
      var configProperty = config.get(property);
      if (task.core.has(configProperty, 'watch')) {
        return [configProperty.watch];
      }
    }
    return [];
  };

  var init = function() {
    paths = config.if('paths') ? config.get('paths') : false;
    tasksConfig = config.if('config') ? config.get('config') : false;
    cssConfig = config.if('css') ? config.get('css') : false;

    watchFolders = watchFolders.concat(getWatchFolder('css'));
    watchFolders = watchFolders.concat(getWatchFolder('js'));
    watchFolders = watchFolders.concat(getWatchFolder('twig'));
  };

  var addToPipeline = function(subTaskPipeline) {
    pipeline.before = pipeline.before.concat(subTaskPipeline.before);
    pipeline.middle = pipeline.middle.concat(subTaskPipeline.middle);
    pipeline.after = pipeline.after.concat(subTaskPipeline.after.reverse());
  };

  var http = function(tasks) {

    gulp.task('http', gulp.series(tasks, function() {
      browserSync.stream();
      browserSync.init({
        server: {
            baseDir: paths.server
        },
        logLevel: 'info',
        notify: true
      });

      message.wait();

      return gulp.watch(watchFolders, gulp.series(tasks, function(done){
          browserSync.reload();
          message.wait();
          done();
        }))
        .on('change', function(path) {
          message.event('change', path);
        })
        .on('unlink', function(path) {
          message.event('unlink', path);
        })
        .on('add', function(path) {
          message.event('add', path);
        });
    }));
  };

  var watch = function(tasks) {
    gulp.task('watch', gulp.series(tasks, function() {
      message.wait();
      return gulp.watch(watchFolders, gulp.series(tasks, function(done){
          message.wait();
          done();
        }))
        .on('change', function(path) {
          message.event('change', path);
        })
        .on('unlink', function(path) {
          message.event('unlink', path);
        })
        .on('add', function(path) {
          message.event('add', path);
        });
    }));
  };

  var verify = function() {
    var pipeline = {
      before: [],
      middle: [],
      after: []
    };
    if (tasksConfig.verify) {
      var taskName = 'verify';
      gulp.task(taskName, function(done){
        var files = task.css.verify();
        files = files.concat(task.js.verify());
        files = files.concat(task.html.verify());
        message.task('Verifying if all files were successfully created');
        for (var i = 0; i < files.length; i += 1) {
          message.verbose('File to check', files[i]);
          task.core.fileCheck(files[i]);
        }
        done();
      });
      pipeline.middle.push(taskName);
    }
    return pipeline;
  };

  var build = function(tasks){
    gulp.task('default', gulp.series(tasks, function(done){
      done();
    }));
  };

  return {
    init: function(){
      init();
      addToPipeline(task.timer.get());
      addToPipeline(task.shell.get());
      addToPipeline(task.css.get());
      addToPipeline(task.js.get());
      addToPipeline(task.vendors.get());
      addToPipeline(task.html.get());
      addToPipeline(verify());
      pipeline.after.reverse();
      var pipelineList = pipeline.before.concat(pipeline.middle.concat(pipeline.after));
      build(pipelineList);
      watch(pipelineList);
      http(pipelineList);
    }
  };
})();

var task = task || {};

task.timer = (function(){
  var moment = require('moment');

  var name = 'timer';
  var startBuildDate;
  var buildIndex = 1;

  var pipeline = {
    before:[],
    middle:[],
    after:[]
  };

  var start = function(){
    var taskName = task.core.action(name, 'start');
    gulp.task(taskName, function(done){
      startBuildDate = Date.now();
      done();
    });
    pipeline.before.push(taskName);
  };

  var stop = function(){
    var taskName = task.core.action(name, 'stop');
    gulp.task(taskName, function(done){
      var stopBuildDate = Date.now();
      var timeSpent = (stopBuildDate - startBuildDate)/1000 + ' secs';
      message.success('The dust was cleaned successfully in ' + timeSpent);
      message.success('Build [ ' + buildIndex + ' ] done at ' + moment().format('HH:mm') + ' and ' + moment().format('ss') + ' seconds.');
      buildIndex += 1;
      done();
    });
    pipeline.after.push(taskName);
  };

  return {
    duration: function(){

    },
    get: function(){
      start();
      stop();
      return pipeline;
    }
  };
})();

var task = task || {};

task.vendors = (function(){

  var name = 'vendors';
  var paths = {};
  var vendorsConfig = {};
  var vendorsFontsBuilt = false;
  var vendorsImagesBuilt = false;

  var pipeline = {
    before:[],
    middle:[],
    after:[]
  };

  var init = function() {
    paths = config.get('paths');
    vendorsConfig = config.if('vendors') ? config.get('vendors') : {};
  };

  var images = function() {
    if (task.core.has(vendorsConfig, 'images')) {
      var taskName = task.core.action(name, 'images');
      gulp.task(taskName, function (done) {
        if (vendorsImagesBuilt) {
          message.notice('Skipping vendors images build to improve speed, if you need to update them just re-run the task');
          done();
        } else {
          vendorsImagesBuilt = true;
            message.task('Copying images from vendors');
            for (var i = 0; i < vendorsConfig.images.length; i += 1) {
              message.verbose('Image vendor', vendorsConfig.images[i]);
              task.core.fileCheck(vendorsConfig.images[i]);
            }
            message.verbose('Vendor images copied to', paths.images);
            return gulp.src(vendorsConfig.images)
            .pipe(gulp.dest(paths.images));
        }
      });
      return [taskName];
    } else {
      message.warning('Vendor\'s Images not found, skipping task');
    }
    return [];
  };

  var fonts = function(){
    if (task.core.has(vendorsConfig, 'fonts')) {
      var taskName = task.core.action(name, 'fonts');
      gulp.task(taskName, function (done) {
        if (vendorsFontsBuilt) {
          message.notice('Skipping vendors fonts build to improve speed, if you need to update them just re-run the task');
          done();
        } else {
          vendorsFontsBuilt = true;
            message.task('Copying fonts from vendors');
            var i = 0;
            for (i = 0; i < vendorsConfig.fonts.length; i += 1) {
              message.verbose('Font vendor', vendorsConfig.fonts[i]);
              task.core.fileCheck(vendorsConfig.fonts[i]);
            }
            message.verbose('Vendor fonts copied to', paths.fonts);
            return gulp.src(vendorsConfig.fonts)
              .pipe(gulp.dest(paths.fonts));
        }
      });
      return [taskName];
    } else {
      message.warning('Vendor\'s Fonts not found, skipping task');
    }
    return [];
  };

  return {
    get: function(){
      if (!config.if('vendors')) {
        return pipeline;
      }
      init();
      pipeline.middle = pipeline.middle.concat(fonts());
      pipeline.middle = pipeline.middle.concat(images());
      return pipeline;
    }
  };
})();

var task = task || {};

task.shell = (function(){
  var exec = require('child_process').exec;
  var name = 'shell';
  var taskConfig = [];
  var pipeline = {
    before: [],
    middle:[],
    after: []
  };

  var init = function() {
    taskConfig = config.if('shell') ? config.get('shell') : [];
  };

  var afterMessage = function(){
    if (task.core.has(taskConfig, 'after')) {
      var taskName = task.core.action(name, 'after-message');
      gulp.task(taskName, function(done){
        message.task('Executing shell tasks after build');
        done();
      });
      pipeline.after.push(taskName);
    }
  };

  var afterTask = function(index) {
    var taskName = task.core.action(name, 'after-' + index);
    pipeline.after.push(taskName);
    gulp.task(taskName, function(done){
      message.verbose('Shell', taskConfig.after[index]);
      exec(taskConfig.after[index], function (err) {
        done(err);
      });
    });
  };

  var after = function(){
    if (task.core.has(taskConfig, 'after')) {
      afterMessage();
      for (var i = 0; i < taskConfig.after.length; i += 1) {
        afterTask(i);
      }
    }
  };

  var beforeMessage = function(){
    if (task.core.has(taskConfig, 'before')) {
      var taskName = task.core.action(name, 'before-message');
      gulp.task(taskName, function(done){
        message.task('Executing shell tasks before build');
        done();
      });
      pipeline.before.push(taskName);
    }
  };

  var beforeTask = function(index) {
    var taskName = task.core.action(name, 'before-' + index);
    pipeline.before.push(taskName);
    gulp.task(taskName, function(done){
      message.verbose('Shell', taskConfig.before[index]);
      exec(taskConfig.before[index], function (err) {
        done(err);
      });
    });
  };

  var before = function(){
    if (task.core.has(taskConfig, 'before')) {
      beforeMessage();
      for (var i = 0; i < taskConfig.before.length; i += 1) {
        beforeTask(i);
      }
    }
  };

  return {
    get: function(){
      if (!config.if('shell')) {
        return pipeline;
      }
      init();
      before();
      after();
      return pipeline;
    }
  };
})();

var task = task || {};

task.html = (function(){

  var faker = require('faker');
  var path = require('path');
  var prettify = require('gulp-html-prettify');
  var twig = require('gulp-twig');

  var name = 'html';
  var paths = {};
  var twigConfig = {};
  var twigPages;

  var pipeline = {
    before:[],
    middle:[],
    after:[]
  };

  var init = function() {
    paths = config.get('paths');
    twigPages = config.if('twig') ? config.get('twig') : {};
    twigConfig = config.if('config') ? config.get('config') : {};
    faker.locale = 'en';
  };

  var build = function() {
    if (config.if('twig') && task.core.has(twigPages, 'files')) {
      gulp.task(name, function () {
        message.task('Twig to HTML');
        if (!task.core.has(twigConfig, 'twig')) {
          twigConfig.twig = {};
        }
        twigConfig.twig.data = {
          faker: faker
        };
        for (var i = 0; i < twigPages.files.length; i += 1) {
          message.verbose('Twig view', twigPages.files[i]);
          task.core.fileCheck(twigPages.files[i]);
        }
        message.verbose('All Twig files converted in', paths.server);
        return gulp.src(twigPages.files)
          .pipe(twig(twigConfig.twig))
          .pipe(prettify(twigConfig.prettify || {}))
          .pipe(gulp.dest(paths.server));
      });
      return [name];
    } else {
      message.warning('Twig files not set, skipping task');
    }
    return [];
  };

  var getFilesToVerifyHTML = function() {
    var htmlConfig, files;
    files = [];
    if (config.if('twig')) {
      htmlConfig = config.get('twig');
      for (var i = 0; i < htmlConfig.files.length; i += 1) {
        files.push(paths.server + path.parse(htmlConfig.files[i]).name  + '.html');
      }
    }
    return files;
  };

  return {
    get: function(){
      if (!config.hasTask(name)) {
        return pipeline;
      }
      init();
      pipeline.middle = pipeline.middle.concat(build());
      return pipeline;
    },
    verify: function() {
      return getFilesToVerifyHTML();
    }
  };
})();

var task = task || {};

task.css = (function(){
  var autoprefixer = require('gulp-autoprefixer');
  var concat = require('gulp-concat');
  var less = require('gulp-less');
  var merge = require('merge');
  var rename = require('gulp-rename');
  var sass = require('gulp-sass');
  var stylestats = require('gulp-stylestats');
  var sourcemaps = require('gulp-sourcemaps');
  var uglifyCss = require('gulp-uglifycss');

  var name = 'css';
  var paths = {};
  var cssConfig = {};
  var tasksConfig = {};
  var themeTasks = [];
  var themeBuilds = [];
  var vendorsBuilt = false;
  var vendorsConfig = {};
  var pipeline = {
    before: [],
    middle: [],
    after: []
  };

  var checkConfig = function(config, prop, defaults) {
    return task.core.has(config, prop) ? config[prop] : defaults;
  };

  var init = function() {
    pipeline.middle.push(name);
    paths = config.get('paths');
    cssConfig = config.if('css') ? config.get('css') : {};
    themeTasks = checkConfig(cssConfig, 'themes', []);
    tasksConfig = config.if('config') ? config.get('config') : {};
    vendorsConfig = checkConfig(cssConfig, 'vendors', {});
    vendorsConfig = merge.recursive(true, { path: paths.css, merge: true }, vendorsConfig);
    if (!task.core.has(vendorsConfig, 'path')) {
      vendorsConfig.path = paths.css;
    }
  };

  var fonts = function(theme) {
    if (theme.fonts) {
      if (!task.core.fileExists(theme.fonts)) {
        message.verbose('Checking ' + theme.name + ' fonts', theme.fonts);
        task.core.fileCheck(theme.fonts);
      }
      var taskName = task.core.action(name, theme.name + '-fonts');
      var target = paths.fonts + theme.name;
      gulp.task(taskName, function () {
        message.verbose('Copy theme fonts to', target);
        return gulp.src(theme.fonts)
          .pipe(gulp.dest(target));
      });
      return [taskName];
    }
    return [];
  };

  var images = function(theme) {
    if (theme.images) {
      if (!task.core.fileExists(theme.images)) {
        message.verbose('Checking ' + theme.name + ' images', theme.images);
        task.core.fileCheck(theme.images);
      }
      var taskName = task.core.action(name, theme.name + '-images');
      var target = paths.images + theme.name;
      gulp.task(taskName, function () {
        message.verbose('Copy theme images to', target);
        return gulp.src(theme.images)
          .pipe(gulp.dest(target));
      });
      return [taskName];
    }
    return [];
  };

  var css = function(theme, index, totalThemes) {
    var taskName = task.core.action(name, theme.name + '-css');
    gulp.task(taskName, function () {
      if (totalThemes >= 1) {
        message.task('Build CSS theme ' + (index + 1) + ' of ' + totalThemes);
      } else {
        message.task('Build CSS theme');
      }
      message.verbose('Theme', theme.name);
      message.verbose('File', theme.path + theme.file);
      return gulp.src(theme.compile)
        .pipe(sourcemaps.init())
        .pipe(
          theme.compile.indexOf('.scss') !== -1 ?
            sass({ outputStyle: 'expanded' }).on('error', function(err){
              console.log(err.formatted);
              message.error('Checkout SASS error before this message');
            })
          :
            less()
          )
        .pipe(concat(theme.file))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(theme.path));
    });
    return [taskName];
  };

  var autoprefixerRename = function(file) {
    return file.replace('.css', '.autoprefixer.css');
  };

  var getAutoprefixer = function(theme) {
    if (theme.autoprefixer) {
      var taskName = task.core.action(name, theme.name + '-autoprefixer');
      gulp.task(taskName, function () {
        var fileName = autoprefixerRename(theme.file);
        message.task('Browser compatibility');
        message.verbose('Theme', theme.name);
        if (task.core.has(tasksConfig.autoprefixer, 'browsers')) {
          message.verbose('Autoprefixer browsers', tasksConfig.autoprefixer.browsers.toString().replace(new RegExp(',', 'g'), ', '));
        } else {
          message.verbose('Autoprefixer', 'Enabled');
        }
        message.verbose('Adding prefixes to file', theme.path + theme.file);
        message.verbose('Browser prefixes saved to', theme.path + fileName);
        return gulp.src(theme.path + theme.file)
          .pipe(
            autoprefixer(theme.autoprefixer instanceof Object ?
              theme.autoprefixer
              :
              tasksConfig.autoprefixer
            )
          )
          .pipe(rename(fileName))
          .pipe(gulp.dest(theme.path));
      });
      return [taskName];
    }
    return [];
  };

  var getStylestats = function(theme) {
    if (theme.stylestats) {
      var taskName = task.core.action(name, theme.name + '-stylestats');
      var fileName = autoprefixerRename(theme.file);

      gulp.task(taskName, function () {
        return gulp.src(theme.autoprefixer !== false ?
            theme.path + fileName
            :
            theme.path + theme.file
          )
          .pipe(stylestats({
            type: 'md',
            config: theme.stylestats instanceof Object ? theme.stylestats : tasksConfig.stylestats
          }));
      });
      return [taskName];
    }
    return [];
  };

  var themeBuild = function(theme, themePipeline) {
    var taskName = task.core.action(name, theme.name + '-build');
    gulp.task(taskName, gulp.series(themePipeline, function(done){
      done();
    }));
    return [taskName];
  };

  var add = function(theme, index, totalThemes) {
    var themePipeline = [];
    var defaults = {
      autoprefixer: false,
      compile: null,
      csslint: false,
      file: 'theme-' + index.toString() + '.css',
      fonts: false,
      images: false,
      merge: true,
      name: 'theme-' + index.toString(),
      path: paths.css,
      stylestats: false
    };

    themeTasks[index] = merge.recursive(true, defaults, theme);

    if (!themeTasks[index].path) {
      themeTasks[index].path = paths.css;
    }

    themeTasks[index].path = config.pathClean(themeTasks[index].path);

    if (themeTasks[index].compile === null) {
      message.error(themeTasks[index].name + ' "compile" attribute must be specified');
    }

    theme = themeTasks[index];

    themePipeline = themePipeline.concat(css(theme, index, totalThemes));
    themePipeline = themePipeline.concat(getAutoprefixer(theme));
    themePipeline = themePipeline.concat(fonts(theme));
    themePipeline = themePipeline.concat(images(theme));
    themePipeline = themePipeline.concat(getStylestats(theme));
    themeBuilds = themeBuilds.concat(themeBuild(theme, themePipeline));
  };

  var themes = function() {
    for (var i = 0; i < themeTasks.length; i += 1) {
      add(themeTasks[i], i, themeTasks.length);
    }
    return themeBuilds;
  };

  var vendors = function() {
    if (task.core.has(vendorsConfig, 'files')) {
      var taskName = task.core.action(name, 'vendors');
      gulp.task(taskName, function (done) {
        if (task.core.fileExists(vendorsConfig.path + vendorsConfig.file) && vendorsBuilt) {
          message.notice('Skipping vendors CSS build to improve speed, if you need to update them just re-run the task');
          done();
        } else {
          vendorsBuilt = true;
          message.task('Merging CSS vendors');
          for (var i = 0; i < vendorsConfig.files.length; i += 1) {
            message.verbose('CSS vendor', vendorsConfig.files[i]);
            task.core.fileCheck(vendorsConfig.files[i]);
          }
          message.verbose('CSS vendor files merged to', vendorsConfig.path + vendorsConfig.file);
          return gulp.src(vendorsConfig.files)
          .pipe(uglifyCss())
          .pipe(concat(vendorsConfig.file))
          .pipe(gulp.dest(vendorsConfig.path));
        }
      });
      return [taskName];
    }
    return [];
  };

  var needsMerge = function() {
    var theme;
    for (var i = 0; i < themeTasks.length; i += 1) {
      theme = merge.recursive(true, themeTasks[i], { merge: true });
      if (theme.merge === true) {
        return true;
      }
    }
    return false;
  };

  var getVendorsToMerge = function() {
    if (vendorsConfig.merge) {
      message.verbose('CSS vendors to merge', vendorsConfig.path + vendorsConfig.file);
      return [vendorsConfig.path + vendorsConfig.file];
    }
    message.verbose('CSS vendors skipped from merge', vendorsConfig.path + vendorsConfig.file);
    return [];
  };

  var getThemesToMerge = function() {
    var fileName, theme, themes = [];
    for (var i = 0; i < themeTasks.length; i += 1) {
      theme = themeTasks[i];
      fileName = theme.autoprefixer ? autoprefixerRename(theme.file) : theme.file;
      if (theme.merge) {
        message.verbose('CSS theme to merge', theme.path + fileName);
        themes.push(theme.path + fileName);
      } else {
        message.verbose('CSS theme skipped from merge', theme.path + fileName);
      }
    }
    return themes;
  };

  var mergeCss = function() {
    if (needsMerge()) {
      var taskName = task.core.action(name, 'merge');
      gulp.task(taskName, function(done){
        var themes = [];
        message.task('Merging CSS vendors with your CSS files');

        themes = themes.concat(getVendorsToMerge());
        themes = themes.concat(getThemesToMerge());

        if (themes.length > 0) {
          message.verbose('All CSS files merged to', paths.css + cssConfig.file);
          return gulp.src(themes)
            .pipe(uglifyCss())
            .pipe(concat(cssConfig.file))
            .pipe(gulp.dest(paths.css));
        } else {
          message.warning('No vendors or themes will be merged');
          done();
        }
      });
      return [taskName];
    }
    return [];
  };

  var build = function(subTaskPipeline) {
    gulp.task(name, gulp.series(subTaskPipeline, function(done){
      done();
    }));
    return [name];
  };

  var getFilesToVerifyCSSVendors = function() {
    var files = [];
    if (task.core.has(cssConfig, 'vendors')) {
      files.push(cssConfig.vendors.path + cssConfig.vendors.file);
    }
    return files;
  };

  var getFilesToVerifyCSS = function() {
    var files, theme;
    files = [];

    if (task.core.has(cssConfig, 'themes')) {
      for (var i = 0; i < cssConfig.themes.length; i += 1) {
        theme = cssConfig.themes[i];
        files.push(theme.path + theme.file);
        if (theme.autoprefixer) {
          files.push(theme.path + theme.file.replace('.css', '.autoprefixer.css'));
        }
      }
    }

    files.concat(getFilesToVerifyCSSVendors());
    files.push(paths.css + cssConfig.file);

    return files;
  };

  return {
    get: function(){
      if (!config.hasTask(name)) {
        return pipeline;
      }
      init();
      var subTaskPipeline = [];
      subTaskPipeline = subTaskPipeline.concat(themes());
      subTaskPipeline = subTaskPipeline.concat(vendors());
      subTaskPipeline = subTaskPipeline.concat(mergeCss());
      pipeline.middle.concat(build(subTaskPipeline));
      return pipeline;
    },
    verify: function() {
      return getFilesToVerifyCSS();
    }
  };
})();

var task = task || {};

task.js = (function(){

  var concat = require('gulp-concat');
  var merge = require('merge');
  var sourcemaps = require('gulp-sourcemaps');
  var uglify = require('gulp-uglify');

  var name = 'js';
  var jsConfig = {};
  var paths = {};
  var vendorsConfig = {};
  var vendorsBuilt = false;

  var pipeline = {
    before:[],
    middle:[],
    after:[]
  };

  var checkConfig = function(config, prop, defaults) {
    return task.core.has(config, prop) ? config[prop] : defaults;
  };

  var init = function() {
    jsConfig = config.if(name) ? config.get(name) : [];
    paths = config.get('paths');
    vendorsConfig = checkConfig(jsConfig, 'vendors', {});
    vendorsConfig = merge.recursive(true, { path: paths.js, merge: true }, vendorsConfig);
    if (!task.core.has(vendorsConfig, 'path')) {
      vendorsConfig.path = paths.js;
    }
  };

  var vendors = function() {
    if (task.core.has(vendorsConfig, 'files')) {
      var taskName = task.core.action(name, 'vendors');
      gulp.task(taskName, function (done) {
        if (task.core.fileExists(vendorsConfig.path + vendorsConfig.file) && vendorsBuilt) {
          message.notice('Skipping vendors JavaScript build to improve speed, if you need to update them just re-run the task');
          done();
        } else {
          vendorsBuilt = true;
          message.task('Merging JavaScript vendors');
          for (var i = 0; i < vendorsConfig.files.length; i += 1) {
            message.verbose('JavaScript vendor', vendorsConfig.files[i]);
            task.core.fileCheck(vendorsConfig.files[i]);
          }
          message.verbose('Vendors JavaScript files merged to', vendorsConfig.path + vendorsConfig.file);
          return gulp.src(vendorsConfig.files)
          .pipe(uglify())
          .pipe(concat(vendorsConfig.file))
          .pipe(gulp.dest(vendorsConfig.path));
        }
      });
      return [taskName];
    }
    return [];
  };

  var mergeJs = function() {
    if (vendorsConfig.merge) {
      var taskName = task.core.action(name, 'merge');
      gulp.task(taskName, function(done){
        var files = [];
        message.task('Merging JavaScript vendors with your JavaScript files');

        files.push(vendorsConfig.path + vendorsConfig.file);
        files.push(paths.js + jsConfig.file.replace('.min.js', '.no-vendors.min.js'));

        for (var i = 0; i < files.length; i += 1) {
          message.verbose('JavaScript file', files[i]);
          task.core.fileCheck(files[i]);
        }

        if (files.length > 0) {
          message.verbose('All JavaScript files merged to', paths.js + jsConfig.file);
          return gulp.src(files)
            .pipe(uglify())
            .pipe(concat(jsConfig.file))
            .pipe(gulp.dest(paths.js));
        } else {
          message.warning('No vendors or files will be merged');
          done();
        }
      });
      return [taskName];
    }
    return [];
  };

  var build = function(){
    if (config.if(name)) {
      gulp.task(name, function () {
        message.task('Merging JavaScript files');
        for (var i = 0; i < jsConfig.files.length; i += 1) {
          message.verbose('JavaScript file', jsConfig.files[i]);
          task.core.fileCheck(jsConfig.files[i]);
        }
        var file = jsConfig.file;
        if (vendorsConfig.merge) {
          file = file.replace('.min.js', '.no-vendors.min.js');
        }
        message.verbose('JavaScript files merged to', paths.js + file);

        return gulp.src(jsConfig.files)
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(concat(file))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.js));
      });
      return [name];
    }
    return [];
  };

  var getFilesToVerifyJSVendors = function() {
    if (task.core.has(vendorsConfig, 'vendors')) {
      return [vendorsConfig.vendors.path + vendorsConfig.vendors.file];
    }
    return [];
  };

  var getFilesToVerifyJS = function() {
    var files = [];
    files = getFilesToVerifyJSVendors();
    files.push(paths.js + jsConfig.file);

    return files;
  };

  return {
    get: function(){
      if (!config.hasTask(name)) {
        return pipeline;
      }
      init();
      pipeline.middle = pipeline.middle.concat(vendors());
      pipeline.middle = pipeline.middle.concat(build());
      pipeline.middle = pipeline.middle.concat(mergeJs());
      return pipeline;
    },
    verify: function() {
      return getFilesToVerifyJS();
    }
  };
})();


message.intro();
config.load();
message.verbose('Version', '1.2.18');
message.verbose('Config loaded', config.file());
tasks.init();
