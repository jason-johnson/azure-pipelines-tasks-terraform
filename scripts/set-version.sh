#!/bin/bash
echo "Updating Version to 1.0.3"
SED="sed"

if [[ "$OSTYPE" == "darwin"* ]]; then
	SED="gsed"
fi
${SED} -i 's/#{GitVersion.Major}#/1/g' ./.dist/task.json
${SED} -i 's/#{GitVersion.Minor}#/0/g' ./.dist/task.json
${SED} -i 's/#{GitVersion.Patch}#/3/g' ./.dist/task.json

