#!/usr/bin/env bash

set -xe

npm version patch

# vsce login SeptimalMind
vsce publish

# npx ovsx login SeptimalMind
npx ovsx publish

git push

