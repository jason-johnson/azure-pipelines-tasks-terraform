/**
 * Interface for plan change summary
 */
export interface PlanChangeSummary {
    hasChanges: boolean;
    add: number;
    change: number;
    destroy: number;
}

/**
 * Parse terraform show -json output to detect changes
 */
export function parsePlanJson(jsonOutput: string): PlanChangeSummary {
    try {
        // Remove any EOL characters that might be in the JSON
        const cleanJson = jsonOutput.replace(/(\r\n|\r|\n|\\n|\t|\\")/gm, "");
        const planData = JSON.parse(cleanJson);
        
        let add = 0;
        let change = 0;
        let destroy = 0;
        
        if (planData.resource_changes) {
            for (const resourceChange of planData.resource_changes) {
                if (resourceChange.change && resourceChange.change.actions) {
                    const actions = resourceChange.change.actions;
                    
                    // Terraform can have multiple actions for a resource
                    // e.g., ["delete", "create"] for replace
                    if (actions.includes("create") && actions.includes("delete")) {
                        // Replace counts as both destroy and create
                        change++;
                    } else if (actions.includes("create")) {
                        add++;
                    } else if (actions.includes("update")) {
                        change++;
                    } else if (actions.includes("delete")) {
                        destroy++;
                    }
                    // "no-op" and "read" actions don't count as changes
                }
            }
        }
        
        const hasChanges = (add + change + destroy) > 0;
        
        return {
            hasChanges,
            add,
            change,
            destroy
        };
    } catch (error) {
        throw new Error(`Failed to parse plan JSON: ${error}`);
    }
}

/**
 * Format plan summary for display
 */
export function formatPlanSummary(summary: PlanChangeSummary, planName: string): string[] {
    const messages: string[] = [];
    
    if (!summary.hasChanges) {
        messages.push(`Plan '${planName}' has no changes. Infrastructure is up-to-date.`);
    } else {
        if (summary.add > 0) {
            messages.push(`Plan '${planName}' is going to create ${summary.add} resource${summary.add > 1 ? 's' : ''}.`);
        }
        if (summary.change > 0) {
            messages.push(`Plan '${planName}' is going to update ${summary.change} resource${summary.change > 1 ? 's' : ''}.`);
        }
        if (summary.destroy > 0) {
            messages.push(`Plan '${planName}' is going to destroy ${summary.destroy} resource${summary.destroy > 1 ? 's' : ''}.`);
        }
    }
    
    return messages;
}
