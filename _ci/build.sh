#!/usr/bin/env bash

set -e;

echo "$(tput setaf 136)"
echo "============================================="
echo "              Starting build "
echo "============================================="
echo "$(tput sgr0)" # reset

    gulp build --production

echo "$(tput setaf 64)" # green
echo "---------------------------------------------"
echo "           ✓ done building"
echo "---------------------------------------------"
echo "$(tput sgr0)" # reset
