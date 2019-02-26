const gulp = require('gulp');

gulp.task('copyCSS', function () {
    return gulp.src(['src/**/*.css', 'src/**/**/*.css'])
        .pipe(gulp.dest('dist'));
});
