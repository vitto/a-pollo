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
    gulp.src(f.path.frontsize + compileFile)
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(concat(cssFileName))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(f.path.css));
});

gulp.task('frontsize:sourcemap', function () {
    gulp.src(f.path.frontsize + compileFile)
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
        .pipe(concat(cssTestFileName))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(f.frontsize.test));
});

gulp.task('frontsize:test', function () {
    var tasks = [
        'frontsize:test:build',
        'frontsize:test:report'
    ];
    runSequence(tasks);
});

gulp.task('frontsize:test:build', function () {
    gulp.src('test/frontsize/test.scss')
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(concat('frontsize.test.css'))
        .pipe(gulp.dest(f.frontsize.test));
});

gulp.task('frontsize:test:report', function () {
    gulp.src(f.frontsize.test + 'frontsize.test.css')
        .pipe(csslint('test/.csslintrc'))
        .pipe(stylestats());
});

gulp.task('frontsize:report', function () {
    gulp.src(f.frontsize.test + cssTestFileName)
        .pipe(csslint('.csslintrc'))
        .pipe(stylestats());
});

gulp.task('frontsize:assets', function () {
    gulp.src(f.path.frontsize + 'themes/' + f.frontsize.theme + '/img/**/*.*')
        .pipe(gulp.dest(f.path.images));
    gulp.src(f.path.frontsize + 'themes/' + f.frontsize.theme + '/fonts/**/*.*')
        .pipe(gulp.dest(f.path.fonts));
});

gulp.task('frontsize:build', function () {
    var tasks = [
        'frontsize:assets',
        'frontsize:vendors',
        'frontsize:js',
        'frontsize:css',
        'frontsize:merge',
        'frontsize:sourcemap',
        'frontsize:report'
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
    gulp.watch(watchList, tasks);
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
    }
});

gulp.task('frontsize:vendors:fonts', function () {
    if (f.vendors !== undefined && f.vendors.fonts !== undefined) {
        gulp.src(f.vendors.fonts)
            .pipe(gulp.dest(f.path.fonts));
    }
});

gulp.task('frontsize:vendors:images', function () {
    if (f.vendors !== undefined && f.vendors.images !== undefined) {
        gulp.src(f.vendors.images)
            .pipe(gulp.dest(f.path.images));
    }
});

gulp.task('frontsize:js', function () {
    if (f.js !== undefined && f.js.files !== undefined) {
        return gulp.src(f.js.files)
        .pipe(uglify())
        .pipe(concat(f.js.name || jsFileName))
        .pipe(gulp.dest(f.path.js));
    }
});

gulp.task('frontsize:merge', function () {
    if (f.vendors !== undefined && f.vendors.css !== undefined) {
        var css = f.vendors.css.slice(0);
        css.push(f.frontsize.test + cssTestFileName);
        return gulp.src(css)
        .pipe(uglifyCss())
        .pipe(concat(cssMergeFileName))
        .pipe(gulp.dest(f.path.css));
    }
});
