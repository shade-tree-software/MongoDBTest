const gulp = require('gulp');
const babel = require('gulp-babel');
const babelify = require('babelify');
const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const source = require('vinyl-source-stream');
//const uglify = require('gulp-uglify');
const fs = require('fs');

gulp.task('index', function () {
  fs.existsSync("dist") || fs.mkdirSync("dist");
  fs.copyFile('src/client/index.html', 'dist/index.html', (err) => {
    if (err) throw err;
  })
});

gulp.task('server', function () {
  gulp.src('src/server/*.js')
    .pipe(babel())
    .pipe(gulp.dest('dist'));
});

gulp.task('client', function () {
  let bundler = browserify({
    entries: ['src/client/app.js'],
    cache: {},
    packageCache: {}
  });

  bundler.on('update', doBundle);
  doBundle();

  function doBundle() {
    bundler.transform(babelify);
    bundler.bundle()
      .on('error', function (err) {
        console.error(err);
      })
      .pipe(source('client.js'))
      .pipe(buffer())
      //.pipe(uglify()) // Use any gulp plugins you want now
      .pipe(gulp.dest('dist'));
  }
});

gulp.task('watch', function() {
  gulp.watch('src/index.html', ['index'])
  gulp.watch('src/client/*.js', ['client'])
  gulp.watch('src/server/*.js', ['server'])
});

gulp.task('default', ['server', 'client', 'index', 'watch']);