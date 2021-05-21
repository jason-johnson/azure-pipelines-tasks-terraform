Feature: terraform output

    terraform output [options] [name]

        Scenario: output with variables defined
        Given terraform exists
        And terraform command is "output"
        And running command "terraform output -json" returns successful result with stdout from file "./src/tests/stdout_tf_output_all_types.json"
        And the outputType is "raw"
        When the terraform cli task is run
        Then the terraform cli task executed command "terraform output -json"
        And the terraform cli task is successful
        And pipeline variable "TERRAFORM_LAST_EXITCODE" is set to "0" as output
        And pipeline variable "TF_OUT_SOME_BOOL" is set to "true" as output
        And pipeline variable "TF_OUT_SOME_STRING" is set to "some-string-value" as output
        And pipeline secret "TF_OUT_SOME_SECRET_STRING" is set to "some-string-value" as output
        And pipeline variable "TF_OUT_SOME_NUMBER" is set to "1" as output

        Scenario: output with variables defined limited to outputName
        Given terraform exists
        And terraform command is "output"
        And running command "terraform output -json" returns successful result with stdout from file "./src/tests/stdout_tf_output_all_types.json"
        And the outputType is "raw" and outputName is "some_string"
        When the terraform cli task is run
        Then the terraform cli task executed command "terraform output -json some_string"
        And the terraform cli task is successful
        And pipeline variable "TF_OUT_SOME_STRING" is set to "some-string-value" as output

        Scenario: output with no variables defined
        Given terraform exists
        And terraform command is "output"
        And running command "terraform output -json" returns successful result with no stdout
        And the outputType is "raw"
        When the terraform cli task is run
        Then the terraform cli task executed command "terraform output -json"
        And the terraform cli task is successful
        And pipeline variable "TERRAFORM_LAST_EXITCODE" is set to "0" as output
        And no pipeline variables starting with "TF_OUT" are set

        Scenario: output with json flag defined
        Given terraform exists
        And terraform command is "output" with options "-json -no-color"
        And running command "terraform output -json -no-color" returns successful result with stdout from file "./src/tests/stdout_tf_output_string.json"
        And the outputType is "raw"
        When the terraform cli task is run
        Then the terraform cli task executed command "terraform output -json -no-color"
        And the terraform cli task is successful
        And pipeline variable "TERRAFORM_LAST_EXITCODE" is set to "0" as output
        And pipeline variable "TF_OUT_SOME_STRING" is set to "some-string-value" as output
