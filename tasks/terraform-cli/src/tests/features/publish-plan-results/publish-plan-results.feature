Feature: publish plan results

    As an engineer,
    I would like the results of my terraform plan to be published to the pipeline run so that,
    I can quickly see actions terraform will apply to my infrastrucutre

    Scenario: publish plan results enabled
        Given terraform exists
        And terraform command is "plan" with options "-detailed-exitcode"
        And running command "terraform plan -detailed-exitcode" returns successful result with exit code 2 and stdout from file "./src/tests/features/publish-plan-results/plan-output-with-adds-destroys-and-updates.txt"
        And publish plan result is "test_deploy.tfplan"
        When the terraform cli task is run
        Then the terraform cli task is successful
        And a plan named "test_deploy.tfplan" is published with the following content from file "./src/tests/features/publish-plan-results/plan-summary-with-adds-destroys-and-updates.txt"

    Scenario: publish plan results not specified
        Given terraform exists
        And terraform command is "plan"
        And running command "terraform plan" returns successful result with stdout from file "./src/tests/features/publish-plan-results/plan-output-with-adds-destroys-and-updates.txt"
        When the terraform cli task is run
        Then the terraform cli task is successful
        And no plans are published

    Scenario: publish multiple plans
        Given terraform exists
        And terraform command is "plan" with options "-detailed-exitcode"
        And running command "terraform plan -detailed-exitcode" returns successful result with exit code 2 and stdout from file "./src/tests/features/publish-plan-results/plan-output-with-adds-destroys-and-updates.txt"
        And publish plan result is "dev_deploy.tfplan"
        When the terraform cli task is run
        Then the terraform cli task is successful
        And a plan named "dev_deploy.tfplan" is published with the following content from file "./src/tests/features/publish-plan-results/plan-summary-with-adds-destroys-and-updates.txt"
        And publish plan result is "test_deploy.tfplan"
        And running command "terraform plan -detailed-exitcode" returns successful result with exit code 2 and stdout from file "./src/tests/features/publish-plan-results/plan-output-with-1-unchanged-1-to-add.txt"
        When the terraform cli task is run
        Then the terraform cli task is successful
        And a plan named "test_deploy.tfplan" is published with the following content from file "./src/tests/features/publish-plan-results/plan-summary-with-1-unchanged-1-to-add.txt"
        And 2 plans are published

    Scenario: publish plan results with more than 9 changes
        Given terraform exists
        And terraform command is "plan" with options "-detailed-exitcode"
        And running command "terraform plan -detailed-exitcode" returns successful result with exit code 2 and stdout from file "./src/tests/features/publish-plan-results/plan-output-with-more-than-nine-changes.txt"
        And publish plan result is "test_deploy.tfplan"
        When the terraform cli task is run
        Then the terraform cli task is successful
        And a plan named "test_deploy.tfplan" is published with the following content from file "./src/tests/features/publish-plan-results/plan-summary-with-more-than-nine-changes.txt"

