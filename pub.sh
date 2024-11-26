#!/usr/bin/env bash

set -xe

npm version patch

vsce publish
npx ovsx publish

git push

