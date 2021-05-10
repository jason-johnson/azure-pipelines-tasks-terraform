import { Attachment, IAttachmentService } from ".";

export default class MockAttachmentService implements IAttachmentService{
    private readonly attachments: { [type: string]: Attachment[] } = {}

    setAttachments(...attachments: Attachment[]){
        attachments.forEach(attachment => {
            if(!this.attachments[attachment.type]){
                this.attachments[attachment.type] = [attachment];
            }
            else{
                this.attachments[attachment.type].push(attachment);
            }            
        });
        
    }
    async getAttachments(type: string): Promise<Attachment[]> {
        return this.attachments[type];
    }
}