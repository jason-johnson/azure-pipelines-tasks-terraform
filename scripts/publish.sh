#/bin/bash
set -e

tasks_terraform_cli_dir=./tasks/terraform-cli
tasks_terraform_installer_dir=./tasks/terraform-installer
views_terraform_installer_dir=./views/terraform-plan
semver_full=$(gitversion | jq -r .MajorMinorPatch)
publisher=charleszipp
token=
env=beta

while getopts p:o:t:e: flag; do
    case "${flag}" in
        p) publisher="${OPTARG}";;
        o) org="${OPTARG}";;
        t) token="${OPTARG}";;
        e) env="${OPTARG}";;
    esac
done

tasks_version(){ 
    semver_major=$(gitversion | jq .Major)
    semver_minor=$(gitversion | jq .Minor)
    semver_patch=$(gitversion | jq .Patch)
    sed "s/#{GitVersion.Major}#/$semver_major/" $1/.dist/task.json |\
        sed "s/#{GitVersion.Minor}#/$semver_minor/" |\
        sed  "s/#{GitVersion.Patch}#/$semver_patch/" |\
        envsubst > $1/.dist/task_new.json 
    rm $1/.dist/task.json
    mv $1/.dist/task_new.json $1/.dist/task.json
}

tasks_terraform_cli_pack(){
    npm ci --prefix $tasks_terraform_cli_dir
    npm run build --prefix $tasks_terraform_cli_dir
    npm run pack --prefix $tasks_terraform_cli_dir
    tasks_version $tasks_terraform_cli_dir
}

tasks_terraform_installer_pack(){
    npm ci --prefix $tasks_terraform_installer_dir
    npm run build --prefix $tasks_terraform_installer_dir
    npm run pack --prefix $tasks_terraform_installer_dir    
    tasks_version $tasks_terraform_installer_dir
}

views_terraform_plan_pack(){
    npm ci --prefix $views_terraform_installer_dir
    npm run build --prefix $views_terraform_installer_dir
    npm run pack --prefix $views_terraform_installer_dir
}

extension_alpha_up(){    
    semver_full=$(gitversion | jq -r .MajorMinorPatch)
    # deploy to marketplace and share with org used for testing
    ./node_modules/.bin/tfx extension publish \
        --manifest-globs vss-extension.json vss-extension-$env.json \
        --output-path .bin \
        --override "{ \"version\" : \"$semver_full\" }" \
        -t $token \
        --share-with azure-pipelines-terraform-$env

    # install the extension into the org
    ./node_modules/.bin/tfx extension install \
        --publisher $publisher \
        --extension-id "azure-pipelines-tasks-terraform-$env" \
        --service-url "https://dev.azure.com/azure-pipelines-terraform-$env" \
        -t $token
}

extension_alpha_down(){
    # drop the extension from the marketplace
    ./node_modules/.bin/tfx extension unpublish \
        --publisher $publisher\
        --extension-id "azure-pipelines-tasks-terraform-$env" \
        -t $token

    # attempt to delete but ignore failure from not existing
    npm run delete --prefix $tasks_terraform_cli_dir -- \
        --service-url "https://dev.azure.com/azure-pipelines-terraform-$env" \
        -t $token || true
    
    # attempt to delete but ignore failure from not existing
    npm run delete --prefix $tasks_terraform_installer_dir -- \
        --service-url "https://dev.azure.com/azure-pipelines-terraform-$env" \
        -t $token || true
}

# tasks_terraform_cli_pack & \
#     tasks_terraform_installer_pack & \
#     views_terraform_plan_pack

# npm ci
extension_alpha_down

extension_alpha_up