#!/usr/bin/env bash
set -xe

npm run build
git diff --exit-code || (echo "git workspace not clean after npm run build" && exit 1)
