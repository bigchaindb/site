'use strict'

// load plugins
const $ = require('gulp-load-plugins')()

// manually require modules that won"t get picked up by gulp-load-plugins
const gulp = require('gulp'),
      del = require('del'),
      pkg = require('./package.json'),
      parallelize = require('concurrent-transform'),
      browser = require('browser-sync').create(),
      spawn = require('child_process').spawn

// handle errors
const onError = (error) => {
    console.log($.util.colors.red('\nYou fucked up:', error.message, 'on line' , error.lineNumber, '\n'))
    this.emit('end')
}

// 'development' is just default, production overrides are triggered
// by adding the production flag to the gulp command e.g. `gulp build --production`
const isProduction = ($.util.env.production === true ? true : false),
      isStaging    = ($.util.env.staging === true ? true : false)


// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// Terminal Banner
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

console.log("");
console.log($.util.colors.gray("   <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>"))
console.log($.util.colors.cyan("                  __                  __  __    "))
console.log($.util.colors.cyan("                 |__). _  _|_  _ . _ |  \ |__)  "))
console.log($.util.colors.cyan("                 |__)|(_)(_| )(_||| )|__/|__)  "))
console.log($.util.colors.cyan("                      _/                       "))
console.log($.util.colors.gray("   <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>"))
console.log("")


// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// Config
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

// Port to use for the development server
const PORT = 1337

// Browsers to target when prefixing CSS
const COMPATIBILITY = ['last 2 versions', 'Chrome >= 30', 'Safari >= 6.1', 'Firefox >= 35', 'Opera >= 32', 'iOS >= 8', 'Android >= 4', 'ie >= 10']

// paths
const SRC      = '_src/',
      DIST     = '_dist/'

// deployment
const S3BUCKET         = 'www.bigchaindb.com',
      S3REGION         = 'eu-central-1',
      S3BUCKET_BETA    = 'beta.bigchaindb.com',
      S3REGION_BETA    = 'eu-central-1',
      S3BUCKET_GAMMA   = 'gamma.bigchaindb.com',
      S3REGION_GAMMA   = 'eu-central-1'

// SVG sprite
const SPRITECONFIG = {
    dest: DIST + 'assets/img/',
    mode: {
        symbol: {
            dest: './',
            sprite: 'sprite.svg'
        }
    }
}

// code banner
const BANNER = [
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
].join('\n')


// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// gulp tasks
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

//
// Full build
//
// `gulp build` is the development build
// `gulp build --production` is the production build
//
gulp.task('build', gulp.series(
    buildBanner, clean, jekyll,
    gulp.parallel(html, css, js, images, fonts, videos, svg),
    rev, revReplace
))

function buildBanner(done) {
    console.log($.util.colors.gray("         ------------------------------------------"))
    console.log($.util.colors.green('                Building ' + ($.util.env.production ? 'production' : $.util.env.staging ? 'staging' : 'dev') + ' version...'))
    console.log($.util.colors.gray("         ------------------------------------------"))

    done()
}


//
// Build site, run server, and watch for file changes
//
gulp.task('default', gulp.series('build', server, watch))


// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// Functions
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

//
// Delete build artifacts
//
function clean(done) {
    return del([
        DIST + '**/*',
        DIST + '.*' // delete all hidden files
    ])

    done()
}


//
// Jekyll
//
function jekyll(done) {

    browser.notify('Compiling Jekyll')

    if (isProduction) {
        process.env.JEKYLL_ENV = 'production'
        var jekyll_options = 'jekyll build'
    } else if (isStaging) {
        process.env.JEKYLL_ENV = 'staging'
        var jekyll_options = 'jekyll build'
    } else {
        process.env.JEKYLL_ENV = 'development'
        var jekyll_options = 'jekyll build --incremental --drafts --future'
    }

    const jekyll = spawn('bundle', ['exec', jekyll_options], { stdio: 'inherit' })

    return jekyll
        .on('error', (error) => onError() )
        .on('close', done)
};


//
// HTML
//
function html() {
    return gulp.src(DIST + '/**/*.html')
            .pipe($.if(isProduction || isStaging, $.htmlmin({
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
        .pipe(gulp.dest(DIST))
};


//
// Styles
//
function css() {
    return gulp.src(SRC + '_assets/styles/bigchain.scss')
        .pipe($.sourcemaps.init())
        .pipe($.sass().on('error', $.sass.logError))
        .pipe($.autoprefixer({ browsers: COMPATIBILITY }))
        .pipe($.if(isProduction || isStaging, $.cleanCss()))
        .pipe($.if(!isProduction, $.sourcemaps.write()))
        .pipe($.if(isProduction || isStaging, $.header(BANNER, { pkg: pkg })))
        .pipe($.rename({ suffix: '.min' }))
        .pipe(gulp.dest(DIST + 'assets/css/'))
        .pipe(browser.stream())
};


//
// JavaScript
//
function js() {
    return gulp.src([
        SRC + '_assets/javascripts/bigchain.js',
        SRC + '_assets/javascripts/page-*.js'
    ])
    .pipe($.sourcemaps.init())
    .pipe($.include())
    .pipe($.if(isProduction || isStaging, $.uglify())).on('error', onError)
    .pipe($.if(!isProduction || !isStaging, $.sourcemaps.write()))
    .pipe($.if(isProduction || isStaging, $.header(BANNER, { pkg: pkg })))
    .pipe($.rename({suffix: '.min'}))
    .pipe(gulp.dest(DIST + 'assets/js/'))
};


//
// SVG sprite
//
function svg() {
    return gulp.src(SRC + '_assets/images/**/*.svg')
        .pipe($.if(isProduction || isStaging, $.imagemin({
            svgoPlugins: [{
                removeRasterImages: true
            }]
        })))
        .pipe($.svgSprite(SPRITECONFIG))
        .pipe(gulp.dest(DIST + 'assets/img/'))
}


//
// Copy Images
//
function images() {
    return gulp.src(SRC + '_assets/images/**/*')
        .pipe($.if(isProduction || isStaging, $.imagemin({
            optimizationLevel: 3, // png
            progressive: true, // jpg
            interlaced: true, // gif
            multipass: true, // svg
            svgoPlugins: [{ removeViewBox: false }]
        })))
        .pipe(gulp.dest(DIST + 'assets/img/'))
}


//
// Copy Fonts
//
function fonts() {
    return gulp.src(SRC + '_assets/fonts/**/*')
        .pipe($.rename({dirname: ''}))
        .pipe(gulp.dest(DIST + 'assets/fonts/'))
}


//
// Copy Videos
//
function videos() {
    return gulp.src(SRC + '_assets/videos/**/*')
        .pipe(gulp.dest(DIST + 'assets/videos/'))
}

//
// Revision static assets
//
function rev(done) {
    // globbing is slow so do everything conditionally for faster dev build
    if (isProduction || isStaging) {
        return gulp.src(DIST + '/assets/**/*.{css,js,png,jpg,jpeg,svg,eot,ttf,woff,woff2}')
            .pipe($.rev())
            .pipe(gulp.dest(DIST + '/assets/'))
            // output rev manifest for next replace task
            .pipe($.rev.manifest())
            .pipe(gulp.dest(DIST + '/assets/'))
        }

    done()
};


//
// Replace all links to assets in files
// from a manifest file
//
function revReplace(done) {
    // globbing is slow so do everything conditionally for faster dev build
    if (isProduction || isStaging) {
        var manifest = gulp.src(DIST + '/assets/rev-manifest.json');

        return gulp.src(DIST + '/**/*.{html,xml,txt,json,css,js}')
            .pipe($.revReplace({ manifest: manifest }))
            .pipe(gulp.dest(DIST))
    }

    done()
};


//
// Dev Server
//
function server(done) {
    browser.init({
        server: DIST,
        port: PORT,
        reloadDebounce: 2000
    })

    done()
};


//
// Watch for file changes
//
function watch() {
    gulp.watch(SRC + '_assets/styles/**/*.scss').on('all', gulp.series(css))
    gulp.watch(SRC + '_assets/javascripts/**/*.js').on('all', gulp.series(js, browser.reload))
    gulp.watch(SRC + '_assets/images/**/*.{png,jpg,jpeg,gif,webp}').on('all', gulp.series(images, browser.reload))
    gulp.watch(SRC + '_assets/images/**/*.{svg}').on('all', gulp.series(svg, browser.reload))
    gulp.watch(SRC + '_assets/videos/**/*.{mp4,webm}').on('all', gulp.series(videos, browser.reload))
    gulp.watch([SRC + '**/*.{html,xml,json,txt,md,yml}', './_config.yml', SRC + '_includes/svg/*']).on('all', gulp.series('build', browser.reload))
}


// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// Deployment
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

//
// gulp deploy --live
// gulp deploy --beta
// gulp deploy --gamma
//
gulp.task('deploy', (done) => {

    if (($.util.env.live || $.util.env.beta || $.util.env.gamma) === true ) {
        console.log($.util.colors.gray("        ------------------------------------------"))
        console.log($.util.colors.green('                    Deploying to ' + ($.util.env.live ? 'Live' : $.util.env.beta ? 'Beta' : 'Gamma') + '... '))
        console.log($.util.colors.gray("        ------------------------------------------"))
    } else {
        console.log($.util.colors.red('\nHold your horses! You need to specify a deployment target like so: gulp deploy --beta. Possible targets are: --live, --beta, --gamma\n'))

        done()

        return
    }

    // create publisher, define config
    if ($.util.env.live === true) {
        var publisher = $.awspublish.create({
                params: { "Bucket": S3BUCKET },
                "accessKeyId": process.env.AWS_ACCESS_KEY,
                "secretAccessKey": process.env.AWS_SECRET_KEY,
                "region": S3REGION
        })
    } else if ($.util.env.beta === true) {
        var publisher = $.awspublish.create({
                params: { "Bucket": S3BUCKET_BETA },
                "accessKeyId": process.env.AWS_BETA_ACCESS_KEY,
                "secretAccessKey": process.env.AWS_BETA_SECRET_KEY,
                "region": S3REGION_BETA
        })
    } else if ($.util.env.gamma === true) {
        var publisher = $.awspublish.create({
                params: { "Bucket": S3BUCKET_GAMMA },
                "accessKeyId": process.env.AWS_GAMMA_ACCESS_KEY,
                "secretAccessKey": process.env.AWS_GAMMA_SECRET_KEY,
                "region": S3REGION_GAMMA
        })
    }

    return gulp.src(DIST + '**/*')
        .pipe($.awspublishRouter({
            cache: {
                // cache for 5 minutes by default
                cacheTime: 300
            },
            routes: {
                // all static assets, cached & gzipped
                '^assets/(?:.+)\\.(?:js|css|png|jpg|jpeg|gif|ico|svg|ttf|eot|woff|woff2)$': {
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

                // all pdf files, not cached
                '^.+\\.pdf': {
                    cacheTime: 0
                },

                // font mime types
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
        }))
})
