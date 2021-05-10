Feature: terraform workspace select

    terraform workspace select [name] [DIR]

        Scenario: switch to existing workspace
        Given terraform exists
        And terraform command is "workspace"
        And workspace command is "select" with name "foo"
        And running command "terraform workspace select foo" returns successful result with stdout "Switched to workspace \"foo\"."
        When the terraform cli task is run
        Then the terraform cli task executed command "terraform workspace select foo"
        And the terraform cli task is successful

        Scenario: switch to workspace that doesnt exist
        Given terraform exists
        And terraform command is "workspace"
        And workspace command is "select" with name "bar"
        And running command "terraform workspace select bar" fails with error "Workspace \"bar\" doesn't exist. \n\rYou can create this workspace with the \"new\" subcommand"
        When the terraform cli task is run
        Then the terraform cli task executed command "terraform workspace select bar"
        And the terraform cli task fails with message "Workspace \"bar\" doesn't exist. \n\rYou can create this workspace with the \"new\" subcommand"

        Scenario: select current workspace        
        Given terraform exists
        And terraform command is "workspace"
        And workspace command is "select" with name "foo"
        And running command "terraform workspace select foo" returns successful result with no stdout
        When the terraform cli task is run
        Then the terraform cli task executed command "terraform workspace select foo"
        And the terraform cli task is successful


        