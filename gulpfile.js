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

var sassPath = {
  sass: ['scss/**/*.scss']
};
var distPath = 'www/js';
var srcPath = 'www/angular';
var libPath = 'bower_components';

gulp.task('default', ['sass', 'dev']);

gulp.task('dev', ['dev:templates', 'dev:libjs', 'dev:appjs', 'sass'], function () {
  gulp.watch(path.join(srcPath, '/**/*.js'), ['dev:appjs']);

  gulp.watch(path.join(srcPath, '/**/*.html'), ['dev:appjs']);

  gulp.watch(sassPath.sass, ['sass']);
});

/*=========================== CLEAN ===========================*/
//clean 任务单独执行，一般用不到
gulp.task('dev:clean', function () {
  return gulp.src(distPath, {read: false})
    .pipe(clean());
});

/*=========================== CSS & JS & HTML ===========================*/
gulp.task('sass', function(done) {
  gulp.src('scss/ionic.app.scss')
    .pipe(sass())
    .pipe(gulp.dest('www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('www/css/'))
    .on('end', done);

  gulp.src(path.join(libPath, 'ionic/fonts/*.*'))
    .pipe(gulp.dest('www/css/fonts/'))
});

//将依赖的第三方js库合并成lib.js后放入dist目录
gulp.task('dev:libjs', function () {
  var jsLib = _.map([
    'lodash/dist/lodash.js',
    'spin.js/spin.js',
    'angular/angular.js',
    'ionic/js/ionic.js',
    'ionic/js/ionic-angular.js',
    'angular-animate/angular-animate.js',
    'angular-sanitize/angular-sanitize.js',
    'angular-ui-bootstrap-bower/ui-bootstrap-tpls.js',
    'angular-ui-router/release/angular-ui-router.js',
    'angular-touch/angular-touch.js',
    'angular-spinner/angular-spinner.js',
    'collide/collide.js',
    'restangular/dist/restangular.js',
    'lodash/dist/lodash.js'
  ], function (sPath) {
    return path.join(libPath, sPath);
  });

  console.log(jsLib);

  return gulp.src(jsLib)
    .pipe(concat('lib.js'))
    .pipe(gulp.dest(distPath));
});

//将angular的所有template html转成js并且合并后放到dist目录下
gulp.task('dev:templates', function () {
  return gulp.src(path.join(srcPath, '/**/*.html'))
    .pipe(templateCache({
      module: 'ilegong.templates',
      standalone: true,
      base: function (templateFile) {
        return path.basename(templateFile.path);
      },
      filename: 'ilegong.tmpl'
    }))
    .pipe(gulp.dest(distPath));
});

//将app自己的js文件合并成app.js后放入dist目录
gulp.task('dev:appjs', ['dev:templates'], function () {
  var files = [
    path.join(srcPath, '/**/*.js'),
    path.join(distPath, '/*.tmpl')
  ];

  return gulp.src(files)
    .pipe(concat('app.js'))
    .pipe(gulp.dest(distPath))
});
