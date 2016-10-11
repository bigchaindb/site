'use strict';

// load plugins
var $ = require('gulp-load-plugins')();

// manually require modules that won"t get picked up by gulp-load-plugins
var gulp = require('gulp'),
    del = require('del'),
    pkg = require('./package.json'),
    parallelize = require('concurrent-transform'),
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
console.log($.util.colors.cyan("                  __                  __  __    "));
console.log($.util.colors.cyan("                 |__). _  _|_  _ . _ |  \ |__)  "));
console.log($.util.colors.cyan("                 |__)|(_)(_| )(_||| )|__/|__)  "));
console.log($.util.colors.cyan("                      _/                       "));
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

// deployment
var S3BUCKET         = 'www.bigchaindb.com',
    S3REGION         = 'eu-central-1',
    S3BUCKET_BETA    = 'beta.bigchaindb.com',
    S3REGION_BETA    = 'eu-central-1';

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
        process.env.JEKYLL_ENV = 'production';
        var jekyll = spawn('bundle', ['exec', 'jekyll', 'build'], { stdio: 'inherit' });
    } else {
        process.env.JEKYLL_ENV = 'development';
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
            optimizationLevel: 3, // png
            progressive: true, // jpg
            interlaced: true, // gif
            multipass: true, // svg
            svgoPlugins: [{ removeViewBox: false }]
        })))
        .pipe(gulp.dest(DIST + 'assets/img/'));
});


//
// Revision static assets
//
gulp.task('rev', function() {
    // globbing is slow so do everything conditionally for faster dev build
    if (isProduction) {
        return gulp.src(DIST + '/assets/**/*.{css,js,png,jpg,jpeg,svg,eot,ttf,woff,woff2}')
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

        return gulp.src(DIST + '/**/*.{html,xml,txt,json,css,js,svg}')
            .pipe($.revReplace({ manifest: manifest }))
            .pipe(gulp.dest(DIST));
    }
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
        ['html', 'css', 'js', 'images', 'svg'],
        'rev',
        'rev:replace',
        done
    );
});


// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// Deployment
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

//
// gulp deploy --live
// gulp deploy --beta
//
gulp.task('deploy', function() {

    // create publisher, define config
    if ($.util.env.live === true) {
        var publisher = $.awspublish.create({
                params: { "Bucket": S3BUCKET },
                "accessKeyId": process.env.AWS_ACCESS_KEY,
                "secretAccessKey": process.env.AWS_SECRET_KEY,
                "region": S3REGION
        });

        $.util.log($.util.colors.gray("        ------------------------------------------"));
        $.util.log($.util.colors.green('                    Deploying to Live... '));
        $.util.log($.util.colors.gray("        ------------------------------------------"));
    }
    if ($.util.env.beta === true) {
        var publisher = $.awspublish.create({
                params: { "Bucket": S3BUCKET_BETA },
                "accessKeyId": process.env.AWS_BETA_ACCESS_KEY,
                "secretAccessKey": process.env.AWS_BETA_SECRET_KEY,
                "region": S3REGION_BETA
        });

        $.util.log($.util.colors.gray("        ------------------------------------------"));
        $.util.log($.util.colors.green('                  Deploying to Beta... '));
        $.util.log($.util.colors.gray("        ------------------------------------------"));
    }

    return gulp.src(DIST + '**/*')
        .pipe($.awspublishRouter({
            cache: {
                // cache for 5 minutes by default
                cacheTime: 300
            },
            routes: {
                // all static assets, cached & gzipped
                '^assets/(?:.+)\\.(?:js|css|png|jpg|jpeg|gif|ico|svg|ttf)$': {
                    cacheTime: 2592000, // cache for 1 month
                    gzip: true
                },

                // every other asset, cached
                '^assets/.+$': {
                    cacheTime: 2592000  // cache for 1 month
                },

                // all html files, not cached & gzipped
                '^.+\\.html': {
                    cacheTime: 0,
                    gzip: true
                },

                // font mime types
                '\.eot$': {
                    key: '$&',
                    headers: { 'Content-Type': 'application/vnd.ms-fontobject' }
                },
                '\.ttf$': {
                    key: '$&',
                    headers: { 'Content-Type': 'application/x-font-ttf' }
                },
                '\.woff$': {
                    key: '$&',
                    headers: { 'Content-Type': 'application/x-font-woff' }
                },
                '\.woff2$': {
                    key: '$&',
                    headers: { 'Content-Type': 'application/x-font-woff2' }
                },

                // pass-through for anything that wasn't matched by routes above, to be uploaded with default options
                "^.+$": "$&"
            }
        }))
        .pipe(parallelize(publisher.publish(), 100))
        .pipe(publisher.sync()) // delete files in bucket that are not in local folder
        .pipe($.awspublish.reporter({
            states: ['create', 'update', 'delete']
        }));
});
