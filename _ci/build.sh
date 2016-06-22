#!/usr/bin/env bash

set -e;

echo "$(tput setaf 136)"
echo "============================================="
echo "              Starting build "
echo "============================================="
echo "$(tput sgr0)" # reset

if [ "$TRAVIS_BRANCH" == "master" ]; then
    gulp build --production
else
    gulp build
fi;

echo "$(tput setaf 64)" # green
echo "---------------------------------------------"
echo "           ✓ done building"
echo "---------------------------------------------"
echo "$(tput sgr0)" # reset
