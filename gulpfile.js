var root = require('app-root-path').path;
var env  = process.env.NODE_ENV || 'development';
// gulp
var gulp = require('gulp');
var check = require('gulp-if');
var colors = require('colors');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
// file system
var del = require('del');
// css
var sass = require('gulp-sass');
var csso = require('gulp-csso');
var autoprefix = require('gulp-autoprefixer');
// js
var Duo = require('duo');
var map = require('map-stream');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var report = require('jshint-stylish');


// configuration
var config = prefix({
	build: 'build/',
	src: 'source/',
	js: {
		entry: 'js/index.js',
		src: 'js/**/*.js' },
	css: {
		entry: 'css/styles.scss',
		src: 'css/**/*.scss' },
	assets: {
		src: ['index.html', 'tone.mp3', 'css/fonts/**/*']
	}}, ['js', 'css', 'html', 'assets']);

/**
 * Clean build directory
 */
gulp.task('clean', function(done) {
	del(config.build, done);
})

/**
 * Lint scripts
 */
gulp.task('lint', function() {
	return src(config.js.src)
		.pipe(jshint())
		.pipe(jshint.reporter(report));
});

/**
 * Copy any "assets" over to the build folder
 */
gulp.task('assets', function() {
	return src(config.assets.src)
		.pipe(out())
})

/**
 * Compile scripts through Duo
 */
gulp.task('scripts', function() {
	return src(config.js.entry)
		.pipe(errors())
		.pipe(sourcemaps.init())
			.pipe(duo())
			.pipe(check(env === 'production', uglify()))
		.pipe(sourcemaps.write())
		.pipe(out());
});

/**
 * Run styles through SASS
 */
gulp.task('styles', function() {
	return src(config.css.entry)
		.pipe(errors())
		.pipe(sourcemaps.init())
			.pipe(sass())
			.pipe(autoprefix())
			.pipe(check(env === 'production', csso()))
		.pipe(sourcemaps.write())
		.pipe(out());
});

/**
 * Watch files for changes and reload
 */
gulp.task('watch', function() {
	gulp.watch(config.css.watch || [config.css.entry, config.css.src], gulp.parallel('lint', 'styles'));
	gulp.watch(config.js.watch || [config.js.entry, config.js.src], 'scripts');
	gulp.watch(config.assets.watch || config.assets.src, 'assets');
});

gulp.task('build', gulp.series('clean', gulp.parallel('lint', 'scripts'), 'styles', 'assets'));
gulp.task('default', gulp.parallel('build', 'watch'));


/**
 * Prep duo for gulp streams
 * @param {Object} opts
 */
function duo(opts) {
	opts = opts || {};
	return map(function(file, fn) {
		Duo(root)
		.entry(file.path)
		.run(function(err, src) {
			if (err) return fn(err);
			file.contents = new Buffer(src);
			fn(null, file);
		});
	});
}

function src(glob) { return gulp.src(glob, { base: config.src }); }
function out() { return gulp.dest(config.build); }
function errors() { return plumber({ errorHandler: handler }); }
function handler(err) { console.log('[Error] '.red, err.message); }

/**
 * Prefix config attributes with the specified source directory
 * @param {Object} opts
 * @param {Array} prefixKeys
 * @returns {Object}
 */
function prefix(opts, keys) {
	var utils = require('lodash');
	utils.mixin(require('lodash-deep'));

	if (!opts.src) return opts;

	keys = keys.filter(function(key) {
		return !!opts[key];
	});

	opts = utils.deepMapValues(opts, function(value, path) {
		if (!~keys.indexOf(path[0])) return value;
		return opts.src + value;
	});

	return opts;
}