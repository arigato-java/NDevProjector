#!/bin/sh
BX_CMD=${HOME}/Bluemix_CLI/bin/bluemix
set -e
if [ -f action.zip ]; then
	unlink action.zip
fi

pushd src
npm install
zip -9r ../action.zip package.json ndevices.js node_modules
popd

$BX_CMD wsk action create njavadev --kind nodejs:6 action.zip --memory 128 --timeout 10000 --web false

