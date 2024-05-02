import { OnChanges, SimpleChanges, TemplateRef } from '@angular/core';
import * as i0 from "@angular/core";
export declare class NzTabBodyComponent implements OnChanges {
    content: TemplateRef<void> | null;
    active: boolean;
    animated: boolean;
    forceRender: boolean;
    /**
     * If this tab is ever activated, then the content should always be rendered.
     */
    protected hasBeenActive: boolean;
    ngOnChanges(changes: SimpleChanges): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<NzTabBodyComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NzTabBodyComponent, "[nz-tab-body]", ["nzTabBody"], { "content": { "alias": "content"; "required": false; }; "active": { "alias": "active"; "required": false; }; "animated": { "alias": "animated"; "required": false; }; "forceRender": { "alias": "forceRender"; "required": false; }; }, {}, never, never, true, never>;
}
