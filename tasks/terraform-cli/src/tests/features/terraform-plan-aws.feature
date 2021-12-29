Feature: terraform plan for aws

  terraform plan [options] [dir]

  Scenario: plan without aws service connection
    Given terraform exists
    And terraform command is "plan"
    And running command "terraform plan" returns successful result
    When the terraform cli task is run
    Then the terraform cli task executed command "terraform plan" without the following environment variables
      | AWS_ACCESS_KEY_ID     |
      | AWS_SECRET_ACCESS_KEY |
      | AWS_REGION            |
    And the terraform cli task is successful
    And pipeline variable "TERRAFORM_LAST_EXITCODE" is set to "0"

  Scenario: plan with aws
    Given terraform exists
    And terraform command is "plan"
    And aws provider service connection "env_test_aws" exists as
      | username | foo |
      | password | bar |
    And aws provider region is configured as "us-east-1"
    And running command "terraform plan" returns successful result
    When the terraform cli task is run
    Then the terraform cli task executed command "terraform plan" with the following environment variables
      | AWS_ACCESS_KEY_ID     | foo       |
      | AWS_SECRET_ACCESS_KEY | bar       |
      | AWS_REGION            | us-east-1 |
    And the terraform cli task is successful
    And pipeline variable "TERRAFORM_LAST_EXITCODE" is set to "0"