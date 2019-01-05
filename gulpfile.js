const gulp = require('gulp')
const sass = require('gulp-sass')

const sassInput = './src/scss/*.scss'

function styles() {
  return gulp.src(sassInput)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./public/css'))
}

function watch() {
  return gulp.watch(sassInput, styles)
}

exports.styles = styles
exports.watch = watch

exports.default = gulp.series(styles)
