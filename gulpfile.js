var gulp        = require('gulp'),
    fs          = require('fs'),
    yaml        = require('js-yaml'),
    sass        = require('gulp-sass'),
    concat      = require('gulp-concat'),
    uglify      = require('gulp-uglify'),
    csslint     = require('gulp-csslint'),
    runSequence = require('run-sequence'),
    stylestats  = require('gulp-stylestats'),
    sourcemaps  = require('gulp-sourcemaps'),
    uglifyCss   = require('gulp-uglifycss');

var f, compileFile, cssFileName, cssTestFileName, cssVendorsFileName, cssMergeFileName, jsFileName;

f = yaml.safeLoad(fs.readFileSync('./frontsize.yml', 'utf-8'));
compileFile        = 'compile.scss';
cssFileName        = 'frontsize-theme.min.css';
cssTestFileName    = 'frontsize.csslint.css';
cssVendorsFileName = 'vendors.min.css';
jsFileName         = 'frontsize.min.js';
cssMergeFileName   = 'frontsize.min.css';

gulp.task('default', function () {
    var tasks = [
        'frontsize:watch'
    ];
    runSequence(tasks);
});

gulp.task('frontsize:css', function () {
    return gulp.src(f.path.frontsize + compileFile)
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(concat(cssFileName))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(f.path.css));
});

gulp.task('frontsize:sourcemap', function () {
    return gulp.src(f.path.frontsize + compileFile)
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
        .pipe(concat(cssTestFileName))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(f.path.test));
});

gulp.task('frontsize:test', function () {
    var tasks = [
        'frontsize:test:build',
        'frontsize:test:report'
    ];
    runSequence(tasks);
});

gulp.task('frontsize:test:build', function () {
    return gulp.src('example_source/frontsize/test.scss')
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(concat('frontsize.test.css'))
        .pipe(gulp.dest(f.path.test));
});

gulp.task('frontsize:test:report', ['frontsize:test:build'], function () {
    return gulp.src(f.path.test + 'frontsize.test.css')
        .pipe(csslint('example_source/.csslintrc'))
        .pipe(stylestats());
});

gulp.task('frontsize:report', ['frontsize:sourcemap'], function () {
    return gulp.src(f.path.test + cssTestFileName)
        .pipe(csslint('.csslintrc'))
        .pipe(stylestats());
});

gulp.task('frontsize:assets:images', function () {
    return gulp.src(f.path.frontsize + 'themes/' + f.theme + '/img/**/*.*')
        .pipe(gulp.dest(f.path.images));
});

gulp.task('frontsize:assets:fonts', function () {
    return gulp.src(f.path.frontsize + 'themes/' + f.theme + '/fonts/**/*.*')
        .pipe(gulp.dest(f.path.fonts));
});

gulp.task('frontsize:build', function () {
    var tasks = [
        'frontsize:css',
        'frontsize:assets:images',
        'frontsize:assets:fonts',
        'frontsize:vendors',
        'frontsize:js',
        'frontsize:merge',
        'frontsize:sourcemap',
        //'frontsize:report'
    ];
    runSequence(tasks);
});

gulp.task('frontsize:watch', function () {
    var tasks = [
        'frontsize:build'
    ];
    runSequence(tasks);
    var watchList = [
        f.path.frontsize + 'themes/**/*.scss',
        f.path.frontsize + 'themes/**/img/**/*',
        f.path.frontsize + 'themes/**/fonts/**/*'
    ];
    if (f.js !== undefined && f.js.watch !== undefined) {
        watchList.push(f.js.watch);
    }
    return gulp.watch(watchList, tasks);
});

gulp.task('frontsize:vendors', function(){
    var tasks = [
        'frontsize:vendors:css',
        'frontsize:vendors:fonts',
        'frontsize:vendors:images'
    ];
    runSequence(tasks);
});

gulp.task('frontsize:vendors:css', function () {
    if (f.vendors !== undefined && f.vendors.css !== undefined) {
        return gulp.src(f.vendors.css)
            .pipe(uglifyCss())
            .pipe(concat(cssVendorsFileName))
            .pipe(gulp.dest(f.path.css));
    } else {
        return gulp;
    }
});

gulp.task('frontsize:vendors:fonts', function () {
    if (f.vendors !== undefined && f.vendors.fonts !== undefined) {
        return gulp.src(f.vendors.fonts)
            .pipe(gulp.dest(f.path.fonts));
    } else {
        return gulp;
    }
});

gulp.task('frontsize:vendors:images', function () {
    if (f.vendors !== undefined && f.vendors.images !== undefined) {
        return gulp.src(f.vendors.images)
            .pipe(gulp.dest(f.path.images));
    } else {
        return gulp;
    }
});

gulp.task('frontsize:js', function () {
    if (f.js !== undefined && f.js.files !== undefined) {
        return gulp.src(f.js.files)
            .pipe(sourcemaps.init())
            .pipe(uglify())
            .pipe(concat(f.js.name || jsFileName))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(f.path.js));
    } else {
        return gulp;
    }
});

gulp.task('frontsize:merge', ['frontsize:vendors:css', 'frontsize:css'], function () {
    if (f.vendors !== undefined && f.vendors.css !== undefined) {
        var css = f.vendors.css.slice(0);
        css.push(f.path.test + cssTestFileName);
        return gulp.src(css)
            .pipe(uglifyCss())
            .pipe(concat(cssMergeFileName))
            .pipe(gulp.dest(f.path.css));
    } else {
        return gulp;
    }
});
