import { ChangeDetectorRef, ElementRef, EventEmitter, NgZone, OnChanges, OnDestroy, OnInit, Renderer2, SimpleChange, TemplateRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { NzNoAnimationDirective } from 'ng-zorro-antd/core/no-animation';
import { NzFormatBeforeDropEvent, NzFormatEmitEvent, NzTreeBaseService, NzTreeNode, NzTreeNodeOptions } from 'ng-zorro-antd/core/tree';
import { BooleanInput } from 'ng-zorro-antd/core/types';
import * as i0 from "@angular/core";
export declare class NzTreeNodeBuiltinComponent implements OnInit, OnChanges, OnDestroy {
    nzTreeService: NzTreeBaseService;
    private ngZone;
    private renderer;
    private elementRef;
    private cdr;
    noAnimation?: NzNoAnimationDirective | undefined;
    static ngAcceptInputType_nzShowLine: BooleanInput;
    static ngAcceptInputType_nzShowExpand: BooleanInput;
    static ngAcceptInputType_nzCheckable: BooleanInput;
    static ngAcceptInputType_nzAsyncData: BooleanInput;
    static ngAcceptInputType_nzHideUnMatched: BooleanInput;
    static ngAcceptInputType_nzNoAnimation: BooleanInput;
    static ngAcceptInputType_nzSelectMode: BooleanInput;
    static ngAcceptInputType_nzShowIcon: BooleanInput;
    /**
     * for global property
     */
    icon: string;
    title: string;
    isLoading: boolean;
    isSelected: boolean;
    isDisabled: boolean;
    isMatched: boolean;
    isExpanded: boolean;
    isLeaf: boolean;
    isChecked?: boolean;
    isHalfChecked?: boolean;
    isDisableCheckbox?: boolean;
    isSelectable?: boolean;
    canHide?: boolean;
    isStart: boolean[];
    isEnd: boolean[];
    nzTreeNode: NzTreeNode;
    nzShowLine?: boolean;
    nzShowExpand?: boolean;
    nzCheckable?: boolean;
    nzAsyncData?: boolean;
    nzHideUnMatched: boolean;
    nzNoAnimation: boolean;
    nzSelectMode: boolean;
    nzShowIcon: boolean;
    nzExpandedIcon?: TemplateRef<{
        $implicit: NzTreeNode;
        origin: NzTreeNodeOptions;
    }>;
    nzTreeTemplate: TemplateRef<{
        $implicit: NzTreeNode;
        origin: NzTreeNodeOptions;
    }> | null;
    nzBeforeDrop?: (confirm: NzFormatBeforeDropEvent) => Observable<boolean>;
    nzSearchValue: string;
    nzDraggable: boolean;
    readonly nzClick: EventEmitter<NzFormatEmitEvent>;
    readonly nzDblClick: EventEmitter<NzFormatEmitEvent>;
    readonly nzContextMenu: EventEmitter<NzFormatEmitEvent>;
    readonly nzCheckBoxChange: EventEmitter<NzFormatEmitEvent>;
    readonly nzExpandChange: EventEmitter<NzFormatEmitEvent>;
    readonly nzOnDragStart: EventEmitter<NzFormatEmitEvent>;
    readonly nzOnDragEnter: EventEmitter<NzFormatEmitEvent>;
    readonly nzOnDragOver: EventEmitter<NzFormatEmitEvent>;
    readonly nzOnDragLeave: EventEmitter<NzFormatEmitEvent>;
    readonly nzOnDrop: EventEmitter<NzFormatEmitEvent>;
    readonly nzOnDragEnd: EventEmitter<NzFormatEmitEvent>;
    /**
     * drag var
     */
    destroy$: Subject<boolean>;
    dragPos: number;
    dragPosClass: {
        [key: string]: string;
    };
    draggingKey: string | null;
    showIndicator: boolean;
    /**
     * default set
     */
    get displayStyle(): string;
    get isSwitcherOpen(): boolean;
    get isSwitcherClose(): boolean;
    /**
     * collapse node
     *
     * @param event
     */
    clickExpand(event: MouseEvent): void;
    clickSelect(event: MouseEvent): void;
    dblClick(event: MouseEvent): void;
    contextMenu(event: MouseEvent): void;
    /**
     * check node
     *
     * @param event
     */
    clickCheckBox(event: MouseEvent): void;
    clearDragClass(): void;
    /**
     * drag event
     *
     * @param e
     */
    handleDragStart(e: DragEvent): void;
    handleDragEnter(e: DragEvent): void;
    handleDragOver(e: DragEvent): void;
    handleDragLeave(e: DragEvent): void;
    handleDragDrop(e: DragEvent): void;
    handleDragEnd(e: DragEvent): void;
    /**
     * Listening to dragging events.
     */
    handDragEvent(): void;
    markForCheck(): void;
    constructor(nzTreeService: NzTreeBaseService, ngZone: NgZone, renderer: Renderer2, elementRef: ElementRef<HTMLElement>, cdr: ChangeDetectorRef, noAnimation?: NzNoAnimationDirective | undefined);
    ngOnInit(): void;
    ngOnChanges(changes: {
        [propertyName: string]: SimpleChange;
    }): void;
    ngOnDestroy(): void;
    private renderIndicator;
    static ɵfac: i0.ɵɵFactoryDeclaration<NzTreeNodeBuiltinComponent, [null, null, null, null, null, { optional: true; host: true; }]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NzTreeNodeBuiltinComponent, "nz-tree-node[builtin]", ["nzTreeBuiltinNode"], { "icon": { "alias": "icon"; "required": false; }; "title": { "alias": "title"; "required": false; }; "isLoading": { "alias": "isLoading"; "required": false; }; "isSelected": { "alias": "isSelected"; "required": false; }; "isDisabled": { "alias": "isDisabled"; "required": false; }; "isMatched": { "alias": "isMatched"; "required": false; }; "isExpanded": { "alias": "isExpanded"; "required": false; }; "isLeaf": { "alias": "isLeaf"; "required": false; }; "isChecked": { "alias": "isChecked"; "required": false; }; "isHalfChecked": { "alias": "isHalfChecked"; "required": false; }; "isDisableCheckbox": { "alias": "isDisableCheckbox"; "required": false; }; "isSelectable": { "alias": "isSelectable"; "required": false; }; "canHide": { "alias": "canHide"; "required": false; }; "isStart": { "alias": "isStart"; "required": false; }; "isEnd": { "alias": "isEnd"; "required": false; }; "nzTreeNode": { "alias": "nzTreeNode"; "required": false; }; "nzShowLine": { "alias": "nzShowLine"; "required": false; }; "nzShowExpand": { "alias": "nzShowExpand"; "required": false; }; "nzCheckable": { "alias": "nzCheckable"; "required": false; }; "nzAsyncData": { "alias": "nzAsyncData"; "required": false; }; "nzHideUnMatched": { "alias": "nzHideUnMatched"; "required": false; }; "nzNoAnimation": { "alias": "nzNoAnimation"; "required": false; }; "nzSelectMode": { "alias": "nzSelectMode"; "required": false; }; "nzShowIcon": { "alias": "nzShowIcon"; "required": false; }; "nzExpandedIcon": { "alias": "nzExpandedIcon"; "required": false; }; "nzTreeTemplate": { "alias": "nzTreeTemplate"; "required": false; }; "nzBeforeDrop": { "alias": "nzBeforeDrop"; "required": false; }; "nzSearchValue": { "alias": "nzSearchValue"; "required": false; }; "nzDraggable": { "alias": "nzDraggable"; "required": false; }; }, { "nzClick": "nzClick"; "nzDblClick": "nzDblClick"; "nzContextMenu": "nzContextMenu"; "nzCheckBoxChange": "nzCheckBoxChange"; "nzExpandChange": "nzExpandChange"; "nzOnDragStart": "nzOnDragStart"; "nzOnDragEnter": "nzOnDragEnter"; "nzOnDragOver": "nzOnDragOver"; "nzOnDragLeave": "nzOnDragLeave"; "nzOnDrop": "nzOnDrop"; "nzOnDragEnd": "nzOnDragEnd"; }, never, never, true, never>;
}
