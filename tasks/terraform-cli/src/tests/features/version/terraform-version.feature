Feature: terraform version

   terraform version

   Scenario: terraform version 0.14.4
      Given terraform exists
      And terraform command is "version"
      And running command "terraform version" returns successful result with stdout from file "./src/tests/features/version/stdout_version_0_14_10.txt"
      When the terraform cli task is run
      Then the terraform cli task executed command "terraform version"
      And the terraform cli task is successful
      And the resolved terraform version is
         | full  | 0.14.10 |
         | major | 0       |
         | minor | 14      |
         | patch | 10      |
      And the following warnings are logged
         | Your version of Terraform is out of date! The latest version is 0.15.3. |

   Scenario: terraform version 0.11.14
      Given terraform exists
      And terraform command is "version"
      And running command "terraform version" returns successful result with stdout from file "./src/tests/features/version/stdout_version_0_11_14.txt"
      When the terraform cli task is run
      Then the terraform cli task executed command "terraform version"
      And the terraform cli task is successful
      And the resolved terraform version is
         | full  | 0.11.14 |
         | major | 0       |
         | minor | 11      |
         | patch | 14      |
      And the following warnings are logged
         | Your version of Terraform is out of date! The latest version is 0.15.3. |

   Scenario: terraform version 0.15.0
      Given terraform exists
      And terraform command is "version"
      And running command "terraform version" returns successful result with stdout from file "./src/tests/features/version/stdout_version_0_15_3.txt"
      When the terraform cli task is run
      Then the terraform cli task executed command "terraform version"
      And the terraform cli task is successful
      And the resolved terraform version is
         | full  | 0.15.3 |
         | major | 0      |
         | minor | 15     |
         | patch | 3      |
      And the following warnings are not logged
         | Your version of Terraform is out of date! The latest version is 0.15.3. |