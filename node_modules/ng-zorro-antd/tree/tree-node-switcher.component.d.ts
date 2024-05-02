import { TemplateRef } from '@angular/core';
import { NzTreeNode, NzTreeNodeOptions } from 'ng-zorro-antd/core/tree';
import * as i0 from "@angular/core";
export declare class NzTreeNodeSwitcherComponent {
    nzShowExpand?: boolean;
    nzShowLine?: boolean;
    nzExpandedIcon?: TemplateRef<{
        $implicit: NzTreeNode;
        origin: NzTreeNodeOptions;
    }>;
    nzSelectMode: boolean;
    context: NzTreeNode;
    isLeaf?: boolean;
    isLoading?: boolean;
    isExpanded?: boolean;
    get isShowLineIcon(): boolean;
    get isShowSwitchIcon(): boolean;
    get isSwitcherOpen(): boolean;
    get isSwitcherClose(): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<NzTreeNodeSwitcherComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NzTreeNodeSwitcherComponent, "nz-tree-node-switcher", never, { "nzShowExpand": { "alias": "nzShowExpand"; "required": false; }; "nzShowLine": { "alias": "nzShowLine"; "required": false; }; "nzExpandedIcon": { "alias": "nzExpandedIcon"; "required": false; }; "nzSelectMode": { "alias": "nzSelectMode"; "required": false; }; "context": { "alias": "context"; "required": false; }; "isLeaf": { "alias": "isLeaf"; "required": false; }; "isLoading": { "alias": "isLoading"; "required": false; }; "isExpanded": { "alias": "isExpanded"; "required": false; }; }, {}, never, never, true, never>;
}
