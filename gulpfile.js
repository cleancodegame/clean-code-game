var gulp = require('gulp');
var del = require('del');
var react = require('gulp-react');
var less = require('gulp-less');
var cson = require('gulp-cson');
var nodeunit = require('gulp-nodeunit');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var JSV = require("JSV").JSV;
var fs = require('fs');

function handleError(err) {
  console.log(err.toString());
  console.log("\007");
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

gulp.task("img", function(){
	return gulp.src('img/*')
		.pipe(gulp.dest('build/img'));
});

gulp.task("less", function(){
	return gulp.src('src/*.less')
		.pipe(less())
		.pipe(gulp.dest('build/'))
   		.on('error', handleError);
});

gulp.task("data", ["cson"], function(){
	var schema = {
		type : "array",	items: {
			type: "object",	properties: {
				name: { type: "string", required: true },
				code: { type: "string", required: true },
				bugs: {	
					type:"object",	required: true, additionalProperties:{
						type:"object",	properties:{
							type: { type: "string", required: true },
							replace: { type: "string", required: true },
							description: { type: "string", required: true }
						}
					}
				}
			}
		}
	};

	var json = JSON.parse(fs.readFileSync('build/data/data.json', 'utf8'));	
	var env = JSV.createEnvironment();
	var report = env.validate(json, schema)
	if (report.errors.length > 0) {
    	console.log(report.errors);
  		console.log("\007");
	}
});

gulp.task("cson", function(){
	return gulp.src('data/*.cson')
    	.pipe(cson())
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
			entries: './src/js/app.js',
			'ignore-missing': true
		})
		.exclude('lodash')
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('build'))
		.on('error', handleError);
});

gulp.task("js-with-tests", ['browserify'], function(){
	return gulp.src('src/js/tests.js')
		.pipe(nodeunit())
		.on('error', handleError);
});

gulp.task("default", ['clean'], function(){
	gulp.start('data', 'less', 'js-with-tests', 'browserify', 'libs', 'html', 'img');
});

gulp.task('watch', ['default'], function(){
	gulp.watch('src/jsx/*.js', ['js-with-tests']);
	gulp.watch('data/*.cson', ['data']);
	gulp.watch('src/*.less', ['less']);
	gulp.watch('src/*.html', ['html']);
	gulp.watch('libs/**/*', ['libs']);
	gulp.watch('img/*', ['img']);
});

