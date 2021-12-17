Feature: terraform init on aws

  terraform init [options for aws] [dir]

  Scenario: init with aws s3 backend all parameters
    Given terraform exists
    And terraform command is "init"
    And running command "terraform version" returns successful result with stdout "Terraform v1.0.11\non windows_amd64\n+ provider registry.terraform.io/hashicorp/aws v3.65.0\n"
    And aws backend service connection "env_test_aws" exists as
      | username | foo |
      | password | bar |
    And aws backend type selected with the following bucket
      | bucket | s3trfrmeusczp                    |
      | key    | azure-pipelines-terraform/infrax |
      | region | us-east-1                        |
    And running command "terraform init" with the following options returns successful result
      | option                                               |
      | -backend-config=bucket=s3trfrmeusczp                 |
      | -backend-config=key=azure-pipelines-terraform/infrax |
      | -backend-config=region=us-east-1                     |
      | -backend-config=access_key=foo                       |
      | -backend-config=secret_key=bar                       |
    When the terraform cli task is run
    Then terraform is initialized with the following options
      | option                                               |
      | -backend-config=bucket=s3trfrmeusczp                 |
      | -backend-config=key=azure-pipelines-terraform/infrax |
      | -backend-config=region=us-east-1                     |
      | -backend-config=access_key=foo                       |
      | -backend-config=secret_key=bar                       |
    And the terraform cli task is successful
    And pipeline variable "TERRAFORM_LAST_EXITCODE" is set to "0"

  Scenario: init with aws s3 backend no region
    Given terraform exists
    And terraform command is "init"
    And running command "terraform version" returns successful result with stdout "Terraform v1.0.11\non windows_amd64\n+ provider registry.terraform.io/hashicorp/aws v3.65.0\n"
    And aws backend service connection "env_test_aws" exists as
      | username | foo |
      | password | bar |
    And aws backend type selected with the following bucket
      | bucket | s3trfrmeusczp                    |
      | key    | azure-pipelines-terraform/infrax |
    And running command "terraform init" with the following options returns successful result
      | option                                               |
      | -backend-config=bucket=s3trfrmeusczp                 |
      | -backend-config=key=azure-pipelines-terraform/infrax |
      | -backend-config=access_key=foo                       |
      | -backend-config=secret_key=bar                       |
    When the terraform cli task is run
    Then terraform is initialized with the following options
      | option                                               |
      | -backend-config=bucket=s3trfrmeusczp                 |
      | -backend-config=key=azure-pipelines-terraform/infrax |
      | -backend-config=access_key=foo                       |
      | -backend-config=secret_key=bar                       |
    And the terraform cli task is successful
    And pipeline variable "TERRAFORM_LAST_EXITCODE" is set to "0"

  Scenario: init with aws s3 backend no bucket or region
    Given terraform exists
    And terraform command is "init"
    And running command "terraform version" returns successful result with stdout "Terraform v1.0.11\non windows_amd64\n+ provider registry.terraform.io/hashicorp/aws v3.65.0\n"
    And aws backend service connection "env_test_aws" exists as
      | username | foo |
      | password | bar |
    And aws backend type selected without bucket configuration
    And running command "terraform init" with the following options returns successful result
      | option                                               |
      | -backend-config=access_key=foo                       |
      | -backend-config=secret_key=bar                       |
    When the terraform cli task is run
    Then terraform is initialized with the following options
      | option                                               |
      | -backend-config=access_key=foo                       |
      | -backend-config=secret_key=bar                       |
    And the terraform cli task is successful
    And pipeline variable "TERRAFORM_LAST_EXITCODE" is set to "0"