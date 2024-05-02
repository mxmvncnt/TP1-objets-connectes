import { OnChanges, SimpleChanges } from '@angular/core';
import * as i0 from "@angular/core";
export declare class NzTreeIndentComponent implements OnChanges {
    nzTreeLevel: number;
    nzIsStart: boolean[];
    nzIsEnd: boolean[];
    nzSelectMode: boolean;
    listOfUnit: number[];
    ngOnChanges(changes: SimpleChanges): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<NzTreeIndentComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NzTreeIndentComponent, "nz-tree-indent", ["nzTreeIndent"], { "nzTreeLevel": { "alias": "nzTreeLevel"; "required": false; }; "nzIsStart": { "alias": "nzIsStart"; "required": false; }; "nzIsEnd": { "alias": "nzIsEnd"; "required": false; }; "nzSelectMode": { "alias": "nzSelectMode"; "required": false; }; }, {}, never, never, true, never>;
}
