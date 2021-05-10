import React from 'react';
import ReactDOM from "react-dom";
import * as SDK from "azure-devops-extension-sdk";
import TerraformPlanDisplay from "./plan-summary-tab/plan-summary-tab";
import { MockAttachmentService, AzdoAttachmentService, IAttachmentService } from './services/attachments';

const renderComponent = (attachments: IAttachmentService) => {
    ReactDOM.render(<TerraformPlanDisplay attachments={attachments} />, document.getElementById("root"));
}

if(process.env.TEST){
    const mockAttachments = new MockAttachmentService();
    const testData = require('./plan-summary-tab/test-data')
    mockAttachments.setAttachments(...[{
        name: 'test_deploy.tfplan',
        type: 'terraform-plan-results',
        content: testData.examplePlan1
    }, {
        name: 'stage_deploy.tfplan',
        type: 'terraform-plan-results',
        content: testData.examplePlan1
    }])
    renderComponent(mockAttachments);
}
else{    
    SDK.init().then(() => {
        const taskId: string = "721c3f90-d938-11e8-9d92-09d7594721b5"
        const azdoAttachments = new AzdoAttachmentService(taskId);
        renderComponent(azdoAttachments);
    });
}

