Feature: terraform force-unlock for aws

  terraform force-unlock [options] [lockID]

  Scenario: force-unlock with aws
    Given terraform exists
    And terraform command is "forceunlock"
    And aws provider service connection "env_test_aws" exists as
      | username | foo |
      | password | bar |
    And aws provider region is configured as "us-east-1"
    And force-unlock is run with lock id "3ea12870-968e-b9b9-cf3b-f4c3fbe36684"
    And running command "terraform force-unlock -force 3ea12870-968e-b9b9-cf3b-f4c3fbe36684" returns successful result
    When the terraform cli task is run
    Then the terraform cli task executed command "terraform force-unlock -force 3ea12870-968e-b9b9-cf3b-f4c3fbe36684" with the following environment variables
      | AWS_ACCESS_KEY_ID     | foo       |
      | AWS_SECRET_ACCESS_KEY | bar       |
      | AWS_REGION            | us-east-1 |
    And the terraform cli task is successful
    And pipeline variable "TERRAFORM_LAST_EXITCODE" is set to "0"
