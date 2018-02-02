#!/usr/bin/env bash

set -e;

##
## check for pull request against master
##
if [ "$TRAVIS_PULL_REQUEST" != "false" ] && [ "$TRAVIS_BRANCH" == "master" ]; then

    #gulp deploy --beta;
    aws s3 sync ./_dist s3://beta.bigchaindb.com --delete --acl public-read --sse


##
## check for master push which is no pull request
##
elif [ "$TRAVIS_BRANCH" == "master" ] && [ "$TRAVIS_PULL_REQUEST" == "false" ]; then

    #gulp deploy --live;
    aws s3 sync ./_dist s3://www.bigchaindb.com --delete --acl public-read --sse

else

    echo "$(tput setaf 64)" # green
    echo "---------------------------------------------"
    echo "      ✓ nothing to deploy "
    echo "---------------------------------------------"
    echo "$(tput sgr0)" # reset

fi;

echo "$(tput setaf 64)" # green
echo "---------------------------------------------"
echo "         ✓ done deployment "
echo "---------------------------------------------"
echo "$(tput sgr0)" # reset

exit;
