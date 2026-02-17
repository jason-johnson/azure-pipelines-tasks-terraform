import { default as AnsiUp } from 'ansi_up';
import { Card } from "azure-devops-ui/Card";
import { ObservableArray, ObservableValue } from "azure-devops-ui/Core/Observable";
import { Dropdown } from "azure-devops-ui/Dropdown";
import { DropdownSelection } from "azure-devops-ui/Utilities/DropdownSelection";
import { Observer } from "azure-devops-ui/Observer";
import * as React from "react";
import "./plan-summary-tab.scss";
import { IListBoxItem } from 'azure-devops-ui/ListBox';
import { IAttachmentService } from '../services/attachments';

interface TerraformPlan {
    name: string,
    plan: string,
}

export const NoPublishedPlanMessage = "No terraform plans have been published for this pipeline run. The terraform cli task must run plan with <code>publishPlanResults: string</code> (where string represents the plan name) to view plans.";
export const LoadingMessage = "Loading terraform plans...";

export default class TerraformPlanDisplay extends React.Component<{ attachments: IAttachmentService }> {

    private readonly attachments: IAttachmentService
    private readonly terraformPlanAttachmentType: string = "terraform-plan-results"

    private plansLoaded = new ObservableValue(false);
    private planSelection = new DropdownSelection();
    private chosenPlan = new ObservableValue(-1);
    private plans = new ObservableArray<TerraformPlan>([]);

    constructor(props: { attachments: IAttachmentService } | Readonly<{ attachments: IAttachmentService }>) {
        super(props)
        this.attachments = props.attachments        
    }

    public async componentDidMount() {

        let foundPlans: TerraformPlan[] = [];
        
        const attachments = await this.attachments.getAttachments(this.terraformPlanAttachmentType);
        attachments?.forEach(attachment => {
            foundPlans.push({ name: attachment.name, plan: attachment.content});
        });
        
        // Sort plans alphabetically (case-insensitive)
        foundPlans.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));

        this.plans.change(0, ...foundPlans)
        const initialSelection = foundPlans.length - 1
        this.planSelection.select(initialSelection)
        this.chosenPlan.value = initialSelection
        this.plansLoaded.value = true;
    }

    public render(): JSX.Element {


        return (
            <div>
                <Card className="flex-grow flex-column"
                    titleProps={{ text: "Terraform plan output" }}>

                    <Observer chosenPlan={this.chosenPlan} plans={this.plans} plansLoaded={this.plansLoaded}>
                        {(props: { chosenPlan: number, plans: TerraformPlan[], plansLoaded: boolean }) => {
                            const planItems = props.plans.map((e: TerraformPlan, index: number) => {
                                return {
                                    id: index.toString(),
                                    text: e.name
                                }
                            });

                            let html = NoPublishedPlanMessage;

                            if (!props.plansLoaded) {
                                html = LoadingMessage;
                            }
                            
                            if (props.chosenPlan > -1) {
                                const ansi_up = new AnsiUp()
                                const planText = props.plans[props.chosenPlan].plan;
                                html = `<pre>${ansi_up.ansi_to_html(planText)}</pre>`
                            }

                            let dropDown = props.plans.length > 1 ? (
                                <div className="flex-row">
                                    <Dropdown
                                        ariaLabel="Basic"
                                        className="example-dropdown"
                                        placeholder="Select an Option"
                                        items={planItems}
                                        selection={this.planSelection}
                                        onSelect={this.onSelect}
                                    />
                                </div>) : null

                            return (
                                <div className="flex-column">
                                    {dropDown}
                                    <div className="flex-row">
                                        <div dangerouslySetInnerHTML={{ __html: html }} />
                                    </div>
                                </div>
                            )
                        }}
                    </Observer>
                </Card>
            </div>
        )
    }

    private onSelect = (event: React.SyntheticEvent<HTMLElement>, item: IListBoxItem<{}>) => {
        this.chosenPlan.value = parseInt(item.id);
    };
}