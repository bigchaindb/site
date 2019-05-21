'use strict'

// load plugins
const $ = require('gulp-load-plugins')()

// manually import modules that won't get picked up by gulp-load-plugins
import { src, dest, watch, parallel, series } from 'gulp'
import del          from 'del'
import parallelize  from 'concurrent-transform'
import browser      from 'browser-sync'
import critical     from 'critical'
import fs           from 'fs'
import yaml         from 'js-yaml'
import request      from 'request'

// required to get our mix of old and ES6+ js to work with ugify-js 3
import uglifyjs     from 'uglify-es'
import composer     from 'gulp-uglify/composer'
const minify = composer(uglifyjs, console)
const cp = require('child_process')

// get all the configs: `pkg` and `site`
import pkg from './package.json'
const site = yaml.safeLoad(fs.readFileSync('./_config.yml'))

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

// paths
const SRC      = site.source,
      DIST     = site.destination

// deployment
const S3_BUCKET_LIVE     = 'www.bigchaindb.com',
      S3_BUCKET_BETA     = 'beta.bigchaindb.com',
      S3_BUCKET_GAMMA    = 'gamma.bigchaindb.com',
      S3_OPTIONS_DEFAULT = '--delete --acl public-read',
      S3_OPTIONS_CACHING = '--cache-control max-age=2592000,public'

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
    ' ** <%= pkg.name %>',
    ' ** <%= pkg.description %>',
    ' ** <%= pkg.homepage %>',
    ' **',
    ' ** <%= pkg.author.name %> <<%= pkg.author.email %>>',
    ' **/',
    ''
].join('\n')


// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// Tasks
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

//
// Delete build artifacts
//
export const clean = () =>
    del([
        DIST + '/**/*',
        DIST + '/.*' // delete all hidden files
    ])


//
// Jekyll
//
export const jekyll = (done) => {

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

    const jekyll = cp.execFile('bundle', ['exec', jekyll_options], { stdio: 'inherit' })

    const jekyllLogger = (buffer) => {
        buffer.toString()
            .split(/\n/)
            .forEach((message) => console.log(message))
    }

    jekyll.stdout.on('data', jekyllLogger).on('close', done)
}


//
// HTML
//
export const html = () => src(DIST + '/**/*.html')
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
    .pipe(dest(DIST))


//
// Styles
//
export const css = () => src(SRC + '/_assets/styles/bigchain.scss')
    .pipe($.if(!(isProduction || isStaging), $.sourcemaps.init()))
    .pipe($.sass({
        includePaths: [__dirname + '/node_modules']
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer())
    .pipe($.if(isProduction || isStaging, $.cleanCss()))
    .pipe($.if(!(isProduction || isStaging), $.sourcemaps.write()))
    .pipe($.if(isProduction || isStaging, $.header(BANNER, { pkg: pkg })))
    .pipe($.rename({ suffix: '.min' }))
    .pipe(dest(DIST + '/assets/css/'))
    .pipe(browser.stream())

// inline critical-path CSS
export const criticalCss = (done) => {
    if (isProduction || isStaging) {
        critical.generate({
            base: DIST,
            src: 'index.html',
            dest: 'index.html',
            inline: true,
            minify: true,
            dimensions: [{
                height: 320,
                width: 640
            }, {
                height: 600,
                width: 800
            }, {
                height: 900,
                width: 1360
            }]
        })
    }
    done()
}


//
// JavaScript
//
export const js = () =>
    src([
        SRC + '/_assets/javascripts/bigchain.js',
        SRC + '/_assets/javascripts/page-*.js'
    ])
    //.pipe($.if(!(isProduction || isStaging), $.sourcemaps.init()))
    .pipe($.include({
        includePaths: ['node_modules', SRC + '/_assets/javascripts']
    })).on('error', onError)
    .pipe($.if(isProduction || isStaging, minify())).on('error', onError)
    // .pipe($.if(!(isProduction || isStaging), $.sourcemaps.write()))
    .pipe($.if(isProduction || isStaging, $.header(BANNER, { pkg: pkg })))
    .pipe($.rename({suffix: '.min'}))
    .pipe(dest(DIST + '/assets/js/'))


//
// SVG sprite
//
export const svg = () => src(SRC + '/_assets/images/*.svg')
    .pipe($.if(isProduction || isStaging, $.imagemin({
        svgoPlugins: [{ removeRasterImages: true }]
    })))
    .pipe($.svgSprite(SPRITECONFIG))
    .pipe(dest(DIST + '/assets/img/'))


//
// Copy Images
//
export const images = () => src(SRC + '/_assets/images/**/*')
    .pipe($.if(isProduction || isStaging, $.imagemin([
    	$.imagemin.gifsicle({ interlaced: true }),
    	$.imagemin.jpegtran({ progressive: true }),
    	$.imagemin.optipng({ optimizationLevel: 5 }),
    	$.imagemin.svgo({plugins: [{ removeViewBox: true }]})
    ])))
    .pipe(dest(DIST + '/assets/img/'))


//
// Copy Fonts
//
export const fonts = () => src(SRC + '/_assets/fonts/**/*')
    .pipe(dest(DIST + '/assets/fonts/'))


//
// Zip up media kit
//
export const mediakit = () => src(SRC + '/mediakit/**/*', { base: SRC })
    .pipe($.zip('mediakit.zip'))
    .pipe(dest(DIST))


//
// Revision static assets
//
export const rev = (done) => {
    // globbing is slow so do everything conditionally for faster dev build
    if (isProduction || isStaging) {
        return src(DIST + '/assets/**/*.{css,js,png,jpg,jpeg,svg,eot,ttf,woff,woff2}')
            .pipe($.rev())
            .pipe(dest(DIST + '/assets/'))
            // output rev manifest for next replace task
            .pipe($.rev.manifest())
            .pipe(dest(DIST + '/assets/'))
    }
    done()
}


//
// Replace all links to assets in files
// from a manifest file
//
export const revReplace = (done) => {
    // globbing is slow so do everything conditionally for faster dev build
    if (isProduction || isStaging) {
        let manifest = src(DIST + '/assets/rev-manifest.json')

        return src(DIST + '/**/*.{html,css,js}')
            .pipe($.revReplace({ manifest: manifest }))
            .pipe(dest(DIST))
    }
    done()
}


//
// Dev Server
//
export const server = (done) => {
    browser.init({
        server: DIST,
        port: PORT,
        reloadDebounce: 2000
    })
    done()
}


//
// Watch for file changes
//
export const watchSrc = () => {
    watch(SRC + '/_assets/styles/**/*.scss').on('all', series(css))
    watch(SRC + '/_assets/javascripts/**/*.js').on('all', series(js, browser.reload))
    watch(SRC + '/_assets/images/**/*.{png,jpg,jpeg,gif,webp}').on('all', series(images, browser.reload))
    watch(SRC + '/_assets/images/**/*.{svg}').on('all', series(svg, browser.reload))
    watch([SRC + '/**/*.{html,xml,json,txt,md,yml}', './*.yml', SRC + '/_includes/svg/*']).on('all', series('build', browser.reload))
}


//
// Build banner
//
const buildBanner = (done) => {
    console.log($.util.colors.gray("         ------------------------------------------"))
    console.log($.util.colors.green('                Building ' + ($.util.env.production ? 'production' : $.util.env.staging ? 'staging' : 'dev') + ' version...'))
    console.log($.util.colors.gray("         ------------------------------------------"))

    done()
}


//
// Deploy banner
//
const deployBanner = (done) => {
    if (($.util.env.live || $.util.env.beta || $.util.env.gamma) === true ) {
        console.log($.util.colors.gray("        ------------------------------------------"))
        console.log($.util.colors.green('                    Deploying to ' + ($.util.env.live ? 'Live' : $.util.env.beta ? 'Beta' : 'Gamma') + '... '))
        console.log($.util.colors.gray("        ------------------------------------------"))
    } else {
        console.log($.util.colors.red('\nHold your horses! You need to specify a deployment target like so: gulp deploy --beta. Possible targets are: --live, --beta, --gamma\n'))
    }
    done()
}


// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// Collection tasks
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

//
// Full build
//
// `gulp build` is the development build
// `gulp build --production` is the production build
//
export const build = series(buildBanner, clean, jekyll, parallel(html, css, js, images, fonts, svg, mediakit), rev, revReplace, criticalCss)

//
// Build site, run server, and watch for file changes
//
// `gulp dev`
//
export const dev = series(build, server, watchSrc)

// Set `gulp dev` as default: `gulp`
export default dev


// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// Deployment
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

//
// gulp deploy --live
// gulp deploy --beta
// gulp deploy --gamma
//
export const s3 = (cb) => {
    let S3_BUCKET_TARGET

    if ($.util.env.live === true) {
        S3_BUCKET_TARGET = S3_BUCKET_LIVE
    } else if ($.util.env.beta === true) {
        S3_BUCKET_TARGET = S3_BUCKET_BETA
    } else if ($.util.env.gamma === true) {
        S3_BUCKET_TARGET = S3_BUCKET_GAMMA
    }

    cp.exec(`aws s3 sync ${DIST} s3://${S3_BUCKET_TARGET} --exclude "assets/*" ${S3_OPTIONS_DEFAULT}`, (err) => cb(err))
    cp.exec(`aws s3 sync ${DIST} s3://${S3_BUCKET_TARGET} --exclude "*" --include "assets/*" ${S3_OPTIONS_DEFAULT} ${S3_OPTIONS_CACHING}`, (err) => cb(err))
}


//
// Ping search engines on live deployment
//
export const seo = (done) => {

    const googleUrl = 'http://www.google.com/webmasters/tools/ping?sitemap=',
          bingUrl   = 'http://www.bing.com/webmaster/ping.aspx?siteMap='

    const response = (error, response) => {
        if (error) {
            $.util.log($.util.colors.red(error))
        } else {
            $.util.log($.util.colors.gray('Status:', response && response.statusCode))

            if (response.statusCode === 200) {
                $.util.log($.util.colors.green('Successfully notified'))
            }
        }
    }

    if ($.util.env.live === true) {
        request(googleUrl + site.url + '/sitemap.xml', response)
        request(bingUrl + site.url + '/sitemap.xml', response)
    }

    done()
}


//
// `gulp deploy`
//
export const deploy = series(deployBanner, s3, seo)
