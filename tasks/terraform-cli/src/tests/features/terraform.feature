Feature: Terraform

   terraform

   Scenario: terraform not exists
      Given terraform not exists
      And terraform command is "version"
      When the terraform cli task is run
      Then the terraform cli task fails with message "Error: Not found terraform"

   Scenario: working directory does not exist
      Given terraform exists
      And terraform command is "init"
      And the working directory does not exist
      When the terraform cli task is run
      Then the terraform cli task fails with message "Error: Working directory does not exist: \"/nonexistent-terraform-working-dir\""

   Scenario: does not fail when stderr exists and exit code is 0
      Given terraform exists
      And terraform command is "version"
      And running command "terraform version" returns the following result
         | code   | 0                     |
         | stdout | success with warnings |
         | stderr | some warning message  |
      When the terraform cli task is run
      Then the terraform cli task executed command "terraform version"
      And the terraform cli task is successful
