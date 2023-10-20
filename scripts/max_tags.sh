#!/bin/bash
set -e

newestTag=$(git tag --list --sort='-version:refname' | head -n1)
newestMajor=${newestTag%%.*}

tagsarray=( $newestTag )

for i in $(seq 0 $(($newestMajor-1))); do
  tag=$(git tag --list "${i}.*" --sort='-version:refname' | head -n1)
  tagsarray+=($tag)
done

tags_string="${tagsarray[*]}"
echo "##vso[task.setvariable variable=tags;isoutput=true]${tags_string//${IFS:0:1}/,}"