const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const minify = require('gulp-minify');

gulp.task('sass', () => {
	return gulp.src('./app/sass/main.scss')
		.pipe(sourcemaps.init())
		.pipe(sass({outputStyle: 'expanded'}))
		.pipe(autoprefixer({
			overrideBrowserslist: ['last 2 versions'],
			cascade: false
		}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./dist/css'))
});

gulp.task('compress', () => {
	return gulp.src('./app/js/*.js')
		.pipe(minify({noSource: true}))
		.pipe(gulp.dest('./dist/js'))
});

gulp.task('watch', () => {
	gulp.watch('./app/sass/*/*.scss', gulp.series('sass'));
	gulp.watch('./app/js/*.js', gulp.series('compress'));
})