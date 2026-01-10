#!/usr/bin/env bash

set -xe

# vsce login SeptimalMind
# npx ovsx login SeptimalMind

npm install

npm version patch

# vsce login SeptimalMind
vsce publish

# npx ovsx login SeptimalMind
npx ovsx publish

git push

