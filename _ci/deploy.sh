#!/usr/bin/env bash

set -e;

if [ $CI_BRANCH == "master" ]; then
    gulp deploy:live
else
    gulp deploy:beta
fi;

exit;
