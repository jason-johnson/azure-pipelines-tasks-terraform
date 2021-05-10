Feature: terraform validate

    `terraform validate [options] [dir]`

    Scenario: validate with no args
        Given terraform exists
        And terraform command is "validate"
        And running command "terraform validate" returns successful result
        When the terraform cli task is run
        Then the terraform cli task executed command "terraform validate"
        And the terraform cli task is successful
        And pipeline variable "TERRAFORM_LAST_EXITCODE" is set to "0"

    Scenario: validate fails
        Given terraform exists
        And terraform command is "validate"
        And running command "terraform validate" fails with error "validation failed"
        When the terraform cli task is run
        Then the terraform cli task executed command "terraform validate"
        And the terraform cli task fails with message "validation failed"
        And pipeline variable "TERRAFORM_LAST_EXITCODE" is set to "1"

    Scenario: validate with command options
        Given terraform exists
        And terraform command is "validate" with options "-input=true -lock=false -no-color"
        And running command "terraform validate -input=true -lock=false -no-color" returns successful result
        When the terraform cli task is run
        Then the terraform cli task executed command "terraform validate -input=true -lock=false -no-color"
        And the terraform cli task is successful
        And pipeline variable "TERRAFORM_LAST_EXITCODE" is set to "0"

    Scenario: validate with secure var file
        Given terraform exists
        And terraform command is "validate"
        And secure file specified with id "6b4ef608-ca4c-4185-92fb-0554b8a2ec72" and name "./src/tests/default.vars"
        And running command "terraform validate -var-file=./src/tests/default.vars" returns successful result
        When the terraform cli task is run
        Then the terraform cli task executed command "terraform validate -var-file=./src/tests/default.vars"
        And the terraform cli task is successful
        And pipeline variable "TERRAFORM_LAST_EXITCODE" is set to "0"

    Scenario: validate with secure env file
        Given terraform exists
        And terraform command is "validate"
        And secure file specified with id "6b4ef608-ca4c-4185-92fb-0554b8a2ec72" and name "./src/tests/default.env"
        And running command "terraform validate" returns successful result
        When the terraform cli task is run
        Then the terraform cli task executed command "terraform validate" with the following environment variables
            | TF_VAR_app-short-name | tffoo  |
            | TF_VAR_region         | eastus |
            | TF_VAR_env-short-name | dev    |
        And the terraform cli task is successful
        And pipeline variable "TERRAFORM_LAST_EXITCODE" is set to "0"