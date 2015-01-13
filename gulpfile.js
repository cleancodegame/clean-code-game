var map = require('map-stream');
var gulp = require('gulp');
var debug = require('gulp-debug');
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

function toJsonp(funcName){
	
	function toJsonpOne(file, cb){
		var cont = funcName + "(" + file.contents.toString() + ");";
		file.contents = new Buffer(cont);
		cb(null, file);
	}

	return map(toJsonpOne);
}

function validateJson(schema){
	function validateOne(file, cb)	{
		var json = JSON.parse(file.contents.toString());	
		var env = JSV.createEnvironment();
		var report = env.validate(json, dataSchema)
		if (report.errors.length > 0){
			console.log(report.errors);
			cb("Json validation error");
		}
		else
			cb(null, file);
	}

	return map(validateOne);
}

var dataSchema = {
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

gulp.task("web.config", function(){
	return gulp.src('web.config')
		.pipe(gulp.dest('build'));
});


gulp.task("less", function(){
	return gulp.src('src/*.less')
		.pipe(less())
   		.on('error', handleError)
		.pipe(gulp.dest('build/'));
});

gulp.task("cson", function(){
	return gulp.src('data/*.cson')
    	.pipe(cson())
    	.pipe(validateJson(dataSchema))
   		.on('error', handleError)
    	.pipe(toJsonp('handleData'))
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
			entries: './src/js/AppView.js',
			'ignore-missing': true,
		})
		.exclude('lodash')
		//.require('./src/js/AppView.js', {expose: 'AppView'})
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
	gulp.start('cson', 'less', 'js-with-tests', 'browserify', 'libs', 'html', 'img', 'web.config');
});

gulp.task('watch', ['default'], function(){
	gulp.watch('src/jsx/*.js', ['js-with-tests']);
	gulp.watch('data/*.cson', ['cson']);
	gulp.watch('src/*.less', ['less']);
	gulp.watch('src/*.html', ['html']);
	gulp.watch('libs/**/*', ['libs']);
	gulp.watch('img/*', ['img']);
	gulp.watch('web.config', ['web.config']);
});

