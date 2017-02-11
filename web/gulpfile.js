var gulp = require('gulp');
var pump = require('pump');
var serve = require('gulp-serve');
var browserSync = require('browser-sync').create();
var browserSyncSpa = require('browser-sync-spa');
var less = require('gulp-less');
var path = require('path');
var sourcemaps = require('gulp-sourcemaps');
var inject = require('gulp-inject');
var watch = require('gulp-watch');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var inject = require('gulp-inject');
var uglify2 = require('gulp-uglifyjs');
var angularFilesort = require('gulp-angular-filesort');
var htmlmin = require('gulp-htmlmin');
var clean = require('gulp-clean');
var mainBowerFiles = require('main-bower-files');
var templateCache = require('gulp-angular-templatecache');
var wiredep = require('wiredep').stream;
var cleanCSS = require('gulp-clean-css');
gulp.task('inject', ['less', 'babel', 'html'], function () {
  // It's not necessary to read the files (will speed up things), we're only after their paths:	

  return gulp.src('./src/index.html')
  	.pipe(wiredep({
      directory: 'bower_components'
    }))
    .pipe(gulp.dest('./dist'));
});

browserSync.use(browserSyncSpa({
  selector: '[ng-app]'// Only needed for angular apps
}));

gulp.task('serve',['watch', 'inject', 'assets'], function(){
	serve('public')
	browserSync.init({
        server: {
            baseDir: "dist",
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
    .pipe(angularFilesort())
		.pipe(concat('index.js'))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('dist'))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('watch',['inject'], function () {
	// Endless stream mode 
    watch([
        './src/less/**/*.less',
    ], function(){
        gulp.start('less')
    })
    watch([
        './src/js/**/*.js',
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
    .pipe(concat('index.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist/css'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('clean', function () {
  return gulp.src(['./dist/**/*.css', '!dist/css/index.css'])
    .pipe(clean())
});


gulp.task('assets', function() {
  gulp.src('src/assets/**/*')
    .pipe(gulp.dest('dist/assets/'))
});

gulp.task('minify-js',['angular-template'], function(cb) {
  pump([
        gulp.src('dist/*.js'),
        angularFilesort(),
        concat('index.js'),
        uglify(),
        gulp.dest('build/scripts')
    ],
    cb()
  );
});

gulp.task('minify-css', function(cb) {
  pump([
    gulp.src('dist/css/*.css'),
    cleanCSS(),
    gulp.dest('build/styles')
  ]),
  cb()
  
});

gulp.task('clean-build', function () {
  return gulp.src(['build/styles', 'build/html', 'build/scripts','build/assets/'])
    .pipe(clean())
});

gulp.task('angular-template', function (cb) {
  pump([
    gulp.src(['dist/**/*.html', "!index.html"]),
    templateCache('templateCacheHtml.js', {
      module: 'notifyapp',
      root: '/'
    }),

    gulp.dest('dist')
  ]),
  cb()
});

gulp.task('assets-build', function(cb) {
  pump([
      gulp.src('src/assets/**/*'),
      gulp.dest('build/assets')
    ]),
    cb()
});



gulp.task('bower-build', function(cb) {
    pump([
      gulp.src(mainBowerFiles({
                paths: {
                    bowerDirectory: 'bower_components',
                    bowerrc: '.bowerrc',
                    bowerJson: 'bower.json'
      }})),
      concat("vendor.js"),
      uglify(),
      gulp.dest('build/scripts')
      
    ]),
    cb()
});



gulp.task('angular-template-build', function (cb) {
  pump([
    gulp.src(['src/**/*.html', "!index.html"]),
    templateCache('templateCacheHtml.js', {
      module: 'notifyapp',
      root: '/'
    }),

    gulp.dest('src')
  ]),
  cb()
});


gulp.task('js-build', ['angular-template-build'], function(cb) {
  pump([
    gulp.src('src/**/*.js'),
    babel({presets: ['es2015']}),
    angularFilesort(),
    concat('index.js'),
    uglify({mangle: false}),
    gulp.dest('build/')
  ])
  cb();
  return 
});

gulp.task('css-build', function(cb) {
  pump([
    gulp.src('./src/less/**/*.less'),
    less({}),
    concat('index.css'),
    cleanCSS(),
    gulp.dest('./build/css')
  ])
  cb();
  return 
});

gulp.task('html-build',['css-build', 'js-build','assets-build', 'bower-build'], function(cb) {
  pump([
    gulp.src('src/index.html'),
    htmlmin({collapseWhitespace: true}),
    gulp.dest('build')
  ]),
  cb()
})



gulp.task('default', ['html-build'])