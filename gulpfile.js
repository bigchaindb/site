'use strict';

// load plugins
var $ = require('gulp-load-plugins')();

// manually require modules that won"t get picked up by gulp-load-plugins
var gulp = require('gulp'),
    del = require('del'),
    pkg = require('./package.json'),
    browser = require('browser-sync');

// Temporary solution until gulp 4
// https://github.com/gulpjs/gulp/issues/355
var runSequence = require('run-sequence');

// handle errors
var onError = function(error) {
    $.util.log('');
    $.util.log($.util.colors.red('You fucked up:', error.message, 'on line' , error.lineNumber));
    $.util.log('');
    this.emit('end');
}

// 'development' is just default, production overrides are triggered
// by adding the production flag to the gulp command e.g. `gulp build --production`
var isProduction = ($.util.env.production === true ? true : false);


// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// Terminal Banner
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

console.log("");
console.log($.util.colors.gray("   <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>"));
console.log($.util.colors.cyan("                        ┌─┐┌─┐┌─┐┬─┐┬┌┐ ┌─┐"));
console.log($.util.colors.cyan("                        ├─┤└─┐│  ├┬┘│├┴┐├┤ "));
console.log($.util.colors.cyan("                        ┴ ┴└─┘└─┘┴└─┴└─┘└─┘"));
console.log($.util.colors.gray("   <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>"));
console.log("");


// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// Config
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

// Port to use for the development server
var PORT = 1337;

// Browsers to target when prefixing CSS
var COMPATIBILITY = ['Chrome >= 30', 'Safari >= 6.1', 'Firefox >= 35', 'Opera >= 32', 'iOS >= 8', 'Android >= 4', 'ie >= 10'];

// paths
var SRC      = '_src/',
    DIST     = '_dist/';

// SVG sprite
var SPRITECONFIG = {
    dest: DIST + 'assets/img/',
    mode: {
        symbol: {
            dest: './',
            sprite: 'sprite.svg'
        }
    }
}

// code banner
var BANNER = [
    '/**',
    ' ** <%= pkg.name %> v<%= pkg.version %>',
    ' ** <%= pkg.description %>',
    ' ** <%= pkg.homepage %>',
    ' **',
    ' ** <%= pkg.author.name %> <<%= pkg.author.email %>>',
    ' **',
    ' ** ',
    ' ** <%= pkg.repository.url %> ',
    ' **/',
    ''
].join('\n');


// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// Tasks
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

//
// Delete build artifacts
//
gulp.task('clean', function(done) {
    return del([
        DIST + '**/*',
        DIST + '.*' // delete all hidden files
    ], done);
});


//
// Jekyll
//
gulp.task('jekyll', function(cb) {

    browser.notify('Compiling Jekyll');

    var spawn = require('child_process').spawn;

    if (isProduction) {
        var jekyll = spawn('bundle', ['exec', 'jekyll', 'build'], { stdio: 'inherit' });
    } else {
        var jekyll = spawn('bundle', ['exec', 'jekyll', 'build', '--incremental', '--drafts', '--future'], { stdio: 'inherit' });
    }

    jekyll.on('exit', function(code) {
        cb(code === 0 ? null : 'ERROR: Jekyll process exited with code: ' + code);
    });
});


//
// HTML
//
gulp.task('html', function() {
    return gulp.src(DIST + '/**/*.html')
            .pipe($.if(isProduction, $.htmlmin({
            collapseWhitespace: true,
            conservativeCollapse: true,
            removeComments: true,
            useShortDoctype: true,
            collapseBooleanAttributes: true,
            removeRedundantAttributes: true,
            removeEmptyAttributes: true,
            minifyJS: true,
            minifyCSS: true
        })))
        .pipe(gulp.dest(DIST));
});


//
// Styles
//
gulp.task('css', function() {
    return gulp.src(SRC + '_assets/styles/bigchain.scss')
        .pipe($.sourcemaps.init())
        .pipe($.sass().on('error', $.sass.logError))
        .pipe($.autoprefixer({ browsers: COMPATIBILITY }))
        .pipe($.if(isProduction, $.cssmin()))
        .pipe($.if(!isProduction, $.sourcemaps.write()))
        .pipe($.if(isProduction, $.header(BANNER, { pkg: pkg })))
        .pipe($.rename({ suffix: '.min' }))
        .pipe(gulp.dest(DIST + 'assets/css/'))
        .pipe(browser.stream());
});


//
// JavaScript
//
gulp.task('js', function() {
    return gulp.src([
        SRC + '_assets/javascripts/bigchain.js',
        SRC + '_assets/javascripts/page-*.js'
    ])
    .pipe($.sourcemaps.init())
    .pipe($.include())
    .pipe($.if(isProduction, $.uglify())).on('error', onError)
    .pipe($.if(!isProduction, $.sourcemaps.write()))
    .pipe($.if(isProduction, $.header(BANNER, { pkg: pkg })))
    .pipe($.rename({suffix: '.min'}))
    .pipe(gulp.dest(DIST + 'assets/js/'));
});


//
// SVG sprite
//
gulp.task('svg', function() {
    return gulp.src(SRC + '_assets/images/**/*.svg')
        .pipe($.if(isProduction, $.imagemin({
            svgoPlugins: [{
                removeRasterImages: true
            }]
        })))
        .pipe($.svgSprite(SPRITECONFIG))
        .pipe(gulp.dest(DIST + 'assets/img/'));
});


//
// Copy Images
//
gulp.task('images', function() {
    return gulp.src(SRC + '_assets/images/**/*')
        .pipe($.if(isProduction, $.imagemin({
            optimizationLevel: 5, // png
            progressive: true, // jpg
            interlaced: true, // gif
            multipass: true, // svg
            svgoPlugins: [{ removeViewBox: false }]
        })))
        .pipe(gulp.dest(DIST + 'assets/img/'));
});


//
// Copy Fonts
//
gulp.task('fonts', function() {
    return gulp.src([
            './node_modules/fira/**/FiraSans-Light.*'
        ])
        .pipe($.rename({dirname: ''}))
        .pipe(gulp.dest(DIST + 'assets/fonts/'));
});


//
// Revision static assets
//
gulp.task('rev', function() {
    // globbing is slow so do everything conditionally for faster dev build
    if (isProduction) {
        return gulp.src(DIST + '/assets/**/*.{css,js,png,jpg,jpeg,svg,eot,ttf,woff}')
            .pipe($.rev())
            .pipe(gulp.dest(DIST + '/assets/'))
            // output rev manifest for next replace task
            .pipe($.rev.manifest())
            .pipe(gulp.dest(DIST + '/assets/'));
        }
});


//
// Replace all links to assets in files
// from a manifest file
//
gulp.task('rev:replace', function() {
    // globbing is slow so do everything conditionally for faster dev build
    if (isProduction) {
        var manifest = gulp.src(DIST + '/assets/rev-manifest.json');

        return gulp.src(DIST + '/**/*.{html,xml,txt,json,css,js,png,jpg,jpeg,svg,eot,ttf,woff}')
            .pipe($.revReplace({ manifest: manifest }))
            .pipe(gulp.dest(DIST));
    }
});


//
// CDN url injection
//
gulp.task('cdn', function() {
    return gulp.src([DIST + '/**/*.html', DIST + '/assets/css/*.css'], { base: DIST })
        .pipe($.replace('/assets/css/', CDN + '/assets/css/'))
        .pipe($.replace('/assets/js/', CDN + '/assets/js/'))
        .pipe($.replace('/assets/img/', CDN + '/assets/img/'))
        .pipe($.replace('../', CDN + '/assets/'))
        .pipe(gulp.dest(DIST));
});


//
// Dev Server
//
gulp.task('server', ['build'], function() {
    browser.init({
        server: DIST,
        port: PORT,
        reloadDebounce: 2000
    });
});


// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// Task sequences
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


//
// Build site, run server, and watch for file changes
//
gulp.task('default', ['build', 'server'], function() {
    gulp.watch([SRC + '_assets/styles/**/*.scss'], ['css']);
    gulp.watch([SRC + '_assets/javascripts/**/*.js'], ['js', browser.reload]);
    gulp.watch([SRC + '_assets/images/**/*.{png,jpg,jpeg,gif,webp}'], ['images', browser.reload]);
    gulp.watch([SRC + '_assets/images/**/*.{svg}'], ['svg', browser.reload]);
    gulp.watch([SRC + '**/*.{html,xml,json,txt,md,yml}', './_config.yml', SRC + '_includes/svg/*'], ['build', browser.reload]);
});


//
// Full build
//
// `gulp build` is the development build
// `gulp build --production` is the production build
//
gulp.task('build', function(done) {

    $.util.log($.util.colors.gray("         ------------------------------------------"));
    $.util.log($.util.colors.green('                Building ' + ($.util.env.production ? 'production' : 'dev') + ' version...'));
    $.util.log($.util.colors.gray("         ------------------------------------------"));

    runSequence(
        'clean',
        'jekyll',
        ['html', 'css', 'js', 'images', 'fonts', 'svg'],
        'rev',
        'rev:replace',
        done
    );
});


// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// Deployment
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
