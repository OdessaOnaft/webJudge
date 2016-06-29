var gulp = require('gulp');
var serve = require('gulp-serve');
var browserSync = require('browser-sync').create();
var less = require('gulp-less');
var path = require('path');
var sourcemaps = require('gulp-sourcemaps');
var inject = require('gulp-inject');
var watch = require('gulp-watch');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var angularFilesort = require('gulp-angular-filesort');
var htmlmin = require('gulp-htmlmin');
var wiredep = require('wiredep').stream;
gulp.task('inject', ['less', 'babel', 'html'], function () {
  // It's not necessary to read the files (will speed up things), we're only after their paths:	

  return gulp.src('./src/index.html')
  	.pipe(wiredep({directory: 'bower_components'}))
    .pipe(gulp.dest('./dist'));
});


gulp.task('serve',['watch', 'inject'], function(){
	serve('public')
	browserSync.init({
        server: {
            baseDir: "./dist",
            routes: {'/bower_components': 'bower_components'}
        },

    });
});

gulp.task('html', function() {
  return gulp.src('src/**/*.html')
    .pipe(wiredep({directory: 'bower_components'}))
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('babel', () => {
	return gulp.src('src/js/**/*.js')
		.pipe(sourcemaps.init())
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(concat('index.js'))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('dist'))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('watch',['inject'], function () {
	// Endless stream mode 
    watch([
    	'./src/**/*.less',
    	], function(){
    		gulp.start('less')
    	})
    watch([
    	'./src/**/*.js',
    	], function(){
    		gulp.start('babel')
    	})
    watch([
    	'./src/**/*.html',
    	], function(){
    		gulp.start('html')
    	})
        
});


gulp.task('less', function () {
  return gulp.src('./src/less/**/*.less')
  	.pipe(sourcemaps.init())
    .pipe(less({
      
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist/css'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('default', ['less'])