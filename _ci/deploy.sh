#!/usr/bin/env bash
#
# Required global environment variables:
#
# AWS_ACCESS_KEY_ID
# AWS_SECRET_ACCESS_KEY
# AWS_DEFAULT_REGION
#

set -e;

##
## check for pull request against master
##
if [ "$TRAVIS_PULL_REQUEST" != "false" ] && [ "$TRAVIS_BRANCH" == "master" ]; then

    gulp deploy --beta;

##
## check for master push which is no pull request
##
elif [ "$TRAVIS_BRANCH" == "master" ] && [ "$TRAVIS_PULL_REQUEST" == "false" ]; then

    gulp deploy --live;

else

    echo "$(tput setaf 64)---------------------------------------------"
    echo "      ✓ nothing to deploy "
    echo "---------------------------------------------$(tput sgr0)"

fi;

echo "$(tput setaf 64)---------------------------------------------"
echo "         ✓ done deployment "
echo "---------------------------------------------$(tput sgr0)"

exit;
