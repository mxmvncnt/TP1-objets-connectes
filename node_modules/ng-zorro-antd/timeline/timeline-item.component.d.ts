import { ChangeDetectorRef, OnChanges, SimpleChanges, TemplateRef } from '@angular/core';
import { TimelineService } from './timeline.service';
import { NzTimelineItemColor, NzTimelinePosition } from './typings';
import * as i0 from "@angular/core";
export declare class NzTimelineItemComponent implements OnChanges {
    private cdr;
    private timelineService;
    template: TemplateRef<void>;
    nzPosition?: NzTimelinePosition;
    nzColor: NzTimelineItemColor;
    nzDot?: string | TemplateRef<void>;
    nzLabel?: string | TemplateRef<void>;
    isLast: boolean;
    borderColor: string | null;
    position?: NzTimelinePosition;
    constructor(cdr: ChangeDetectorRef, timelineService: TimelineService);
    ngOnChanges(changes: SimpleChanges): void;
    detectChanges(): void;
    private updateCustomColor;
    static ɵfac: i0.ɵɵFactoryDeclaration<NzTimelineItemComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NzTimelineItemComponent, "nz-timeline-item, [nz-timeline-item]", ["nzTimelineItem"], { "nzPosition": { "alias": "nzPosition"; "required": false; }; "nzColor": { "alias": "nzColor"; "required": false; }; "nzDot": { "alias": "nzDot"; "required": false; }; "nzLabel": { "alias": "nzLabel"; "required": false; }; }, {}, never, ["*"], true, never>;
}
