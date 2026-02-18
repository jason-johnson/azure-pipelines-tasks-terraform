Feature: publish plan results

    As an engineer,
    I would like the results of my terraform plan to be published to the pipeline run so that,
    I can quickly see actions terraform will apply to my infrastrucutre

    Scenario: publish plan results enabled
        Given terraform exists
        And terraform command is "plan" with options "-detailed-exitcode"
        And running command "terraform plan -detailed-exitcode -out=test_deploy.tfplan" returns successful result with exit code 2 and stdout from file "./src/tests/features/publish-plan-results/plan-output-with-adds-destroys-and-updates.txt"
        And running command "terraform show -json test_deploy.tfplan" returns successful result with stdout from file "./src/tests/features/publish-plan-results/plan-show-with-adds-destroys-and-updates.json"
        And publish plan result is "test_deploy.tfplan"
        When the terraform cli task is run
        Then the terraform cli task is successful
        And a plan named "test_deploy.tfplan" is published with the following content from file "./src/tests/features/publish-plan-results/plan-summary-with-adds-destroys-and-updates.txt"
        And the following warnings are logged
        |Plan 'test_deploy.tfplan' is going to create 1 resource.|
        |Plan 'test_deploy.tfplan' is going to update 1 resource.|
        |Plan 'test_deploy.tfplan' is going to destroy 1 resource.|

    Scenario: publish plan results enabled no changes
        Given terraform exists
        And terraform command is "plan" with options "-detailed-exitcode"
        And running command "terraform plan -detailed-exitcode -out=test_deploy.tfplan" returns successful result with exit code 0 and stdout from file "./src/tests/features/publish-plan-results/plan-output-no-changes.txt"
        And running command "terraform show -json test_deploy.tfplan" returns successful result with stdout from file "./src/tests/features/publish-plan-results/plan-show-no-changes.json"
        And publish plan result is "test_deploy.tfplan"
        When the terraform cli task is run
        Then the terraform cli task is successful
        And a plan named "test_deploy.tfplan" is published with the following content from file "./src/tests/features/publish-plan-results/plan-summary-no-changes.txt"
        And the following warnings are not logged
        |Plan 'test_deploy.tfplan' is going to create 0 resource.|
        |Plan 'test_deploy.tfplan' is going to update 0 resource.|
        |Plan 'test_deploy.tfplan' is going to destroy 0 resource.|
        And the following info messages are logged
        |Plan 'test_deploy.tfplan' has no changes. Infrastructure is up-to-date.|

    Scenario: publish plan results not specified
        Given terraform exists
        And terraform command is "plan"
        And running command "terraform plan -detailed-exitcode -out=tfplan-test.tfplan" returns successful result with exit code 2 and stdout from file "./src/tests/features/publish-plan-results/plan-output-with-adds-destroys-and-updates.txt"
        And running command "terraform show -json tfplan-test.tfplan" returns successful result with stdout from file "./src/tests/features/publish-plan-results/plan-show-with-adds-destroys-and-updates.json"
        When the terraform cli task is run
        Then the terraform cli task is successful
        And no plans are published

    Scenario: publish multiple plans
        Given terraform exists
        And terraform command is "plan" with options "-detailed-exitcode"
        And running command "terraform plan -detailed-exitcode -out=dev_deploy.tfplan" returns successful result with exit code 2 and stdout from file "./src/tests/features/publish-plan-results/plan-output-with-adds-destroys-and-updates.txt"
        And running command "terraform show -json dev_deploy.tfplan" returns successful result with stdout from file "./src/tests/features/publish-plan-results/plan-show-with-adds-destroys-and-updates.json"
        And publish plan result is "dev_deploy.tfplan"
        When the terraform cli task is run
        Then the terraform cli task is successful
        And a plan named "dev_deploy.tfplan" is published with the following content from file "./src/tests/features/publish-plan-results/plan-summary-with-adds-destroys-and-updates.txt"
        And publish plan result is "test_deploy.tfplan"
        And running command "terraform plan -detailed-exitcode -out=test_deploy.tfplan" returns successful result with exit code 2 and stdout from file "./src/tests/features/publish-plan-results/plan-output-with-1-unchanged-1-to-add.txt"
        And running command "terraform show -json test_deploy.tfplan" returns successful result with stdout from file "./src/tests/features/publish-plan-results/plan-show-with-1-add.json"
        When the terraform cli task is run
        Then the terraform cli task is successful
        And a plan named "test_deploy.tfplan" is published with the following content from file "./src/tests/features/publish-plan-results/plan-summary-with-1-unchanged-1-to-add.txt"
        And 2 plans are published

    Scenario: publish plan results with more than 9 changes
        Given terraform exists
        And terraform command is "plan" with options "-detailed-exitcode"
        And running command "terraform plan -detailed-exitcode -out=test_deploy.tfplan" returns successful result with exit code 2 and stdout from file "./src/tests/features/publish-plan-results/plan-output-with-more-than-nine-changes.txt"
        And running command "terraform show -json test_deploy.tfplan" returns successful result with stdout from file "./src/tests/features/publish-plan-results/plan-show-with-more-than-nine-changes.json"
        And publish plan result is "test_deploy.tfplan"
        When the terraform cli task is run
        Then the terraform cli task is successful
        And a plan named "test_deploy.tfplan" is published with the following content from file "./src/tests/features/publish-plan-results/plan-summary-with-more-than-nine-changes.txt"

