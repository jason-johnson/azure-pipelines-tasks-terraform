Feature: terraform show

    terraform show [options] [file]

        Scenario: show tf state file
        Given terraform exists
        And terraform command is "show"
        And running command "terraform show -json show.tfstate" returns successful result with stdout from file "./src/tests/stdout_tf_show_tfstate_version_only.json"
        And the target plan or state file is "show.tfstate"
        When the terraform cli task is run
        Then the terraform cli task executed command "terraform show -json show.tfstate"
        And the terraform cli task is successful
        And pipeline variable "TERRAFORM_LAST_EXITCODE" is set to "0" as output
        And pipeline variable "TERRAFORM_PLAN_HAS_DESTROY_CHANGES" is not set

        Scenario: show without plan or state file
        Given terraform exists
        And terraform command is "show"
        And running command "terraform show -json" returns successful result with stdout from file "./src/tests/stdout_tf_show_tfstate_version_only.json"
        When the terraform cli task is run
        Then the terraform cli task executed command "terraform show -json"
        And the terraform cli task is successful
        And pipeline variable "TERRAFORM_LAST_EXITCODE" is set to "0" as output
        And pipeline variable "TERRAFORM_PLAN_HAS_DESTROY_CHANGES" is not set

        Scenario: show tf plan file with destroy operations
        Given terraform exists
        And terraform command is "show"
        And running command "terraform show -json show.plan" returns successful result with stdout from file "./src/tests/stdout_tf_show_tfplan_with_destroy.json"
        And the target plan or state file is "show.plan"
        When the terraform cli task is run
        Then the terraform cli task executed command "terraform show -json show.plan"
        And the terraform cli task is successful
        And pipeline variable "TERRAFORM_LAST_EXITCODE" is set to "0" as output
        And pipeline variable "TERRAFORM_PLAN_HAS_DESTROY_CHANGES" is set to "true" as output

        Scenario: show tf plan file without destroy operations
        Given terraform exists
        And terraform command is "show"
        And running command "terraform show -json show.plan" returns successful result with stdout from file "./src/tests/stdout_tf_show_tfplan_no_destroy.json"
        And the target plan or state file is "show.plan"
        When the terraform cli task is run
        Then the terraform cli task executed command "terraform show -json show.plan"
        And the terraform cli task is successful
        And pipeline variable "TERRAFORM_LAST_EXITCODE" is set to "0" as output
        And pipeline variable "TERRAFORM_PLAN_HAS_DESTROY_CHANGES" is set to "false" as output

        Scenario: show tf plan file with destroy and EOL characters
        Given terraform exists
        And terraform command is "show"
        And running command "terraform show -json show.plan" returns successful result with stdout from file "./src/tests/stdout_tf_show_tfplan_with_destroy_eol.json"
        And the target plan or state file is "show.plan"
        When the terraform cli task is run
        Then the terraform cli task executed command "terraform show -json show.plan"
        And the terraform cli task is successful
        And pipeline variable "TERRAFORM_LAST_EXITCODE" is set to "0" as output
        And pipeline variable "TERRAFORM_PLAN_HAS_DESTROY_CHANGES" is set to "true" as output

        Scenario: show tf state file with secure env file
        Given terraform exists
        And terraform command is "show"
        And the target plan or state file is "show.tfstate"
        And secure file specified with id "6b4ef608-ca4c-4185-92fb-0554b8a2ec72" and name "./src/tests/default.env"
        And running command "terraform show -json show.tfstate" returns successful result with stdout from file "./src/tests/stdout_tf_show_tfstate_version_only.json"
        When the terraform cli task is run
        Then the terraform cli task executed command "terraform show -json show.tfstate" with the following environment variables
            | TF_VAR_app-short-name | tffoo  |
            | TF_VAR_region         | eastus |
            | TF_VAR_env-short-name | dev    |
        And the terraform cli task is successful
        And pipeline variable "TERRAFORM_LAST_EXITCODE" is set to "0" as output
        And pipeline variable "TERRAFORM_PLAN_HAS_DESTROY_CHANGES" is not set

        Scenario: show tf state file with secure var file
        Given terraform exists
        And terraform command is "show"
        And the target plan or state file is "show.tfstate"
        And secure file specified with id "6b4ef608-ca4c-4185-92fb-0554b8a2ec72" and name "./src/tests/default.vars"
        And running command "terraform show -json show.tfstate" returns successful result with stdout from file "./src/tests/stdout_tf_show_tfstate_version_only.json"
        When the terraform cli task is run
        And the terraform cli task fails with message "terraform show command supports only env files, no tfvars are allowed during this stage."
        And pipeline variable "TERRAFORM_LAST_EXITCODE" is set to "1" as output
        And pipeline variable "TERRAFORM_PLAN_HAS_DESTROY_CHANGES" is not set

        Scenario: show tf plan file with output only
        Given terraform exists
        And terraform command is "show"
        And running command "terraform show -json show.plan" returns successful result with stdout from file "./src/tests/stdout_tf_show_tfplan_output_only.json"
        And the target plan or state file is "show.plan"
        When the terraform cli task is run
        Then the terraform cli task executed command "terraform show -json show.plan"
        And the terraform cli task is successful
        And pipeline variable "TERRAFORM_LAST_EXITCODE" is set to "0" as output
        And pipeline variable "TERRAFORM_PLAN_HAS_DESTROY_CHANGES" is set to "false" as output