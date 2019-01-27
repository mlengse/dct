var gulp = require('gulp');
var uncss = require('gulp-uncss');
 
gulp.task('uncss', function() {
  return gulp
    .src('./dist/**/*.css')
    .pipe(uncss({
      html: './dist/**/*.html'
    }))
    .pipe(gulp.dest('./dist'));
});