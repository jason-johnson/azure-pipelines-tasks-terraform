Feature: terraform workspace new

    terraform workspace new [OPTIONS] [name] [DIR]

    Scenario: new workspace                
    Given terraform exists
    And terraform command is "workspace"
    And workspace command is "new" with name "bar"
    And running command "terraform workspace new bar" returns successful result with stdout from file "./src/tests/features/workspace/stdout-new-workspace-bar.txt"
    When the terraform cli task is run
    Then the terraform cli task executed command "terraform workspace new bar"
    And the terraform cli task is successful

    Scenario: new workspace with command options               
    Given terraform exists
    And terraform command is "workspace" with options "-state=terraform.tfstate"
    And workspace command is "new" with name "bar"
    And running command "terraform workspace new -state=terraform.tfstate bar" returns successful result with stdout from file "./src/tests/features/workspace/stdout-new-workspace-bar.txt"
    When the terraform cli task is run
    Then the terraform cli task executed command "terraform workspace new -state=terraform.tfstate bar"
    And the terraform cli task is successful

    Scenario: new workspace already exists
    Given terraform exists
    And terraform command is "workspace"
    And workspace command is "new" with name "bar"
    And running command "terraform workspace new bar" fails with error "\u001b[31mWorkspace \"bar\" already exists\u001b[0m\u001b[0m\n"
    When the terraform cli task is run
    Then the terraform cli task executed command "terraform workspace new bar"
    And the terraform cli task fails with message "\u001b[31mWorkspace \"bar\" already exists\u001b[0m\u001b[0m\n"
