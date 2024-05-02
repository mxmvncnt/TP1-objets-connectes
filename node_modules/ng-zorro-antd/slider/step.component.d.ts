import { OnChanges, SimpleChanges } from '@angular/core';
import { BooleanInput } from 'ng-zorro-antd/core/types';
import { NzDisplayedStep, NzExtendedMark } from './typings';
import * as i0 from "@angular/core";
export declare class NzSliderStepComponent implements OnChanges {
    static ngAcceptInputType_vertical: BooleanInput;
    static ngAcceptInputType_included: BooleanInput;
    lowerBound: number | null;
    upperBound: number | null;
    marksArray: NzExtendedMark[];
    min: number;
    max: number;
    vertical: boolean;
    included: boolean;
    reverse: boolean;
    steps: NzDisplayedStep[];
    ngOnChanges(changes: SimpleChanges): void;
    trackById(_index: number, step: NzDisplayedStep): number;
    private buildSteps;
    private togglePointActive;
    static ɵfac: i0.ɵɵFactoryDeclaration<NzSliderStepComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NzSliderStepComponent, "nz-slider-step", ["nzSliderStep"], { "lowerBound": { "alias": "lowerBound"; "required": false; }; "upperBound": { "alias": "upperBound"; "required": false; }; "marksArray": { "alias": "marksArray"; "required": false; }; "min": { "alias": "min"; "required": false; }; "max": { "alias": "max"; "required": false; }; "vertical": { "alias": "vertical"; "required": false; }; "included": { "alias": "included"; "required": false; }; "reverse": { "alias": "reverse"; "required": false; }; }, {}, never, never, true, never>;
}
