Feature: terraform test

    terraform test [options] [dir]

        Scenario: test without command options
        Given terraform exists
        And terraform command is "test"
        And running command "terraform test" returns successful result
        When the terraform cli task is run
        Then the terraform cli task executed command "terraform test"
        And the terraform cli task is successful
        And pipeline variable "TERRAFORM_LAST_EXITCODE" is set to "0"

        Scenario: test with command options
        Given terraform exists
        And terraform command is "test" with options "-verbose -filter=test_module.tftest.hcl"
        And running command "terraform test -verbose -filter=test_module.tftest.hcl" returns successful result
        When the terraform cli task is run
        Then the terraform cli task executed command "terraform test -verbose -filter=test_module.tftest.hcl"
        And the terraform cli task is successful
        And pipeline variable "TERRAFORM_LAST_EXITCODE" is set to "0"

        Scenario: test with json output
        Given terraform exists
        And terraform command is "test" with options "-json"
        And running command "terraform test -json" returns successful result
        When the terraform cli task is run
        Then the terraform cli task executed command "terraform test -json"
        And the terraform cli task is successful
        And pipeline variable "TERRAFORM_LAST_EXITCODE" is set to "0"

        Scenario: test with test-directory option
        Given terraform exists
        And terraform command is "test" with options "-test-directory=./custom-tests"
        And running command "terraform test -test-directory=./custom-tests" returns successful result
        When the terraform cli task is run
        Then the terraform cli task executed command "terraform test -test-directory=./custom-tests"
        And the terraform cli task is successful
        And pipeline variable "TERRAFORM_LAST_EXITCODE" is set to "0"

        Scenario: test fails
        Given terraform exists
        And terraform command is "test"
        And running command "terraform test" fails with error "test failed"
        When the terraform cli task is run
        Then the terraform cli task executed command "terraform test"
        And the terraform cli task fails with message "test failed"
        And pipeline variable "TERRAFORM_LAST_EXITCODE" is set to "1"
