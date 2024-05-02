import { Directive, Input } from '@angular/core';
import { alreadyHasAThemeSuffix, getNameAndNamespace, isIconDefinition, warn, withSuffix } from '../utils';
import * as i0 from "@angular/core";
import * as i1 from "./icon.service";
function checkMeta(prev, after) {
    return prev.type === after.type && prev.theme === after.theme && prev.twoToneColor === after.twoToneColor;
}
export class IconDirective {
    constructor(_iconService, _elementRef, _renderer) {
        this._iconService = _iconService;
        this._elementRef = _elementRef;
        this._renderer = _renderer;
    }
    ngOnChanges(changes) {
        if (changes.type || changes.theme || changes.twoToneColor) {
            this._changeIcon();
        }
    }
    /**
     * Render a new icon in the current element. Remove the icon when `type` is falsy.
     */
    _changeIcon() {
        return new Promise(resolve => {
            if (!this.type) {
                this._clearSVGElement();
                resolve(null);
                return;
            }
            const beforeMeta = this._getSelfRenderMeta();
            this._iconService.getRenderedContent(this._parseIconType(this.type, this.theme), this.twoToneColor).subscribe(svg => {
                // avoid race condition
                // see https://github.com/ant-design/ant-design-icons/issues/315
                const afterMeta = this._getSelfRenderMeta();
                if (checkMeta(beforeMeta, afterMeta)) {
                    this._setSVGElement(svg);
                    resolve(svg);
                }
                else {
                    resolve(null);
                }
            });
        });
    }
    _getSelfRenderMeta() {
        return {
            type: this.type,
            theme: this.theme,
            twoToneColor: this.twoToneColor
        };
    }
    /**
     * Parse a icon to the standard form, an `IconDefinition` or a string like 'account-book-fill` (with a theme suffixed).
     * If namespace is specified, ignore theme because it meaningless for users' icons.
     *
     * @param type
     * @param theme
     */
    _parseIconType(type, theme) {
        if (isIconDefinition(type)) {
            return type;
        }
        else {
            const [name, namespace] = getNameAndNamespace(type);
            if (namespace) {
                return type;
            }
            if (alreadyHasAThemeSuffix(name)) {
                if (!!theme) {
                    warn(`'type' ${name} already gets a theme inside so 'theme' ${theme} would be ignored`);
                }
                return name;
            }
            else {
                return withSuffix(name, theme || this._iconService.defaultTheme);
            }
        }
    }
    _setSVGElement(svg) {
        this._clearSVGElement();
        this._renderer.appendChild(this._elementRef.nativeElement, svg);
    }
    _clearSVGElement() {
        const el = this._elementRef.nativeElement;
        const children = el.childNodes;
        const length = children.length;
        for (let i = length - 1; i >= 0; i--) {
            const child = children[i];
            if (child.tagName?.toLowerCase() === 'svg') {
                this._renderer.removeChild(el, child);
            }
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.1", ngImport: i0, type: IconDirective, deps: [{ token: i1.IconService }, { token: i0.ElementRef }, { token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.0.1", type: IconDirective, selector: "[antIcon]", inputs: { type: "type", theme: "theme", twoToneColor: "twoToneColor" }, usesOnChanges: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.1", ngImport: i0, type: IconDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[antIcon]'
                }]
        }], ctorParameters: () => [{ type: i1.IconService }, { type: i0.ElementRef }, { type: i0.Renderer2 }], propDecorators: { type: [{
                type: Input
            }], theme: [{
                type: Input
            }], twoToneColor: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWNvbi5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcG9uZW50L2ljb24uZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCxTQUFTLEVBRVQsS0FBSyxFQUlOLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxtQkFBbUIsRUFBRSxnQkFBZ0IsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLE1BQU0sVUFBVSxDQUFDOzs7QUFTM0csU0FBUyxTQUFTLENBQUMsSUFBZ0IsRUFBRSxLQUFpQjtJQUNwRCxPQUFPLElBQUksQ0FBQyxJQUFJLEtBQUssS0FBSyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLEtBQUssQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLFlBQVksS0FBSyxLQUFLLENBQUMsWUFBWSxDQUFDO0FBQzVHLENBQUM7QUFLRCxNQUFNLE9BQU8sYUFBYTtJQU14QixZQUFzQixZQUF5QixFQUFZLFdBQXVCLEVBQVksU0FBb0I7UUFBNUYsaUJBQVksR0FBWixZQUFZLENBQWE7UUFBWSxnQkFBVyxHQUFYLFdBQVcsQ0FBWTtRQUFZLGNBQVMsR0FBVCxTQUFTLENBQVc7SUFBRyxDQUFDO0lBRXRILFdBQVcsQ0FBQyxPQUFzQjtRQUNoQyxJQUFJLE9BQU8sQ0FBQyxJQUFJLElBQUksT0FBTyxDQUFDLEtBQUssSUFBSSxPQUFPLENBQUMsWUFBWSxFQUFFO1lBQ3pELElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUNwQjtJQUNILENBQUM7SUFFRDs7T0FFRztJQUNPLFdBQVc7UUFDbkIsT0FBTyxJQUFJLE9BQU8sQ0FBb0IsT0FBTyxDQUFDLEVBQUU7WUFDOUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUU7Z0JBQ2QsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7Z0JBQ3hCLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDZCxPQUFPO2FBQ1I7WUFFRCxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztZQUM3QyxJQUFJLENBQUMsWUFBWSxDQUFDLGtCQUFrQixDQUNsQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUMxQyxJQUFJLENBQUMsWUFBWSxDQUNsQixDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRTtnQkFDaEIsdUJBQXVCO2dCQUN2QixnRUFBZ0U7Z0JBQ2hFLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFBO2dCQUMzQyxJQUFJLFNBQVMsQ0FBQyxVQUFVLEVBQUUsU0FBUyxDQUFDLEVBQUU7b0JBQ3BDLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ3pCLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztpQkFDZDtxQkFBTTtvQkFDTCxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQ2Y7WUFDSCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVTLGtCQUFrQjtRQUMxQixPQUFPO1lBQ0wsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO1lBQ2YsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO1lBQ2pCLFlBQVksRUFBRSxJQUFJLENBQUMsWUFBWTtTQUNoQyxDQUFDO0lBQ0osQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNPLGNBQWMsQ0FBQyxJQUE2QixFQUFFLEtBQWlCO1FBQ3ZFLElBQUksZ0JBQWdCLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDMUIsT0FBTyxJQUFJLENBQUM7U0FDYjthQUFNO1lBQ0wsTUFBTSxDQUFFLElBQUksRUFBRSxTQUFTLENBQUUsR0FBRyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN0RCxJQUFJLFNBQVMsRUFBRTtnQkFDYixPQUFPLElBQUksQ0FBQzthQUNiO1lBQ0QsSUFBSSxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDaEMsSUFBSSxDQUFDLENBQUMsS0FBSyxFQUFFO29CQUNYLElBQUksQ0FBQyxVQUFVLElBQUksMkNBQTJDLEtBQUssbUJBQW1CLENBQUMsQ0FBQztpQkFDekY7Z0JBQ0QsT0FBTyxJQUFJLENBQUM7YUFDYjtpQkFBTTtnQkFDTCxPQUFPLFVBQVUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLENBQUM7YUFDbEU7U0FDRjtJQUNILENBQUM7SUFFUyxjQUFjLENBQUMsR0FBZTtRQUN0QyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztRQUN4QixJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUNsRSxDQUFDO0lBRVMsZ0JBQWdCO1FBQ3hCLE1BQU0sRUFBRSxHQUFnQixJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQztRQUN2RCxNQUFNLFFBQVEsR0FBRyxFQUFFLENBQUMsVUFBVSxDQUFDO1FBQy9CLE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUM7UUFDL0IsS0FBSyxJQUFJLENBQUMsR0FBRyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDcEMsTUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFFLENBQUMsQ0FBUyxDQUFDO1lBQ25DLElBQUksS0FBSyxDQUFDLE9BQU8sRUFBRSxXQUFXLEVBQUUsS0FBSyxLQUFLLEVBQUU7Z0JBQzFDLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQzthQUN2QztTQUNGO0lBQ0gsQ0FBQzs4R0E1RlUsYUFBYTtrR0FBYixhQUFhOzsyRkFBYixhQUFhO2tCQUh6QixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxXQUFXO2lCQUN0QjtpSUFFVSxJQUFJO3NCQUFaLEtBQUs7Z0JBRUcsS0FBSztzQkFBYixLQUFLO2dCQUNHLFlBQVk7c0JBQXBCLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIElucHV0LFxuICBPbkNoYW5nZXMsXG4gIFJlbmRlcmVyMixcbiAgU2ltcGxlQ2hhbmdlc1xufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEljb25EZWZpbml0aW9uLCBUaGVtZVR5cGUgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBhbHJlYWR5SGFzQVRoZW1lU3VmZml4LCBnZXROYW1lQW5kTmFtZXNwYWNlLCBpc0ljb25EZWZpbml0aW9uLCB3YXJuLCB3aXRoU3VmZml4IH0gZnJvbSAnLi4vdXRpbHMnO1xuaW1wb3J0IHsgSWNvblNlcnZpY2UgfSBmcm9tICcuL2ljb24uc2VydmljZSc7XG5cbmludGVyZmFjZSBSZW5kZXJNZXRhIHtcbiAgdHlwZTogc3RyaW5nIHwgSWNvbkRlZmluaXRpb247XG4gIHRoZW1lPzogVGhlbWVUeXBlO1xuICB0d29Ub25lQ29sb3I/OiBzdHJpbmc7XG59XG5cbmZ1bmN0aW9uIGNoZWNrTWV0YShwcmV2OiBSZW5kZXJNZXRhLCBhZnRlcjogUmVuZGVyTWV0YSk6IGJvb2xlYW4ge1xuICByZXR1cm4gcHJldi50eXBlID09PSBhZnRlci50eXBlICYmIHByZXYudGhlbWUgPT09IGFmdGVyLnRoZW1lICYmIHByZXYudHdvVG9uZUNvbG9yID09PSBhZnRlci50d29Ub25lQ29sb3I7XG59XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1thbnRJY29uXSdcbn0pXG5leHBvcnQgY2xhc3MgSWNvbkRpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uQ2hhbmdlcyB7XG4gIEBJbnB1dCgpIHR5cGU6IHN0cmluZyB8IEljb25EZWZpbml0aW9uO1xuXG4gIEBJbnB1dCgpIHRoZW1lPzogVGhlbWVUeXBlO1xuICBASW5wdXQoKSB0d29Ub25lQ29sb3I/OiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIF9pY29uU2VydmljZTogSWNvblNlcnZpY2UsIHByb3RlY3RlZCBfZWxlbWVudFJlZjogRWxlbWVudFJlZiwgcHJvdGVjdGVkIF9yZW5kZXJlcjogUmVuZGVyZXIyKSB7fVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICBpZiAoY2hhbmdlcy50eXBlIHx8IGNoYW5nZXMudGhlbWUgfHwgY2hhbmdlcy50d29Ub25lQ29sb3IpIHtcbiAgICAgIHRoaXMuX2NoYW5nZUljb24oKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVuZGVyIGEgbmV3IGljb24gaW4gdGhlIGN1cnJlbnQgZWxlbWVudC4gUmVtb3ZlIHRoZSBpY29uIHdoZW4gYHR5cGVgIGlzIGZhbHN5LlxuICAgKi9cbiAgcHJvdGVjdGVkIF9jaGFuZ2VJY29uKCk6IFByb21pc2U8U1ZHRWxlbWVudCB8IG51bGw+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2U8U1ZHRWxlbWVudCB8IG51bGw+KHJlc29sdmUgPT4ge1xuICAgICAgaWYgKCF0aGlzLnR5cGUpIHtcbiAgICAgICAgdGhpcy5fY2xlYXJTVkdFbGVtZW50KCk7XG4gICAgICAgIHJlc29sdmUobnVsbCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH0gXG5cbiAgICAgIGNvbnN0IGJlZm9yZU1ldGEgPSB0aGlzLl9nZXRTZWxmUmVuZGVyTWV0YSgpO1xuICAgICAgdGhpcy5faWNvblNlcnZpY2UuZ2V0UmVuZGVyZWRDb250ZW50KFxuICAgICAgICB0aGlzLl9wYXJzZUljb25UeXBlKHRoaXMudHlwZSwgdGhpcy50aGVtZSksXG4gICAgICAgIHRoaXMudHdvVG9uZUNvbG9yXG4gICAgICApLnN1YnNjcmliZShzdmcgPT4ge1xuICAgICAgICAvLyBhdm9pZCByYWNlIGNvbmRpdGlvblxuICAgICAgICAvLyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2FudC1kZXNpZ24vYW50LWRlc2lnbi1pY29ucy9pc3N1ZXMvMzE1XG4gICAgICAgIGNvbnN0IGFmdGVyTWV0YSA9IHRoaXMuX2dldFNlbGZSZW5kZXJNZXRhKClcbiAgICAgICAgaWYgKGNoZWNrTWV0YShiZWZvcmVNZXRhLCBhZnRlck1ldGEpKSB7XG4gICAgICAgICAgdGhpcy5fc2V0U1ZHRWxlbWVudChzdmcpO1xuICAgICAgICAgIHJlc29sdmUoc3ZnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXNvbHZlKG51bGwpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfZ2V0U2VsZlJlbmRlck1ldGEoKTogUmVuZGVyTWV0YSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHR5cGU6IHRoaXMudHlwZSxcbiAgICAgIHRoZW1lOiB0aGlzLnRoZW1lLFxuICAgICAgdHdvVG9uZUNvbG9yOiB0aGlzLnR3b1RvbmVDb2xvclxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogUGFyc2UgYSBpY29uIHRvIHRoZSBzdGFuZGFyZCBmb3JtLCBhbiBgSWNvbkRlZmluaXRpb25gIG9yIGEgc3RyaW5nIGxpa2UgJ2FjY291bnQtYm9vay1maWxsYCAod2l0aCBhIHRoZW1lIHN1ZmZpeGVkKS5cbiAgICogSWYgbmFtZXNwYWNlIGlzIHNwZWNpZmllZCwgaWdub3JlIHRoZW1lIGJlY2F1c2UgaXQgbWVhbmluZ2xlc3MgZm9yIHVzZXJzJyBpY29ucy5cbiAgICpcbiAgICogQHBhcmFtIHR5cGVcbiAgICogQHBhcmFtIHRoZW1lXG4gICAqL1xuICBwcm90ZWN0ZWQgX3BhcnNlSWNvblR5cGUodHlwZTogc3RyaW5nIHwgSWNvbkRlZmluaXRpb24sIHRoZW1lPzogVGhlbWVUeXBlKTogSWNvbkRlZmluaXRpb24gfCBzdHJpbmcge1xuICAgIGlmIChpc0ljb25EZWZpbml0aW9uKHR5cGUpKSB7XG4gICAgICByZXR1cm4gdHlwZTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgWyBuYW1lLCBuYW1lc3BhY2UgXSA9IGdldE5hbWVBbmROYW1lc3BhY2UodHlwZSk7XG4gICAgICBpZiAobmFtZXNwYWNlKSB7XG4gICAgICAgIHJldHVybiB0eXBlO1xuICAgICAgfVxuICAgICAgaWYgKGFscmVhZHlIYXNBVGhlbWVTdWZmaXgobmFtZSkpIHtcbiAgICAgICAgaWYgKCEhdGhlbWUpIHtcbiAgICAgICAgICB3YXJuKGAndHlwZScgJHtuYW1lfSBhbHJlYWR5IGdldHMgYSB0aGVtZSBpbnNpZGUgc28gJ3RoZW1lJyAke3RoZW1lfSB3b3VsZCBiZSBpZ25vcmVkYCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5hbWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gd2l0aFN1ZmZpeChuYW1lLCB0aGVtZSB8fCB0aGlzLl9pY29uU2VydmljZS5kZWZhdWx0VGhlbWUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBfc2V0U1ZHRWxlbWVudChzdmc6IFNWR0VsZW1lbnQpOiB2b2lkIHtcbiAgICB0aGlzLl9jbGVhclNWR0VsZW1lbnQoKTtcbiAgICB0aGlzLl9yZW5kZXJlci5hcHBlbmRDaGlsZCh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsIHN2Zyk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX2NsZWFyU1ZHRWxlbWVudCgpOiB2b2lkIHtcbiAgICBjb25zdCBlbDogSFRNTEVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgY29uc3QgY2hpbGRyZW4gPSBlbC5jaGlsZE5vZGVzO1xuICAgIGNvbnN0IGxlbmd0aCA9IGNoaWxkcmVuLmxlbmd0aDtcbiAgICBmb3IgKGxldCBpID0gbGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIGNvbnN0IGNoaWxkID0gY2hpbGRyZW5bIGkgXSBhcyBhbnk7XG4gICAgICBpZiAoY2hpbGQudGFnTmFtZT8udG9Mb3dlckNhc2UoKSA9PT0gJ3N2ZycpIHtcbiAgICAgICAgdGhpcy5fcmVuZGVyZXIucmVtb3ZlQ2hpbGQoZWwsIGNoaWxkKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==