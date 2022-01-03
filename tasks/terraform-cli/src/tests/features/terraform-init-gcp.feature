Feature: terraform init on gcp

  terraform init [options for aws] [dir]

  Scenario: init with gcs backend all parameters
    Given terraform exists
    And terraform command is "init"
    And running command "terraform version" returns successful result with stdout "Terraform v1.0.11\non windows_amd64\n"
    And gcs backend type selected with the following bucket
      | bucket | gcstrfrmeusczp                   |
      | prefix | azure-pipelines-terraform/infrax |
    And gcs backend credential file specified with id "2ab84611-6012-46cf-921f-7f7fb7ee27cd" and name "./src/tests/gcp-fake-key.json"
    And running command "terraform init" with the following options returns successful result
      | option                                                   |
      | -backend-config=bucket=gcstrfrmeusczp                    |
      | -backend-config=prefix=azure-pipelines-terraform/infrax  |
      | -backend-config=credentials=./src/tests/gcp-fake-key.json |
    When the terraform cli task is run
    Then terraform is initialized with the following options
      | option                                                   |
      | -backend-config=bucket=gcstrfrmeusczp                    |
      | -backend-config=prefix=azure-pipelines-terraform/infrax  |
      | -backend-config=credentials=./src/tests/gcp-fake-key.json |
    And the terraform cli task is successful
    And pipeline variable "TERRAFORM_LAST_EXITCODE" is set to "0"