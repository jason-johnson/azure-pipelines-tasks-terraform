import { binding, given, then, when, after, before } from 'cucumber-tsflow';
import { expect } from 'chai';
import TaskRunner from './task-runner';
import { TaskAnswers } from './task-answers.steps';
import { requestedAnswers } from './mock-answer-spy';
import { TableDefinition } from 'cucumber';
import { MockTaskContext } from '../../context';
import { CommandStatus } from '../../commands';
import { _startsWith } from 'azure-pipelines-task-lib/internal';
import fs from 'fs';
import { publishedPlanAttachmentType } from '../../commands/tf-plan';


@binding([TaskRunner, MockTaskContext, TaskAnswers])
export class TerraformSteps {
    
    constructor(
        private test: TaskRunner, 
        private ctx: MockTaskContext,
        private answers: TaskAnswers) { }        

    @when("the terraform cli task is run")
    public async terraformIsExecuted(){
        await this.test.run(this.ctx, this.answers);     
    }

    @then("the terraform cli task executed command {string}")
    public assertExecutedCommand(command: string){
        const executions = requestedAnswers['exec']
        expect(executions).to.not.be.undefined;
        if(executions){
            expect(executions.indexOf(command)).to.be.greaterThan(-1);
        }
    }

    @then("terraform is initialized with the following options")
    public assertTerraformInitializedWithOptions(table: TableDefinition){
        this.assertExecutedCommandWithOptions("terraform init", table);
    }

    @then("terraform is initialized after ensure backend completes")
    public assertTerraformInitializedAfterEnsureBackend(){
        const commands = requestedAnswers["exec"];
        const terraformInitIndex = commands.findIndex((command: string) => {
            return command.startsWith("terraform init");
        })
        const commandsAfterInit = commands.slice(terraformInitIndex + 1);
        expect(commandsAfterInit).to.satisfy((cmds: string[]) => {
            return cmds.length == 0 || 
                (cmds.findIndex((cmd: string) => { return cmd.startsWith("az") }) == -1)
        })
    }

    @then("azure login is executed with the following options")
    public assertAzureLoginExecutedWithOptions(table: TableDefinition){
        this.assertExecutedCommandWithOptions("az login", table);
    }

    @then("an azure storage account is created with the following options")
    public assertAzureStorageAccountCreatedWithOptions(table: TableDefinition){
        this.assertExecutedCommandWithOptions("az storage account create", table);
    }

    @then("an azure storage account is not created")
    public assertAzureStorageAccountNotCreated(){
        const executions = requestedAnswers['exec']
            .filter((exec: string, i: number) => exec.includes("az storage account create"));
        
        expect(executions.length, "At least one execution was found that looks like storage account was created").to.be.eq(0);
    }

    @then("an azure storage container is created with the following options")
    public assertAzureStorageContainerCreatedWithOptions(table: TableDefinition){
        this.assertExecutedCommandWithOptions("az storage container create", table);
    }

    @then("the terraform cli task executed command {string} with the following options")
    public assertExecutedCommandWithOptions(command: string, table: TableDefinition){
        const args = table.rows();
        const expected = `${command} ${args.join(' ')}`

        const actual = requestedAnswers['exec'];
        expect(actual, "expected command was not found in the list of actually executed commands").to.include(expected);
    }

    @then("the terraform cli task executed command {string} with the following environment variables")
    public assertExecutedCommandWithEnvironmentVariables(command: string, table: TableDefinition){
        this.assertExecutedCommand(command);
        const expectedEnv = table.rowsHash();
        for(let key in expectedEnv){
            expect(process.env[key]).to.not.be.undefined
            expect(process.env[key]).to.eq(expectedEnv[key]);
        }
    }

    @then("the terraform cli task is successful")
    public terraformCliTaskIsSuccessful(){
        if(this.test.error){
            throw this.test.error;
        }
        else{
            expect(this.test.response).to.not.be.undefined;
            expect(this.test.error).to.be.undefined;
            if(this.test.response){
                expect(this.test.response.status).to.eq(CommandStatus.Success);
            }
        }        
    }

    @then("the terraform cli task fails with message {string}")
    public terraformCliTaskFailsWithMessage(message: string){
        if(this.test.error){
            throw this.test.error;
        }
        else{
            expect(this.test.response).to.not.be.undefined;
            expect(this.test.error).to.be.undefined;
            if(this.test.response){
                expect(this.test.response.status).to.eq(CommandStatus.Failed);
                expect(this.test.response.message).to.eq(message);
            }
        }        
    }

    @then("the terraform cli task throws error with message {string}")
    public theTerraformCliTaskThrowsError(message: string){
        expect(this.test.error).to.not.be.undefined;
        expect(this.test.response).to.be.undefined;
        if(this.test.error){
            expect(this.test.error.message).to.eq(message);
        }
    }

    @then("a plan named {string} is published with the following content from file {string}")
    public planDetailsAreAttachedWithTheFollowingContentFromFile(name: string,  filePath: string){
        const actualPlan = this.expectAttachmentContent(name);
        const expectedPlan = fs.readFileSync(filePath, 'utf-8');
        
        expect(actualPlan).to.eq(expectedPlan);
    }

    @then("no plans are published")
    public planDetailsAreNotAttached(){
        expect(this.test.taskAgent.attachedTypes[publishedPlanAttachmentType]).to.be.undefined;
    }

    @then("{int} plans are published")
    public numberOfPlansAreAttached(count: number){
        expect(Object.keys(this.test.taskAgent.attachedFiles).length).to.eq(count);
    }

    private expectAttachmentContent(name: string){
        const attachment = this.test.taskAgent.attachedFiles[name];
        expect(attachment).not.does.be.undefined;
        const content = this.test.taskAgent.writtenFiles[attachment.path];
        expect(content).not.does.be.undefined;
        return content;
    }
}