export interface Attachment {
    name: string;
    type: string;
    content: string;
}

export interface IAttachmentService {
    getAttachments(type: string): Promise<Attachment[]>
}

export { default as AzdoAttachmentService } from './azdo-attachment-service';
export { default as MockAttachmentService } from './mock-attachment-service';