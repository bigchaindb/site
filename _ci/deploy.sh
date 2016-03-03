#!/usr/bin/env bash

set -e;

if [ $CI_BRANCH == "master" ]; then
    gulp deploy:beta
fi;

exit;
