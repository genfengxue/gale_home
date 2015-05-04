var gulp = require('gulp')
var sass = require('gulp-sass')
var coffee = require('gulp-coffee')
var rename = require('gulp-rename')
var concat = require('gulp-concat')
var minifyCss = require('gulp-minify-css')
var bowerFiles = require("main-bower-files")
var browserSync = require('browser-sync');

var paths = {
  sass  : ['./app/scss/*.scss'],
  coffee: ['./app/coffee/*.coffee'],
  bower : ['./bower.json']
}

var handleError = function(error) {
  console.error(error.toString())
  this.emit('end')
}

gulp.task('sass', function(done) {
  gulp.src('./app/scss/app.scss')
    .pipe(sass().on('error', handleError))
    .pipe(rename({ extname: '.css' }))
    .pipe(minifyCss({ keepSpecialComments: 0 }))
    .pipe(gulp.dest('./app/css'))
    .on('end', done)
})

gulp.task('coffee', function(done) {
  gulp.src(paths.coffee)
    .pipe(coffee({ bare: true }).on('error', handleError))
    .pipe(concat('app.js'))
    .pipe(gulp.dest('./app/js'))
    .on('end', done)
})


gulp.task('browser-sync', function() {
  browserSync({
    files: ["app/js/*.js", "app/css/*.css"],
    server: {
      baseDir: "app"
    }
  })
})

gulp.task('bower', function(done) {
  console.log(bowerFiles({ filter: /.js$/ }))

  gulp.src(bowerFiles({ filter: /.js$/ }))
    .pipe(concat('vender.js'))
    .pipe(gulp.dest('./app/js'))

  console.log(bowerFiles({ filter: /\.css$/ }))
  gulp.src(bowerFiles({ filter: /\.css$/ }))
    .pipe(concat('vender.css'))
    .pipe(gulp.dest('./app/css'))
    .on('end', done)
})

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass'])
  gulp.watch(paths.coffee, ['coffee'])
  gulp.watch(paths.bower, ['bower'])
})

gulp.task('build', ['sass', 'coffee', 'bower'])

gulp.task('default', ['build', 'watch', 'browser-sync'])

