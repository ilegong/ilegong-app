var path = require('path');
var gulp = require('gulp');
var clean = require('gulp-clean');
var templateCache = require('gulp-angular-templatecache');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var minifyHtml = require("gulp-minify-html");
var rename = require('gulp-rename');
var sh = require('shelljs');
var _ = require('lodash');

var libPath = 'bower_components';

var cssPath = {
  src: ['scss/app.scss', 'scss/custom.scss'],
  dist: 'www/css',
}
var fontsPath = {
  src: path.join(libPath, 'ionic/fonts/*.*'),
  dist: 'www/css/fonts'
}
var templatePath = {
  src: ['angular/**/*.html'], 
  dist: 'www/js'
}
var appJsPath = {
  src: ['angular/**/*.js'], 
  dist: 'www/js'
}
var libJsPath = {
  src: _.map([
      'lodash/dist/lodash.js',
      'spin.js/spin.js',
      'angular/angular.js',
      'ionic/js/ionic.js',
      'ionic/js/ionic-angular.js',
      'localforage/dist/localforage.js', 
      'angular-animate/angular-animate.js',
      'angular-sanitize/angular-sanitize.js',
      'angular-ui-bootstrap-bower/ui-bootstrap-tpls.js',
      'angular-ui-router/release/angular-ui-router.js',
      'angular-touch/angular-touch.js',
      'angular-spinner/angular-spinner.js',
      'angular-localforage/dist/angular-localForage.js', 
      'collide/collide.js',
      'restangular/dist/restangular.js',
      'lodash/dist/lodash.js'
    ], function (sPath) {
      return path.join(libPath, sPath);
    }),
  dist: 'www/js'
}

gulp.task('default', ['dev']);

gulp.task('dev', ['dev:templates', 'dev:libjs', 'dev:appjs', 'sass'], function () {
  gulp.watch([appJsPath.src, templatePath.src], ['dev:appjs']);
  gulp.watch('scss/**/*.scss', ['sass']);
});

/*=========================== CLEAN ===========================*/
//clean 任务单独执行，一般用不到
gulp.task('dev:clean', function () {
  return gulp.src([cssPath.dist, fontsPath.dist, appJsPath.dist, templatePath.dist])
    .pipe(clean());
});

/*=========================== CSS & JS & HTML ===========================*/
gulp.task('sass', function(done) {
  gulp.src(cssPath.src)
    .pipe(sass())
    .pipe(minifyCss())
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest(cssPath.dist))
    .on('end', done);

  gulp.src(fontsPath.src)
    .pipe(gulp.dest(fontsPath.dist))
});

//将依赖的第三方js库合并成lib.js后放入dist目录
gulp.task('dev:libjs', function () {
  return gulp.src(libJsPath.src)
    .pipe(concat('lib.js'))
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest(appJsPath.dist));
});

//将angular的所有template html转成js并且合并后放到dist目录下
gulp.task('dev:templates', function () {
  return gulp.src(templatePath.src)
    .pipe(templateCache({
      module: 'ilegong.templates',
      standalone: true,
      base: function (templateFile) {
        return path.basename(templateFile.path);
      },
      filename: 'tmpl.js'
    }))
    // .pipe(minifyHtml())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest(templatePath.dist));
});

//将app自己的js文件合并成app.js后放入dist目录
gulp.task('dev:appjs', ['dev:templates'], function () {
  return gulp.src(appJsPath.src)
    .pipe(concat('app.js'))
    // .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest(appJsPath.dist))
});
