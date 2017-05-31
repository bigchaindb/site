# [![site](media/repo-banner@2x.png)](https://www.bigchaindb.com)

> The fabulous cat of blockchain websites.

[![Build Status](https://travis-ci.com/ascribe/bigchain-website.svg?token=3psqw6c8KMDqfdGQ2x6d&branch=master)](https://travis-ci.com/ascribe/bigchain-website)
[![css bigchaindb](https://img.shields.io/badge/css-bigchaindb-39BA91.svg)](https://github.com/bigchaindb/stylelint-config-bigchaindb)
<img src="http://forthebadge.com/images/badges/powered-by-electricity.svg" height="20"/>
<img src="http://forthebadge.com/images/badges/as-seen-on-tv.svg" height="20"/>
<img src="http://forthebadge.com/images/badges/uses-badges.svg" height="20"/>

---

[Live](https://www.bigchaindb.com) | [Styleguide](https://www.bigchaindb.com/styleguide/) | [Beta](http://beta.bigchaindb.com) | [Gamma](http://gamma.bigchaindb.com)

---

## Table of Contents

* [Development](#development)
    * [Install dependencies](#install-dependencies)
    * [Development build](#development-build)
* [Continuous deployment: always be shipping](#continuous-deployment-always-be-shipping)
* [Manual deployment](#manual-deployment)
    * [Prerequisite: authentication](#prerequisite-authentication)
    * [Staging build &amp; beta deployment](#staging-build--beta-deployment)
    * [Production build &amp; live deployment](#production-build--live-deployment)
* [Coding conventions](#coding-conventions)
    * [(S)CSS](#scss)
    * [JavaScript](#javascript)
* [Authors](#authors)

## Development

You need to have the following tools installed on your development machine before moving on:

- [node.js](http://nodejs.org/) & [npm](https://npmjs.org/)
- (optional) use [Yarn](https://yarnpkg.com) instead of npm for faster dependency installations
- [Ruby](https://www.ruby-lang.org) (for sanity, install with [rvm](https://rvm.io/))
- [Bundler](http://bundler.io/)

### Install dependencies

Run the following command from the repository's root folder to install all dependencies.

```bash
npm i && bundle install
```

or

```bash
yarn && bundle install
```

### Development build

Spin up local dev server and livereloading watch task, reachable under [https://localhost:1337](https://localhost:1337):

```bash
gulp
```

## Continuous deployment: always be shipping

![shipping](https://cloud.githubusercontent.com/assets/90316/26559768/e21e9724-44b1-11e7-90cf-6ef6ebb06d09.gif)

The site gets built & deployed automatically via Travis. This is the preferred way of deployment, it makes sure the site is always deployed with fresh dependencies and only after a successful build.

Build & deployment happens under the following conditions on Travis:

- every push builds the site
- **live deployment**: every push to the master branch initiates a live deployment
- **beta deployment**: every new pull request and every subsequent push to it initiates a beta deployment

## Manual deployment

For emergency live deployments or beta & gamma deployments, the manual method can be used. The site is hosted in an S3 bucket and gets deployed via a gulp task.

### Prerequisite: authentication

To deploy the site, you must authenticate yourself against the AWS API with your AWS credentials. Get your AWS access key and secret and add them to `~/.aws/credentials`:

```
[default]
aws_access_key_id = <YOUR_ACCESS_KEY_ID>
aws_secret_access_key = <YOUR_SECRET_ACCESS_KEY>
```

This is all that is needed to authenticate with AWS if you've setup your credentials as the default profile.

If you've set them up as another profile, say `[bigchaindb]` you can grab those credentials by using the `AWS_PROFILE` variable like so:

```bash
AWS_PROFILE=bigchaindb gulp deploy --live
```

In case that you get authentication errors or need an alternative way to authenticate with AWS, check out the [AWS documentation](http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-configuring.html).

### Staging build & beta deployment

The staging build is a full production build but prevents search engine indexing & Google Analytics tracking.

```bash
# make sure your local npm packages & gems are up to date
npm update && bundle update

# make staging build in /_dist
gulp build --staging

# deploy contents of /_dist to beta
gulp deploy --beta
```

There's also a second beta deployment target called gamma under http://gamma.bigchaindb.com:

```bash
# build preventing search engine indexing & Google Analytics tracking
gulp build --staging

# deploy contents of /_dist to gamma
gulp deploy --gamma
```


### Production build & live deployment

```bash
# make sure your local npm packages & gems are up to date
npm update && bundle update

# make production build in /_dist
gulp build --production

# deploy contents of /_dist to live
gulp deploy --live
```

## Coding conventions

### (S)CSS

Follows [stylelint-config-bigchaindb](https://github.com/bigchaindb/stylelint-config-bigchaindb) which itself extends [stylelint-config-standard](https://github.com/stylelint/stylelint-config-standard).

Lint with [stylelint](https://stylelint.io) in your editor or run:

```bash
npm test
```

### JavaScript

It's a wild mess right now between old school vanilla js, jQuery and some ES2015 features. Don't bother with the old stuff unless dependency updates break it.

New js should follow [eslint-config-ascribe](https://github.com/ascribe/javascript). Linting in this repo is not setup for it yet.

## Authors

- Matthias Kretschmann ([@kremalicious](https://github.com/kremalicious)) - [BigchainDB](https://www.bigchaindb.com)
