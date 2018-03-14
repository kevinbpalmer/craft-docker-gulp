'use strict';

var config = {};

config.siteName = 'craft';
config.proxyDomain = 'localhost';

//source directory
config.src = 'source/';

// destinations
config.dest = 'html/assets/';
config.destJS = config.dest + 'js';
config.destCSS = config.dest + 'styles';

//globs
config.globs = {
	sass : config.src + 'sass/**/*.sass',
	js : {
		individual : config.src + 'js/individual/**/*.js',
		combined : [
			config.src + 'js/combined/libs/*.js',
			config.src + 'js/combined/plugins/*.js',
			config.src + 'js/combined/pluginSubs/*.js',
			config.src + 'js/combined/site/*.js',
			config.src + 'js/combined/site.js'
		]
	},
	watched : [
		'craft/templates/**/*',
		config.destJS + '/**/*.min.js',
		config.destCSS + '/**/*.min.css'
	]
};

//browser sync
config.browserSync = {
	files: config.globs.watched,
	proxy: config.proxyDomain,
	open: false
};

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer     = require('gulp-autoprefixer'),
    concat           = require('gulp-concat'),
    livereload       = require('gulp-livereload'),
    browserSync      = require('browser-sync').create(),
    newer            = require('gulp-newer'),
    notify           = require('gulp-notify'),
    plumber          = require('gulp-plumber'),
    rename           = require('gulp-rename'),
    size             = require('gulp-size'),
    uglify           = require('gulp-uglify'),
    watch            = require('gulp-watch'),
    path             = require('path'),
    cssnano          = require('gulp-cssnano'),
    sourcemaps       = require('gulp-sourcemaps'),
    lazypipe         = require('lazypipe'),
    fs               = require('fs');

// handle plumber errors
var plumberErrorHandler = function(err) {
	console.log( 'plumber error! "' + err.message + '"' );
	notify.onError({
		title: config.siteName,
		message: "Error: <%= err.message %>",
		sound: 'Pop'
	});
	this.emit('end');
};

// -------------------- Processors --------------------
//individual scripts (not combined)
var jsIndividualScripts = lazypipe()
	.pipe(plumber, {errorHandler: plumberErrorHandler})
	.pipe(newer, { dest: config.destJS, ext: '.min.js' })
	.pipe(gulp.dest, config.destJS)
	.pipe(size, {showFiles: true})
	.pipe(uglify)
	.pipe(rename, { suffix: '.min' })
	.pipe(gulp.dest, config.destJS)
	.pipe(size, {showFiles: true});

//combined scripts
var jsCombinedScripts = lazypipe()
	.pipe(plumber, {errorHandler: plumberErrorHandler})
	.pipe(newer, config.dest + 'js/scripts.min.js')
	.pipe(concat, 'scripts.js')
	.pipe(gulp.dest, config.destJS)
	.pipe(size, {showFiles: true})
	.pipe(uglify)
	.pipe(rename, { suffix: '.min' })
	.pipe(gulp.dest, config.destJS)
	.pipe(size, {showFiles: true});

var sassProcessing = lazypipe()
	.pipe(plumber, {errorHandler: plumberErrorHandler})
	.pipe(sass, {outputStyle: ':compact'})
	.pipe(autoprefixer, 'ie >= 9')
	.pipe(gulp.dest, config.destCSS)
	.pipe(size, {showFiles: true})
	.pipe(rename, { suffix: '.min' })
	.pipe(sourcemaps.init)
	.pipe(cssnano)
	.pipe(sourcemaps.write, '.')
	.pipe(gulp.dest, config.destCSS)
	.pipe(size, {showFiles: true});

//scripts individual task
gulp.task('scripts-individual', function() {
	return gulp.src(config.globs.js.individual).pipe(jsIndividualScripts());
});

//scripts combined task
gulp.task('scripts-combined', function() {
	return gulp.src(config.globs.js.combined).pipe(jsCombinedScripts());
});

//styles task
gulp.task('styles', function() {
	if ( browserSync.active ) {
		return gulp.src(config.globs.sass)
			.pipe(sassProcessing())
			.pipe(browserSync.reload({stream:true}));
	}
	return gulp.src(config.globs.sass).pipe(sassProcessing());
});

//watch task
gulp.task('live', function() {
	//watch all .scss files
	gulp.watch(config.globs.sass, ['styles']);

	//watch each individual .js file
	watch(config.globs.js.individual).pipe(jsIndividualScripts());

	//watch all combined .js files
	gulp.watch(config.globs.js.combined, ['scripts-combined']);
});

//default task - one time styles and scripts
// gulp.task('prod', ['styles', 'scripts-individual', 'scripts-combined']);

//start browser-sync server
gulp.task('serve', ['live'], function() {
	browserSync.init(config.browserSync);
  gulp.watch('craft/templates/**/*.*').on('change', browserSync.reload);
});
