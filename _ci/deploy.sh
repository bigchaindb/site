#!/usr/bin/env bash
#
# Required global environment variables:
#
# AWS_ACCESS_KEY_ID
# AWS_SECRET_ACCESS_KEY
# AWS_DEFAULT_REGION
#

set -e;

SOURCE="./_dist"
BUCKET_LIVE="www.bigchaindb.com"
BUCKET_BETA="beta.bigchaindb.com"
OPTIONS_DEFAULT="--delete --acl public-read"
OPTIONS_CACHING="--cache-control max-age=2592000,public"

##
## check for pull request against master
##
if [ "$TRAVIS_PULL_REQUEST" != "false" ] && [ "$TRAVIS_BRANCH" == "master" ]; then

    #gulp deploy --beta;

    echo "$(tput setaf 64)---------------------------------------------"
    echo "      Deploying to Beta "
    echo "---------------------------------------------$(tput sgr0)"

    aws s3 sync $SOURCE s3://$BUCKET_BETA --exclude "assets/*" $OPTIONS_DEFAULT
    aws s3 sync $SOURCE s3://$BUCKET_BETA --exclude "*" --include "assets/*" $OPTIONS_DEFAULT $OPTIONS_CACHING


##
## check for master push which is no pull request
##
elif [ "$TRAVIS_BRANCH" == "master" ] && [ "$TRAVIS_PULL_REQUEST" == "false" ]; then

    #gulp deploy --live;

    echo "$(tput setaf 64)---------------------------------------------"
    echo "      Deploying to Live "
    echo "---------------------------------------------$(tput sgr0)"

    aws s3 sync $SOURCE s3://$BUCKET_LIVE --exclude "assets/*" $OPTIONS_DEFAULT
    aws s3 sync $SOURCE s3://$BUCKET_LIVE --exclude "*" --include "assets/*" $OPTIONS_DEFAULT $OPTIONS_CACHING

    gulp seo --live

else

    echo "$(tput setaf 64)---------------------------------------------"
    echo "      ✓ nothing to deploy "
    echo "---------------------------------------------$(tput sgr0)"

fi;

echo "$(tput setaf 64)---------------------------------------------"
echo "         ✓ done deployment "
echo "---------------------------------------------$(tput sgr0)"

exit;
