const gulp = require('gulp');
const ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const tsProject = ts.createProject('tsconfig.json');
const merge = require('merge2');

// gulp.task('default', function () {
//     const tsResult = tsProject.src().pipe(sourcemaps.init()).pipe(tsProject());
//     return merge([
//         tsResult.js.pipe(sourcemaps.write('./')).pipe(gulp.dest('dist')),
//         tsResult.dts.pipe(gulp.dest('dist')),
//     ]);
// });

gulp.task('copyCSS', function () {
    return gulp.src(['src/**/*.css', 'src/**/**/*.css'])
        .pipe(gulp.dest('dist'));
});
