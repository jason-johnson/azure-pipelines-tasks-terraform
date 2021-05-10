Feature: terraform fmt

    terraform fmt [options] [dir]

        Scenario: fmt without command options
        Given terraform exists
        And terraform command is "fmt"
        And running command "terraform fmt --check --diff --recursive" returns successful result
        When the terraform cli task is run
        Then the terraform cli task executed command "terraform fmt --check --diff --recursive"
        And the terraform cli task is successful
        And pipeline variable "TERRAFORM_LAST_EXITCODE" is set to "0"

        Scenario: fmt with command options
        Given terraform exists
        And terraform command is "fmt" with options "--diff -list=false"
        And running command "terraform fmt --check --recursive --diff -list=false" returns successful result
        When the terraform cli task is run
        Then the terraform cli task executed command "terraform fmt --check --recursive --diff -list=false"
        And the terraform cli task is successful
        And pipeline variable "TERRAFORM_LAST_EXITCODE" is set to "0"

        Scenario: fmt violation fails task
        Given terraform exists
        And terraform command is "fmt"
        And running command "terraform fmt --check --diff --recursive" fails with error "invalid fmt"
        When the terraform cli task is run
        Then the terraform cli task executed command "terraform fmt --check --diff --recursive"
        And the terraform cli task fails with message "invalid fmt"
        And pipeline variable "TERRAFORM_LAST_EXITCODE" is set to "1"