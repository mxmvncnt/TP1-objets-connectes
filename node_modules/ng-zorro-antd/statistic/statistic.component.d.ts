/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { Direction, Directionality } from '@angular/cdk/bidi';
import { ChangeDetectorRef, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { NgStyleInterface } from 'ng-zorro-antd/core/types';
import { NzStatisticValueType } from './typings';
import * as i0 from "@angular/core";
export declare class NzStatisticComponent implements OnDestroy, OnInit {
    protected cdr: ChangeDetectorRef;
    private directionality;
    nzPrefix?: string | TemplateRef<void>;
    nzSuffix?: string | TemplateRef<void>;
    nzTitle?: string | TemplateRef<void>;
    nzValue?: NzStatisticValueType;
    nzValueStyle: NgStyleInterface;
    nzValueTemplate?: TemplateRef<{
        $implicit: NzStatisticValueType;
    }>;
    dir: Direction;
    private destroy$;
    constructor(cdr: ChangeDetectorRef, directionality: Directionality);
    ngOnInit(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<NzStatisticComponent, [null, { optional: true; }]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NzStatisticComponent, "nz-statistic", ["nzStatistic"], { "nzPrefix": { "alias": "nzPrefix"; "required": false; }; "nzSuffix": { "alias": "nzSuffix"; "required": false; }; "nzTitle": { "alias": "nzTitle"; "required": false; }; "nzValue": { "alias": "nzValue"; "required": false; }; "nzValueStyle": { "alias": "nzValueStyle"; "required": false; }; "nzValueTemplate": { "alias": "nzValueTemplate"; "required": false; }; }, {}, never, never, true, never>;
}
