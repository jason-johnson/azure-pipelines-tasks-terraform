#/bin/bash
set -e

# polls until the provided task id is available in the target org/service-url.

task_id=
token=
service_url=
attempts=0
max=25

while getopts t:s:c:e:p: flag; do
    case "${flag}" in
        t) token="${OPTARG}";;
        s) service_url="${OPTARG}";;
        c) task_id="${OPTARG}";;
        e) extension_id="${OPTARG}";;
        p) publisher_id="${OPTARG}";;
    esac
done

if az extension show --name azure-devops --output none ; then
  echo "azure-devops az extension installed"
else
  az extension add --name azure-devops
fi

echo "$token" | az devops login --org $service_url
until $(az devops extension show --extension-id $extension_id --publisher-id $publisher_id | grep -q "$task_id")
do
    if [ $attempts -gt $max ]
    then
        echo "wait limit reached! exiting..."
        return 1;
    else
        echo "waiting for task to become available..."        
        sleep $(( attempts++ ));
    fi
done

echo "task is available!"
az devops logout