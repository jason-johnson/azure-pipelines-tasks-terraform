Feature: terraform state

    terraform state list [options] [address...]

        Scenario: list all resources
        Given terraform exists
        And terraform command is "state"
        And subcommand is "list"
        And the target plan or state file is "./src/tests/features/state/teraform.tfstate"
        And running command "terraform state list" returns successful result with stdout from file "./src/tests/features/state/stdout-state-list-simple.txt"
        When the terraform cli task is run
        Then the terraform cli task executed command "terraform state list"
        And the terraform cli task is successful

        Scenario: list some resources
        Given terraform exists
        And terraform command is "state"
        And state command is "list" with the following addresses:
            | random_string.a |
            | random_string.b |
        And the target plan or state file is "./src/tests/features/state/teraform.tfstate"
        And running command "terraform state list random_string.a random_string.b" returns successful result with stdout from file "./src/tests/features/state/stdout-state-list-addressed.txt"
        When the terraform cli task is run
        Then the terraform cli task executed command "terraform state list random_string.a random_string.b"
        And the terraform cli task is successful

        Scenario: mv some resources
        Given terraform exists
        And terraform command is "state"
        And subcommand is "mv"
        And state move source is "random_string.a"
        And state move destination is "random_string.d"
        And the target plan or state file is "./src/tests/features/state/teraform.tfstate"
        And running command "terraform state mv random_string.a random_string.d" returns successful result with stdout from file "./src/tests/features/state/stdout-state-move-ok.txt"
        When the terraform cli task is run
        Then the terraform cli task executed command "terraform state mv random_string.a random_string.d"
        And the terraform cli task is successful

        Scenario: mv some inexistant resources
        Given terraform exists
        And terraform command is "state"
        And subcommand is "mv"
        And state move source is "random_string.e"
        And state move destination is "random_string.a"
        And the target plan or state file is "./src/tests/features/state/teraform.tfstate"
        And running command "terraform state mv random_string.e random_string.a" fails with error "No matching objects found."
            When the terraform cli task is run
        Then the terraform cli task executed command "terraform state mv random_string.e random_string.a"
        And the terraform cli task fails with message "No matching objects found."
        And pipeline variable "TERRAFORM_LAST_EXITCODE" is set to "1"

        Scenario: remove some resources
        Given terraform exists
        And terraform command is "state"
        And state command is "rm" with the following addresses:
            | random_string.a |
            | random_string.b |
        And the target plan or state file is "./src/tests/features/state/teraform.tfstate"
        And running command "terraform state rm random_string.a random_string.b" returns successful result with stdout from file "./src/tests/features/state/stdout-state-remove.txt"
        When the terraform cli task is run
        Then the terraform cli task executed command "terraform state rm random_string.a random_string.b"
        And the terraform cli task is successful

        Scenario: remove inexistant resources
        Given terraform exists
        And terraform command is "state"
        And state command is "rm" with the following addresses:
            | random_string.e |
        And the target plan or state file is "./src/tests/features/state/teraform.tfstate"
        And running command "terraform state rm random_string.e" fails with error "Invalid target address"
        When the terraform cli task is run
        Then the terraform cli task executed command "terraform state rm random_string.e"
        And the terraform cli task fails with message "Invalid target address"
        And pipeline variable "TERRAFORM_LAST_EXITCODE" is set to "1"