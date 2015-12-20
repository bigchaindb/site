# bigchain.io

> Landing page for www.bigchain.io

## Development

You need to have the following tools installed on your development machine before moving on:

- [node.js](http://nodejs.org/) & [npm](https://npmjs.org/)
- [Ruby](https://www.ruby-lang.org) (for sanity, install with [rvm](https://rvm.io/))
- [Bundler](http://bundler.io/)

### Install dependencies

Run the following command from the repository's root folder to install all dependencies.

```bash
npm i && bundle install
```

### Development build

Spin up local dev server and livereloading watch task, reachable under [https://localhost:1337](https://localhost:1337):

```bash
gulp
```

## Deployment

### Production build

The following builds the site and runs a bunch of optimizations over everything, like assets optimizations, revisioning, CDN url injection etc.

```bash
gulp build --production
```
