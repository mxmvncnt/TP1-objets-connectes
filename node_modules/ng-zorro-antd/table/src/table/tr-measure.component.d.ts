import { AfterViewInit, ElementRef, EventEmitter, NgZone, OnDestroy, QueryList } from '@angular/core';
import { NzResizeObserver } from 'ng-zorro-antd/cdk/resize-observer';
import * as i0 from "@angular/core";
export declare class NzTrMeasureComponent implements AfterViewInit, OnDestroy {
    private nzResizeObserver;
    private ngZone;
    listOfMeasureColumn: readonly string[];
    readonly listOfAutoWidth: EventEmitter<number[]>;
    listOfTdElement: QueryList<ElementRef>;
    private destroy$;
    constructor(nzResizeObserver: NzResizeObserver, ngZone: NgZone);
    trackByFunc(_: number, key: string): string;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<NzTrMeasureComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NzTrMeasureComponent, "tr[nz-table-measure-row]", never, { "listOfMeasureColumn": { "alias": "listOfMeasureColumn"; "required": false; }; }, { "listOfAutoWidth": "listOfAutoWidth"; }, never, never, true, never>;
}
