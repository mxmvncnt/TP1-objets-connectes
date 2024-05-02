import { EventEmitter, TemplateRef } from '@angular/core';
import { BooleanInput } from 'ng-zorro-antd/core/types';
import * as i0 from "@angular/core";
export declare class NzRateItemComponent {
    static ngAcceptInputType_allowHalf: BooleanInput;
    character: TemplateRef<{
        $implicit: number;
    }>;
    index: number;
    allowHalf: boolean;
    readonly itemHover: EventEmitter<boolean>;
    readonly itemClick: EventEmitter<boolean>;
    hoverRate(isHalf: boolean): void;
    clickRate(isHalf: boolean): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<NzRateItemComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NzRateItemComponent, "[nz-rate-item]", ["nzRateItem"], { "character": { "alias": "character"; "required": false; }; "index": { "alias": "index"; "required": false; }; "allowHalf": { "alias": "allowHalf"; "required": false; }; }, { "itemHover": "itemHover"; "itemClick": "itemClick"; }, never, never, true, never>;
}
