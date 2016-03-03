# BigchainDB

> Landing page for BigchainDB

[Live](https://www.bigchaindb.com) | [Beta](https://beta.bigchaindb.com) | [Styleguide](https://www.bigchaindb.com/styleguide/)

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

## Continuous Delivery

The site gets built & deployed automatically via Codeship under the following conditions:

- every push builds the site
- every push to the master branch initiates a live deployment
- every push to a branch starting with `feature` initiates a beta deployment

## Manual Deployment

The site is hosted in an S3 bucket and gets deployed via a gulp task.

### Prerequisite: Authentication

To deploy the site, you must authenticate yourself against the AWS API with your AWS credentials. Get your AWS access key and secret and add them to `~/.aws/credentials`:

```
[default]
aws_access_key_id = <YOUR_ACCESS_KEY_ID>
aws_secret_access_key = <YOUR_SECRET_ACCESS_KEY>
```

This is all that is needed to authenticate with AWS if you've setup your credentials as the default profile.

If you've set them up as another profile, say `[bigchain]` you can grab those credentials by using the `AWS_PROFILE` variable like so:

```bash
AWS_PROFILE=bigchain gulp deploy:live
```

In case that you get authentication errors or need an alternative way to authenticate with AWS, check out the [AWS documentation](http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-configuring.html).

### Production build & beta deployment

```bash
# make sure your local npm packages & gems are up to date
npm update && bundle update

# make production build in /_dist
gulp build --production

# deploy contents of /_dist to beta
gulp deploy:beta
```

### Production build & live deployment

```bash
# make sure your local npm packages & gems are up to date
npm update && bundle update

# make production build in /_dist
gulp build --production

# deploy contents of /_dist to live
gulp deploy:live
```
