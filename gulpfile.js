var gulp = require('gulp');
var del = require('del');
var react = require('gulp-react');
var less = require('gulp-less');
var Hjson = require('gulp-hjson');
var nodeunit = require('gulp-nodeunit');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

function handleError(err) {
  console.log(err.toString());
  this.emit('end');
}

gulp.task('clean', function(done) {
	del(['build/**/*'], done);
});

gulp.task("html", function(){
	return gulp.src('src/*.html')
		.pipe(gulp.dest('build/'));
});

gulp.task("libs", function(){
	return gulp.src('libs/**/*')
		.pipe(gulp.dest('build/libs'));
});

gulp.task("less", function(){
	return gulp.src('src/*.less')
		.pipe(less())
		.pipe(gulp.dest('build/'))
   		.on('error', handleError);
});

gulp.task("data", function(){
	return gulp.src('data/*.hjson')
    	.pipe(Hjson({ to: 'json' }))
    	.pipe(gulp.dest('build/data/'));
});

gulp.task("jsx", function(){
	return gulp.src('src/jsx/*.js')
        .pipe(react())
   		.on('error', handleError)
        .pipe(gulp.dest('src/js'));
});

gulp.task("browserify", ['jsx'], function(){
	return browserify({
			entries: './src/js/game.js',
			'ignore-missing': true
		})
		.exclude('lodash')
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('build'))
		.on('error', handleError);
});

gulp.task("js-with-tests", ['jsx'], function(){
	return gulp.src('src/js/tests.js')
		.pipe(nodeunit())
		.on('error', handleError);
});

gulp.task("default", ['clean'], function(){
	gulp.start('data', 'less', 'js-with-tests', 'browserify', 'libs', 'html');
});

gulp.task('watch', ['default'], function(){
	gulp.watch('src/jsx/*.js', ['js-with-tests']);
	gulp.watch('data/*.hjson', ['data']);
	gulp.watch('src/*.less', ['less']);
	gulp.watch('src/*.html', ['html']);
	gulp.watch('libs/**/*', ['libs']);
});

