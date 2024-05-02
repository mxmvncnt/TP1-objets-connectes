/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { FocusMonitor } from '@angular/cdk/a11y';
import { Direction, Directionality } from '@angular/cdk/bidi';
import { AfterViewInit, ChangeDetectorRef, ElementRef, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { NzFormStatusService } from 'ng-zorro-antd/core/form';
import { BooleanInput, NzSafeAny, OnChangeType, OnTouchedType } from 'ng-zorro-antd/core/types';
import { NzRadioService } from './radio.service';
import * as i0 from "@angular/core";
export declare class NzRadioComponent implements ControlValueAccessor, AfterViewInit, OnDestroy, OnInit {
    private ngZone;
    private elementRef;
    private cdr;
    private focusMonitor;
    private directionality;
    private nzRadioService;
    nzFormStatusService?: NzFormStatusService | undefined;
    static ngAcceptInputType_nzDisabled: BooleanInput;
    static ngAcceptInputType_nzAutoFocus: BooleanInput;
    private isNgModel;
    private destroy$;
    private isNzDisableFirstChange;
    isChecked: boolean;
    name: string | null;
    onChange: OnChangeType;
    onTouched: OnTouchedType;
    inputElement: ElementRef<HTMLInputElement>;
    nzValue: NzSafeAny | null;
    nzDisabled: boolean;
    nzAutoFocus: boolean;
    isRadioButton: boolean;
    dir: Direction;
    focus(): void;
    blur(): void;
    constructor(ngZone: NgZone, elementRef: ElementRef, cdr: ChangeDetectorRef, focusMonitor: FocusMonitor, directionality: Directionality, nzRadioService: NzRadioService | null, nzFormStatusService?: NzFormStatusService | undefined);
    setDisabledState(disabled: boolean): void;
    writeValue(value: boolean): void;
    registerOnChange(fn: OnChangeType): void;
    registerOnTouched(fn: OnTouchedType): void;
    ngOnInit(): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    private setupClickListener;
    static ɵfac: i0.ɵɵFactoryDeclaration<NzRadioComponent, [null, null, null, null, { optional: true; }, { optional: true; }, { optional: true; }]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NzRadioComponent, "[nz-radio],[nz-radio-button]", ["nzRadio"], { "nzValue": { "alias": "nzValue"; "required": false; }; "nzDisabled": { "alias": "nzDisabled"; "required": false; }; "nzAutoFocus": { "alias": "nzAutoFocus"; "required": false; }; "isRadioButton": { "alias": "nz-radio-button"; "required": false; }; }, {}, never, ["*"], true, never>;
    static ngAcceptInputType_isRadioButton: unknown;
}
