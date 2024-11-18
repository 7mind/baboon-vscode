#!/usr/bin/env bash

set -xe

npm version patch
vsce publish
git push
