var gulp        = require('gulp'),
    fs          = require('fs'),
    yaml        = require('js-yaml'),
    sass        = require('gulp-sass'),
    concat      = require('gulp-concat'),
    csslint     = require('gulp-csslint'),
    runSequence = require('run-sequence'),
    stylestats  = require('gulp-stylestats'),
    sourcemaps  = require('gulp-sourcemaps'),
    uglifyCss   = require('gulp-uglifycss');

var f, compileFile, cssFileName, cssTestFileName, cssVendorsFileName, cssMergeFileName;

f = yaml.safeLoad(fs.readFileSync('./frontsize.yml', 'utf-8'));
compileFile        = 'compile.scss';
cssFileName        = 'frontsize-theme.min.css';
cssTestFileName    = 'frontsize.csslint.css';
cssVendorsFileName = 'vendors.min.css';
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
    gulp.src(f.frontsize.test + cssTestFileName)
        .pipe(csslint('.csslintrc'))
        .pipe(csslint.reporter());
});

gulp.task('frontsize:report', function () {
    gulp.src(f.frontsize.test + cssTestFileName)
        .pipe(csslint('.csslintrc'))
        .pipe(stylestats());
});

gulp.task('frontsize:theme:assets', function () {
    gulp.src(f.path.frontsize + 'themes/' + f.frontsize.theme + '/img/**/*.*')
        .pipe(gulp.dest(f.path.images));
    gulp.src(f.path.frontsize + 'themes/' + f.frontsize.theme + '/fonts/**/*.*')
        .pipe(gulp.dest(f.path.fonts));
});

gulp.task('frontsize:build', function () {
    var tasks = [
        'frontsize:vendors',
        'frontsize:css',
        'frontsize:merge',
        'frontsize:sourcemap',
        'frontsize:report',
        'frontsize:test'
    ];
    runSequence(tasks);
});

gulp.task('frontsize:watch', function () {
    var tasks = [
        'frontsize:build'
    ];
    runSequence(tasks);
    gulp.watch(f.path.frontsize + 'themes/**/*.scss', tasks);
});

gulp.task('frontsize:watch:assets', function(){
    var tasks = [
        'frontsize:build',
        'frontsize:theme:assets'
    ];
    runSequence(tasks);
    gulp.watch([
        f.path.frontsize + 'themes/**/*.scss',
        f.path.frontsize + 'themes/**/img/**/*',
        f.path.frontsize + 'themes/**/fonts/**/*'
    ], tasks);
});

gulp.task('frontsize:vendors', function(){
    var tasks = [
        'frontsize:vendors:css',
        'frontsize:vendors:fonts',
        'frontsize:vendors:images'
    ];
    runSequence(tasks);
});

gulp.task('frontsize:watch:vendors', function(){
    var tasks = [
        'frontsize:vendors'
    ];
    runSequence(tasks);
    gulp.watch([
        f.path.frontsize + 'themes/**/*.scss',
        f.path.frontsize + 'themes/**/img/**/*',
        f.path.frontsize + 'themes/**/fonts/**/*'
    ], tasks);
});

gulp.task('frontsize:vendors:css', function () {
    if (!f.vendors) {
        if (!f.vendors.css) {
            return;
        }
        return;
    }
    return gulp.src(f.vendors)
    .pipe(uglifyCss())
    .pipe(concat(cssVendorsFileName))
    .pipe(gulp.dest(f.path.css));
});

gulp.task('frontsize:vendors:fonts', function () {
    if (!f.vendors) {
        if (!f.vendors.fonts) {
            return;
        }
        return;
    }
    gulp.src(f.vendors.fonts)
        .pipe(gulp.dest(f.path.fonts));
});

gulp.task('frontsize:vendors:images', function () {
    if (!f.vendors) {
        if (!f.vendors.images) {
            return;
        }
        return;
    }
    gulp.src(f.vendors.images)
        .pipe(gulp.dest(f.path.images));
});

gulp.task('frontsize:merge', function () {
    if (!f.vendors) {
        if (!f.vendors.css) {
            return;
        }
        return;
    }
    var css = f.vendors.css.slice(0);
    css.push(f.frontsize.test + cssTestFileName);
    return gulp.src(css)
    .pipe(uglifyCss())
    .pipe(concat(cssMergeFileName))
    .pipe(gulp.dest(f.path.css));
});
