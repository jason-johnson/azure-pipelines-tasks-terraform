Feature: terraform version

   terraform version

   Scenario: terraform version 0.14.4
      Given terraform exists
      And terraform command is "version"
      And running command "terraform version" returns successful result with stdout "Terraform v0.14.4\n\r\n+ provider registry.terraform.io/hashicorp/azurerm v2.53.0\n\nYour version of Terraform is out of date! The latest version\nis 0.15.0. You can update by downloading from https://www.terraform.io/downloads.html\n"
      When the terraform cli task is run
      Then the terraform cli task executed command "terraform version"
      And the terraform cli task is successful
      And the resolved terraform version is
         | full  | 0.14.4 |
         | major | 0      |
         | minor | 14     |
         | patch | 4      |

   Scenario: terraform version 0.11.14
      Given terraform exists
      And terraform command is "version"
      And running command "terraform version" returns successful result with stdout "Terraform v0.11.14\n\nYour version of Terraform is out of date! The latest version\nis 0.15.0. You can update by downloading from www.terraform.io/downloads.html\n"
      When the terraform cli task is run
      Then the terraform cli task executed command "terraform version"
      And the terraform cli task is successful
      And the resolved terraform version is
         | full  | 0.11.14 |
         | major | 0       |
         | minor | 11      |
         | patch | 14      |

   Scenario: terraform version 0.15.0
      Given terraform exists
      And terraform command is "version"
      And running command "terraform version" returns successful result with stdout "Terraform v0.15.0\non windows_amd64\n+ provider registry.terraform.io/hashicorp/azurerm v2.53.0\n"
      When the terraform cli task is run
      Then the terraform cli task executed command "terraform version"
      And the terraform cli task is successful
      And the resolved terraform version is
         | full  | 0.15.0 |
         | major | 0      |
         | minor | 15     |
         | patch | 0      |