# Contributing

## Run Unit Tests for Terraform CLI Task

1. Navigate to `cd tasks\terraform-cli`.
1. Run `npm run test`.

## Build Locally

1. Navigate to the root folder.
1. Run `npm run build`.
1. Run `npm run pack`.
1. TBC: Run `tfx extension create --rev-version --manifest-globs azure-devops-extension.json task.json --overrides-file ./configs/self.json --root ./build`.`