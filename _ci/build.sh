#!/usr/bin/env bash

set -e;

echo "$(tput setaf 136)"
echo "============================================="
echo "              Starting build "
echo "============================================="
echo "$(tput sgr0)" # reset

##
## check for pull request against master
##
if [ "$TRAVIS_PULL_REQUEST" != "false" ] && [ "$TRAVIS_BRANCH" == "master" ]; then

    export JEKYLL_ENV=betadeploy

    gulp build --production


##
## check for master push which is no pull request
##
elif [ "$TRAVIS_BRANCH" == "master" ] && [ "$TRAVIS_PULL_REQUEST" == "false" ]; then

    export JEKYLL_ENV=livedeploy

    gulp build --production

else

    gulp build --production

fi;



echo "$(tput setaf 64)" # green
echo "---------------------------------------------"
echo "           ✓ done building"
echo "---------------------------------------------"
echo "$(tput sgr0)" # reset
