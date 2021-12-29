Feature: terraform apply for aws

  terraform apply [options] [dir]

  Scenario: apply without aws service connection
    Given terraform exists
    And terraform command is "apply"
    And running command "terraform apply -auto-approve" returns successful result
    When the terraform cli task is run
    Then the terraform cli task executed command "terraform apply -auto-approve" without the following environment variables
      | AWS_ACCESS_KEY_ID     |
      | AWS_SECRET_ACCESS_KEY |
      | AWS_REGION            |
    And the terraform cli task is successful
    And pipeline variable "TERRAFORM_LAST_EXITCODE" is set to "0"

  Scenario: apply with aws
    Given terraform exists
    And terraform command is "apply"
    And aws provider service connection "env_test_aws" exists as
      | username | foo |
      | password | bar |
    And aws provider region is configured as "us-east-1"
    And running command "terraform apply -auto-approve" returns successful result
    When the terraform cli task is run
    Then the terraform cli task executed command "terraform apply -auto-approve" with the following environment variables
      | AWS_ACCESS_KEY_ID     | foo       |
      | AWS_SECRET_ACCESS_KEY | bar       |
      | AWS_REGION            | us-east-1 |
    And the terraform cli task is successful
    And pipeline variable "TERRAFORM_LAST_EXITCODE" is set to "0"
