import * as SDK from "azure-devops-extension-sdk";
import { Attachment, IAttachmentService } from "./index";
import { CommonServiceIds, getClient, IProjectInfo, IProjectPageService } from "azure-devops-extension-api";
import { Build, BuildRestClient, BuildServiceIds, IBuildPageDataService, Timeline } from "azure-devops-extension-api/Build";
import urlparse from 'url-parse';

interface ThisBuild {
    project: IProjectInfo,
    buildId: number,
    build: Build,
    timeline: Timeline,
}

interface AzdoAttachment {
    projectId: string,
    buildId: number,
    timelineId: string,
    recordId: string,
    name: string,
    href: string,
    type: string
}

export default class AzdoAttachmentService implements IAttachmentService {
    private readonly buildClient: BuildRestClient;

    constructor(private readonly taskId: string) {
        this.buildClient = getClient(BuildRestClient)
    }

    async getAttachments(type: string): Promise<Attachment[]> {
        const attachments: Attachment[] = [];
        const build = await this.getThisBuild();
        const azdoAttachments = await this.getPlanAttachmentNames(build.project.id, build.buildId, type);

        //todo: refactor this to utilize promise.all
        for (const a of azdoAttachments) {
            const content = await this.getAttachmentContent(a);
            attachments.push({
                name: a.name,
                type: a.type,
                content
            });
        }

        return attachments;
    }

    private async getThisBuild(): Promise<ThisBuild> {
        const projectService = await SDK.getService<IProjectPageService>(CommonServiceIds.ProjectPageService)
        const buildService = await SDK.getService<IBuildPageDataService>(BuildServiceIds.BuildPageDataService)
        const projectFromContext = await projectService.getProject()
        const buildFromContext = await buildService.getBuildPageData() //requires await to work eventhough does not return Promise

        if (!projectFromContext || !buildFromContext) {
            throw new Error('Not running in AzureDevops context.')
        } else {
            console.log(`Running for project ${projectFromContext.id} and build ${buildFromContext.build?.id.toString()}`)
        }

        if (!buildFromContext.build?.id) {
            console.log("Cannot get build id.")
            throw new Error('Cannot get build from page data')
        }

        const buildId = buildFromContext.build.id
        const build = await this.buildClient.getBuild(projectFromContext.name, buildId);
        const timeline = await this.buildClient.getBuildTimeline(projectFromContext.name, buildId);

        return {
            project: projectFromContext,
            buildId: buildId,
            build: build,
            timeline: timeline
        }
    }

    private async getPlanAttachmentNames(project: string, buildId: number, attachmentType: string): Promise<AzdoAttachment[]> {
        const attachments = await this.buildClient.getAttachments(
            project,
            buildId,
            attachmentType
        )

        return attachments.map(a => {
            const attachmentUrl = urlparse(a._links.self.href);
            const isVSTSUrl = attachmentUrl.hostname.includes('visualstudio.com')
            const segments = attachmentUrl.pathname.split('/');
            if(isVSTSUrl){
                return <AzdoAttachment>{
                    projectId: segments[1],
                    buildId: Number.parseInt(segments[5]),
                    timelineId: segments[6],
                    recordId: segments[7],
                    name: a.name,
                    type: attachmentType,
                    href: a._links.self.href
                }
            }
            
            return <AzdoAttachment>{
                projectId: segments[2],
                buildId: Number.parseInt(segments[6]),
                timelineId: segments[7],
                recordId: segments[8],
                name: a.name,
                type: attachmentType,
                href: a._links.self.href
            }
        });
    }

    private async getAttachmentContent(attachment: AzdoAttachment): Promise<string> {
        let content: string | undefined
        try {
            content = await this.getAttachment(attachment)
        } catch (e) {
            throw new Error(`Failed to download plain plan: ${e}`)
        }

        return content;
    }

    private async getAttachment(attachment: AzdoAttachment): Promise<string> {
        const content = await this.buildClient.getAttachment(
            attachment.projectId,
            attachment.buildId,
            attachment.timelineId,
            attachment.recordId,
            attachment.type,
            attachment.name)
        const td = new TextDecoder()
        return td.decode(content)
    }
}
