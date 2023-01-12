#/bin/bash
set -e

# polls until the provided task id is available in the target org/service-url.

task_id=
token=
service_url=
attempts=0
max=25

while getopts t:s:c: flag; do
    case "${flag}" in
        t) token="${OPTARG}";;
        s) service_url="${OPTARG}";;
        c) task_id="${OPTARG}";;
    esac
done
until $(tfx build tasks list --service-url $service_url -t $token --no-color --json |  jq -r --arg t "$task_id" '.[] | select(.id == $t) | .id' | grep -q "$task_id");
do
    if [ $attempts -gt $max ]
    then
        echo "wait limit reached! exiting..."
        exit 0;
    else
        echo "waiting for task to become available..."        
        sleep $(( attempts++ ));
    fi
done

echo "task is available!"