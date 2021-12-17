#/bin/bash
set -xe

env=alpha
location=eastus
location_suffix=eus
org=czp

while getopts e:l:o: flag; do
    case "${flag}" in
        e) env="${OPTARG}";;
        l) location="${OPTARG}";;
        o) org="${OPTARG}";;
    esac
done

case "${location}" in
  eastus) location_suffix=eus;;
  eastus2) location_suffix=eus2;;
  westus) location_suffix=wus;;
  westus2) location_suffix=wus2;;
esac

suffix=-trfrm-${env}-${location_suffix}-${org}
suffix_no_hyphen=trfrm${env}${location_suffix}${org}
suffix_no_location=-trfrm-${env}-${org}

subscription=$(az account show --query id -o tsv)

resource_group=rg${suffix}
az group create -l $location -n $resource_group

workspace=logs${suffix_no_location}
workspace_id=/subscriptions/${subscription}/resourcegroups/${resource_group}/providers/microsoft.operationalinsights/workspaces/${workspace}
az monitor log-analytics workspace create --resource-group $resource_group --workspace-name $workspace

app_insights=ai${suffix}
az monitor app-insights component create --app $app_insights --location $location --kind web -g $resource_group --workspace $workspace_id
