import { ISimpleListCell } from "azure-devops-ui/List";
import { IStatusProps, Status, Statuses, StatusSize } from "azure-devops-ui/Status";
import {
    ISimpleTableCell
} from "azure-devops-ui/Table";
import { css } from "azure-devops-ui/Util";
import * as React from "react";


export interface ITableItem extends ISimpleTableCell {
    action: ISimpleListCell;
    resources: number;
    outputs: number;
}

interface IconSelector {
    statusProps: IStatusProps;
    label: string;
}

export const renderNoChange = (className?: string) => {
    return (
        <Status
            {...Statuses.Success}
            ariaLabel="no changes"
            className={css(className, "bolt-table-status-icon")}
            size={StatusSize.s}
        />
    );
};

export const renderAdd = (className?: string) => {
    return (
        <Status
            {...Statuses.Information}
            ariaLabel="to add"
            className={css(className, "bolt-table-status-icon")}
            size={StatusSize.m}
        />
    );
};

export const renderChange = (className?: string) => {
    return (
        <Status
            {...Statuses.Warning}
            ariaLabel="to change"
            className={css(className, "bolt-table-status-icon")}
            size={StatusSize.m}
        />
    );
};

export const renderDestroy = (className?: string) => {
    return (
        <Status
            {...Statuses.Failed}
            ariaLabel="to destroy"
            className={css(className, "bolt-table-status-icon")}
            size={StatusSize.m}
        />
    );
};
