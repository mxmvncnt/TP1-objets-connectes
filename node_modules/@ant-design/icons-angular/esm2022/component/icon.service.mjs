import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, InjectionToken, Optional, SecurityContext } from '@angular/core';
import { of, Observable, Subject } from 'rxjs';
import { catchError, filter, finalize, map, share, take, tap } from 'rxjs/operators';
import { cloneSVG, getIconDefinitionFromAbbr, getNameAndNamespace, getSecondaryColor, hasNamespace, isIconDefinition, replaceFillColor, warn, withSuffix, withSuffixAndColor } from '../utils';
import { DynamicLoadingTimeoutError, HttpModuleNotImport, IconNotFoundError, NameSpaceIsNotSpecifyError, SVGTagNotFoundError, UrlNotSafeError } from './icon.error';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
import * as i2 from "@angular/platform-browser";
const JSONP_HANDLER_NAME = '__ant_icon_load';
export const ANT_ICONS = new InjectionToken('ant_icons');
export class IconService {
    set twoToneColor({ primaryColor, secondaryColor }) {
        this._twoToneColorPalette.primaryColor = primaryColor;
        this._twoToneColorPalette.secondaryColor =
            secondaryColor || getSecondaryColor(primaryColor);
    }
    get twoToneColor() {
        // Make a copy to avoid unexpected changes.
        return { ...this._twoToneColorPalette };
    }
    /**
     * Disable dynamic loading (support static loading only).
     */
    get _disableDynamicLoading() {
        return false;
    }
    constructor(_rendererFactory, _handler, _document, sanitizer, _antIcons) {
        this._rendererFactory = _rendererFactory;
        this._handler = _handler;
        this._document = _document;
        this.sanitizer = sanitizer;
        this._antIcons = _antIcons;
        this.defaultTheme = 'outline';
        /**
         * All icon definitions would be registered here.
         */
        this._svgDefinitions = new Map();
        /**
         * Cache all rendered icons. Icons are identified by name, theme,
         * and for twotone icons, primary color and secondary color.
         */
        this._svgRenderedDefinitions = new Map();
        this._inProgressFetches = new Map();
        /**
         * Url prefix for fetching inline SVG by dynamic importing.
         */
        this._assetsUrlRoot = '';
        this._twoToneColorPalette = {
            primaryColor: '#333333',
            secondaryColor: '#E6E6E6'
        };
        /** A flag indicates whether jsonp loading is enabled. */
        this._enableJsonpLoading = false;
        this._jsonpIconLoad$ = new Subject();
        this._renderer = this._rendererFactory.createRenderer(null, null);
        if (this._handler) {
            this._http = new HttpClient(this._handler);
        }
        if (this._antIcons) {
            this.addIcon(...this._antIcons);
        }
    }
    /**
     * Call this method to switch to jsonp like loading.
     */
    useJsonpLoading() {
        if (!this._enableJsonpLoading) {
            this._enableJsonpLoading = true;
            window[JSONP_HANDLER_NAME] = (icon) => {
                this._jsonpIconLoad$.next(icon);
            };
        }
        else {
            warn('You are already using jsonp loading.');
        }
    }
    /**
     * Change the prefix of the inline svg resources, so they could be deployed elsewhere, like CDN.
     * @param prefix
     */
    changeAssetsSource(prefix) {
        this._assetsUrlRoot = prefix.endsWith('/') ? prefix : prefix + '/';
    }
    /**
     * Add icons provided by ant design.
     * @param icons
     */
    addIcon(...icons) {
        icons.forEach(icon => {
            this._svgDefinitions.set(withSuffix(icon.name, icon.theme), icon);
        });
    }
    /**
     * Register an icon. Namespace is required.
     * @param type
     * @param literal
     */
    addIconLiteral(type, literal) {
        const [_, namespace] = getNameAndNamespace(type);
        if (!namespace) {
            throw NameSpaceIsNotSpecifyError();
        }
        this.addIcon({ name: type, icon: literal });
    }
    /**
     * Remove all cache.
     */
    clear() {
        this._svgDefinitions.clear();
        this._svgRenderedDefinitions.clear();
    }
    /**
     * Get a rendered `SVGElement`.
     * @param icon
     * @param twoToneColor
     */
    getRenderedContent(icon, twoToneColor) {
        // If `icon` is a `IconDefinition`, go to the next step. If not, try to fetch it from cache.
        const definition = isIconDefinition(icon)
            ? icon
            : this._svgDefinitions.get(icon) || null;
        if (!definition && this._disableDynamicLoading) {
            throw IconNotFoundError(icon);
        }
        // If `icon` is a `IconDefinition` of successfully fetch, wrap it in an `Observable`.
        // Otherwise try to fetch it from remote.
        const $iconDefinition = definition
            ? of(definition)
            : this._loadIconDynamically(icon);
        // If finally get an `IconDefinition`, render and return it. Otherwise throw an error.
        return $iconDefinition.pipe(map(i => {
            if (!i) {
                throw IconNotFoundError(icon);
            }
            return this._loadSVGFromCacheOrCreateNew(i, twoToneColor);
        }));
    }
    getCachedIcons() {
        return this._svgDefinitions;
    }
    /**
     * Get raw svg and assemble a `IconDefinition` object.
     * @param type
     */
    _loadIconDynamically(type) {
        // If developer doesn't provide HTTP module nor enable jsonp loading, just throw an error.
        if (!this._http && !this._enableJsonpLoading) {
            return of(HttpModuleNotImport());
        }
        // If multi directive ask for the same icon at the same time,
        // request should only be fired once.
        let inProgress = this._inProgressFetches.get(type);
        if (!inProgress) {
            const [name, namespace] = getNameAndNamespace(type);
            // If the string has a namespace within, create a simple `IconDefinition`.
            const icon = namespace
                ? { name: type, icon: '' }
                : getIconDefinitionFromAbbr(name);
            const suffix = this._enableJsonpLoading ? '.js' : '.svg';
            const url = (namespace
                ? `${this._assetsUrlRoot}assets/${namespace}/${name}`
                : `${this._assetsUrlRoot}assets/${icon.theme}/${icon.name}`) + suffix;
            const safeUrl = this.sanitizer.sanitize(SecurityContext.URL, url);
            if (!safeUrl) {
                throw UrlNotSafeError(url);
            }
            const source = !this._enableJsonpLoading
                ? this._http
                    .get(safeUrl, { responseType: 'text' })
                    .pipe(map(literal => ({ ...icon, icon: literal })))
                : this._loadIconDynamicallyWithJsonp(icon, safeUrl);
            inProgress = source.pipe(tap(definition => this.addIcon(definition)), finalize(() => this._inProgressFetches.delete(type)), catchError(() => of(null)), share());
            this._inProgressFetches.set(type, inProgress);
        }
        return inProgress;
    }
    _loadIconDynamicallyWithJsonp(icon, url) {
        return new Observable(subscriber => {
            const loader = this._document.createElement('script');
            const timer = setTimeout(() => {
                clean();
                subscriber.error(DynamicLoadingTimeoutError());
            }, 6000);
            loader.src = url;
            function clean() {
                loader.parentNode.removeChild(loader);
                clearTimeout(timer);
            }
            this._document.body.appendChild(loader);
            this._jsonpIconLoad$
                .pipe(filter(i => i.name === icon.name && i.theme === icon.theme), take(1))
                .subscribe(i => {
                subscriber.next(i);
                clean();
            });
        });
    }
    /**
     * Render a new `SVGElement` for a given `IconDefinition`, or make a copy from cache.
     * @param icon
     * @param twoToneColor
     */
    _loadSVGFromCacheOrCreateNew(icon, twoToneColor) {
        let svg;
        const pri = twoToneColor || this._twoToneColorPalette.primaryColor;
        const sec = getSecondaryColor(pri) || this._twoToneColorPalette.secondaryColor;
        const key = icon.theme === 'twotone'
            ? withSuffixAndColor(icon.name, icon.theme, pri, sec)
            : icon.theme === undefined
                ? icon.name
                : withSuffix(icon.name, icon.theme);
        // Try to make a copy from cache.
        const cached = this._svgRenderedDefinitions.get(key);
        if (cached) {
            svg = cached.icon;
        }
        else {
            svg = this._setSVGAttribute(this._colorizeSVGIcon(
            // Icons provided by ant design should be refined to remove preset colors.
            this._createSVGElementFromString(hasNamespace(icon.name) ? icon.icon : replaceFillColor(icon.icon)), icon.theme === 'twotone', pri, sec));
            // Cache it.
            this._svgRenderedDefinitions.set(key, {
                ...icon,
                icon: svg
            });
        }
        return cloneSVG(svg);
    }
    _createSVGElementFromString(str) {
        const div = this._document.createElement('div');
        div.innerHTML = str;
        const svg = div.querySelector('svg');
        if (!svg) {
            throw SVGTagNotFoundError;
        }
        return svg;
    }
    _setSVGAttribute(svg) {
        this._renderer.setAttribute(svg, 'width', '1em');
        this._renderer.setAttribute(svg, 'height', '1em');
        return svg;
    }
    _colorizeSVGIcon(svg, twotone, pri, sec) {
        if (twotone) {
            const children = svg.childNodes;
            const length = children.length;
            for (let i = 0; i < length; i++) {
                const child = children[i];
                if (child.getAttribute('fill') === 'secondaryColor') {
                    this._renderer.setAttribute(child, 'fill', sec);
                }
                else {
                    this._renderer.setAttribute(child, 'fill', pri);
                }
            }
        }
        this._renderer.setAttribute(svg, 'fill', 'currentColor');
        return svg;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.1", ngImport: i0, type: IconService, deps: [{ token: i0.RendererFactory2 }, { token: i1.HttpBackend, optional: true }, { token: DOCUMENT, optional: true }, { token: i2.DomSanitizer }, { token: ANT_ICONS, optional: true }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.0.1", ngImport: i0, type: IconService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.1", ngImport: i0, type: IconService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i0.RendererFactory2 }, { type: i1.HttpBackend, decorators: [{
                    type: Optional
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i2.DomSanitizer }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [ANT_ICONS]
                }] }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWNvbi5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBvbmVudC9pY29uLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzNDLE9BQU8sRUFBZSxVQUFVLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUMvRCxPQUFPLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxjQUFjLEVBQUUsUUFBUSxFQUErQixlQUFlLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0gsT0FBTyxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQy9DLE9BQU8sRUFDTCxVQUFVLEVBQ1YsTUFBTSxFQUNOLFFBQVEsRUFDUixHQUFHLEVBQ0gsS0FBSyxFQUNMLElBQUksRUFDSixHQUFHLEVBQ0osTUFBTSxnQkFBZ0IsQ0FBQztBQVF4QixPQUFPLEVBQ0wsUUFBUSxFQUNSLHlCQUF5QixFQUN6QixtQkFBbUIsRUFDbkIsaUJBQWlCLEVBQ2pCLFlBQVksRUFDWixnQkFBZ0IsRUFDaEIsZ0JBQWdCLEVBQ2hCLElBQUksRUFDSixVQUFVLEVBQ1Ysa0JBQWtCLEVBQ25CLE1BQU0sVUFBVSxDQUFDO0FBQ2xCLE9BQU8sRUFDTCwwQkFBMEIsRUFDMUIsbUJBQW1CLEVBQ25CLGlCQUFpQixFQUNqQiwwQkFBMEIsRUFDMUIsbUJBQW1CLEVBQ25CLGVBQWUsRUFDaEIsTUFBTSxjQUFjLENBQUM7Ozs7QUFFdEIsTUFBTSxrQkFBa0IsR0FBRyxpQkFBaUIsQ0FBQztBQUU3QyxNQUFNLENBQUMsTUFBTSxTQUFTLEdBQUcsSUFBSSxjQUFjLENBQW1CLFdBQVcsQ0FBQyxDQUFDO0FBRzNFLE1BQU0sT0FBTyxXQUFXO0lBR3RCLElBQUksWUFBWSxDQUFDLEVBQ2YsWUFBWSxFQUNaLGNBQWMsRUFDWTtRQUMxQixJQUFJLENB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QkFDTCxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO2lCQUNqRDthQUNGO1NBQ0Y7UUFDRCxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxHQUFHLEVBQUUsTUFBTSxFQUFFLGNBQWMsQ0FBQyxDQUFDO1FBQ3pELE9BQU8sR0FBRyxDQUFDO0lBQ2IsQ0FBQzs4R0FoVlUsV0FBVyw2RkE0REEsUUFBUSx5REFHUixTQUFTO2tIQS9EcEIsV0FBVzs7MkZBQVgsV0FBVztrQkFEdkIsVUFBVTs7MEJBNEROLFFBQVE7OzBCQUNSLFFBQVE7OzBCQUFJLE1BQU07MkJBQUMsUUFBUTs7MEJBRzNCLFFBQVE7OzBCQUFJLE1BQU07MkJBQUMsU0FBUyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERPQ1VNRU5UIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IEh0dHBCYWNrZW5kLCBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0IHsgSW5qZWN0LCBJbmplY3RhYmxlLCBJbmplY3Rpb25Ub2tlbiwgT3B0aW9uYWwsIFJlbmRlcmVyMiwgUmVuZGVyZXJGYWN0b3J5MiwgU2VjdXJpdHlDb250ZXh0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBEb21TYW5pdGl6ZXIgfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJztcbmltcG9ydCB7IG9mLCBPYnNlcnZhYmxlLCBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge1xuICBjYXRjaEVycm9yLFxuICBmaWx0ZXIsXG4gIGZpbmFsaXplLFxuICBtYXAsXG4gIHNoYXJlLFxuICB0YWtlLFxuICB0YXBcbn0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtcbiAgQ2FjaGVkSWNvbkRlZmluaXRpb24sXG4gIEljb25EZWZpbml0aW9uLFxuICBUaGVtZVR5cGUsXG4gIFR3b1RvbmVDb2xvclBhbGV0dGUsXG4gIFR3b1RvbmVDb2xvclBhbGV0dGVTZXR0ZXJcbn0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHtcbiAgY2xvbmVTVkcsXG4gIGdldEljb25EZWZpbml0aW9uRnJvbUFiYnIsXG4gIGdldE5hbWVBbmROYW1lc3BhY2UsXG4gIGdldFNlY29uZGFyeUNvbG9yLFxuICBoYXNOYW1lc3BhY2UsXG4gIGlzSWNvbkRlZmluaXRpb24sXG4gIHJlcGxhY2VGaWxsQ29sb3IsXG4gIHdhcm4sXG4gIHdpdGhTdWZmaXgsXG4gIHdpdGhTdWZmaXhBbmRDb2xvclxufSBmcm9tICcuLi91dGlscyc7XG5pbXBvcnQge1xuICBEeW5hbWljTG9hZGluZ1RpbWVvdXRFcnJvcixcbiAgSHR0cE1vZHVsZU5vdEltcG9ydCxcbiAgSWNvbk5vdEZvdW5kRXJyb3IsXG4gIE5hbWVTcGFjZUlzTm90U3BlY2lmeUVycm9yLFxuICBTVkdUYWdOb3RGb3VuZEVycm9yLFxuICBVcmxOb3RTYWZlRXJyb3Jcbn0gZnJvbSAnLi9pY29uLmVycm9yJztcblxuY29uc3QgSlNPTlBfSEFORExFUl9OQU1FID0gJ19fYW50X2ljb25fbG9hZCc7XG5cbmV4cG9ydCBjb25zdCBBTlRfSUNPTlMgPSBuZXcgSW5qZWN0aW9uVG9rZW48SWNvbkRlZmluaXRpb25bXT4oJ2FudF9pY29ucycpO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgSWNvblNlcnZpY2Uge1xuICBkZWZhdWx0VGhlbWU6IFRoZW1lVHlwZSA9ICdvdXRsaW5lJztcblxuICBzZXQgdHdvVG9uZUNvbG9yKHtcbiAgICBwcmltYXJ5Q29sb3IsXG4gICAgc2Vjb25kYXJ5Q29sb3JcbiAgfTogVHdvVG9uZUNvbG9yUGFsZXR0ZVNldHRlcikge1xuICAgIHRoaXMuX3R3b1RvbmVDb2xvclBhbGV0dGUucHJpbWFyeUNvbG9yID0gcHJpbWFyeUNvbG9yO1xuICAgIHRoaXMuX3R3b1RvbmVDb2xvclBhbGV0dGUuc2Vjb25kYXJ5Q29sb3IgPVxuICAgICAgc2Vjb25kYXJ5Q29sb3IgfHwgZ2V0U2Vjb25kYXJ5Q29sb3IocHJpbWFyeUNvbG9yKTtcbiAgfVxuXG4gIGdldCB0d29Ub25lQ29sb3IoKTogVHdvVG9uZUNvbG9yUGFsZXR0ZVNldHRlciB7XG4gICAgLy8gTWFrZSBhIGNvcHkgdG8gYXZvaWQgdW5leHBlY3RlZCBjaGFuZ2VzLlxuICAgIHJldHVybiB7IC4uLnRoaXMuX3R3b1RvbmVDb2xvclBhbGV0dGUgfSBhcyBUd29Ub25lQ29sb3JQYWxldHRlO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9yZW5kZXJlcjogUmVuZGVyZXIyO1xuICBwcm90ZWN0ZWQgX2h0dHA6IEh0dHBDbGllbnQ7XG5cbiAgLyoqXG4gICAqIERpc2FibGUgZHluYW1pYyBsb2FkaW5nIChzdXBwb3J0IHN0YXRpYyBsb2FkaW5nIG9ubHkpLlxuICAgKi9cbiAgcHJvdGVjdGVkIGdldCBfZGlzYWJsZUR5bmFtaWNMb2FkaW5nKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBbGwgaWNvbiBkZWZpbml0aW9ucyB3b3VsZCBiZSByZWdpc3RlcmVkIGhlcmUuXG4gICAqL1xuICBwcm90ZWN0ZWQgcmVhZG9ubHkgX3N2Z0RlZmluaXRpb25zID0gbmV3IE1hcDxzdHJpbmcsIEljb25EZWZpbml0aW9uPigpO1xuXG4gIC8qKlxuICAgKiBDYWNoZSBhbGwgcmVuZGVyZWQgaWNvbnMuIEljb25zIGFyZSBpZGVudGlmaWVkIGJ5IG5hbWUsIHRoZW1lLFxuICAgKiBhbmQgZm9yIHR3b3RvbmUgaWNvbnMsIHByaW1hcnkgY29sb3IgYW5kIHNlY29uZGFyeSBjb2xvci5cbiAgICovXG4gIHByb3RlY3RlZCByZWFkb25seSBfc3ZnUmVuZGVyZWREZWZpbml0aW9ucyA9IG5ldyBNYXA8c3RyaW5nLCBDYWNoZWRJY29uRGVmaW5pdGlvbj4oKTtcblxuICBwcm90ZWN0ZWQgX2luUHJvZ3Jlc3NGZXRjaGVzID0gbmV3IE1hcDxcbiAgICBzdHJpbmcsXG4gICAgT2JzZXJ2YWJsZTxJY29uRGVmaW5pdGlvbiB8IG51bGw+XG4gID4oKTtcblxuICAvKipcbiAgICogVXJsIHByZWZpeCBmb3IgZmV0Y2hpbmcgaW5saW5lIFNWRyBieSBkeW5hbWljIGltcG9ydGluZy5cbiAgICovXG4gIHByb3RlY3RlZCBfYXNzZXRzVXJsUm9vdCA9ICcnO1xuXG4gIHByb3RlY3RlZCBfdHdvVG9uZUNvbG9yUGFsZXR0ZTogVHdvVG9uZUNvbG9yUGFsZXR0ZSA9IHtcbiAgICBwcmltYXJ5Q29sb3I6ICcjMzMzMzMzJyxcbiAgICBzZWNvbmRhcnlDb2xvcjogJyNFNkU2RTYnXG4gIH07XG5cbiAgLyoqIEEgZmxhZyBpbmRpY2F0ZXMgd2hldGhlciBqc29ucCBsb2FkaW5nIGlzIGVuYWJsZWQuICovXG4gIHByaXZhdGUgX2VuYWJsZUpzb25wTG9hZGluZyA9IGZhbHNlO1xuICBwcml2YXRlIHJlYWRvbmx5IF9qc29ucEljb25Mb2FkJCA9IG5ldyBTdWJqZWN0PEljb25EZWZpbml0aW9uPigpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByb3RlY3RlZCBfcmVuZGVyZXJGYWN0b3J5OiBSZW5kZXJlckZhY3RvcnkyLFxuICAgIEBPcHRpb25hbCgpIHByb3RlY3RlZCBfaGFuZGxlcjogSHR0cEJhY2tlbmQsXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChET0NVTUVOVCkgcHJvdGVjdGVkIF9kb2N1bWVudDogYW55LFxuICAgIHByb3RlY3RlZCBzYW5pdGl6ZXI6IERvbVNhbml0aXplcixcblxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoQU5UX0lDT05TKSBwcm90ZWN0ZWQgX2FudEljb25zOiBJY29uRGVmaW5pdGlvbltdXG4gICkge1xuICAgIHRoaXMuX3JlbmRlcmVyID0gdGhpcy5fcmVuZGVyZXJGYWN0b3J5LmNyZWF0ZVJlbmRlcmVyKG51bGwsIG51bGwpO1xuXG4gICAgaWYgKHRoaXMuX2hhbmRsZXIpIHtcbiAgICAgIHRoaXMuX2h0dHAgPSBuZXcgSHR0cENsaWVudCh0aGlzLl9oYW5kbGVyKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fYW50SWNvbnMpIHtcbiAgICAgIHRoaXMuYWRkSWNvbiguLi50aGlzLl9hbnRJY29ucyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENhbGwgdGhpcyBtZXRob2QgdG8gc3dpdGNoIHRvIGpzb25wIGxpa2UgbG9hZGluZy5cbiAgICovXG4gIHVzZUpzb25wTG9hZGluZygpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuX2VuYWJsZUpzb25wTG9hZGluZykge1xuICAgICAgdGhpcy5fZW5hYmxlSnNvbnBMb2FkaW5nID0gdHJ1ZTtcblxuICAgICAgd2luZG93W0pTT05QX0hBTkRMRVJfTkFNRV0gPSAoaWNvbjogSWNvbkRlZmluaXRpb24pID0+IHtcbiAgICAgICAgdGhpcy5fanNvbnBJY29uTG9hZCQubmV4dChpY29uKTtcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHdhcm4oJ1lvdSBhcmUgYWxyZWFkeSB1c2luZyBqc29ucCBsb2FkaW5nLicpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDaGFuZ2UgdGhlIHByZWZpeCBvZiB0aGUgaW5saW5lIHN2ZyByZXNvdXJjZXMsIHNvIHRoZXkgY291bGQgYmUgZGVwbG95ZWQgZWxzZXdoZXJlLCBsaWtlIENETi5cbiAgICogQHBhcmFtIHByZWZpeFxuICAgKi9cbiAgY2hhbmdlQXNzZXRzU291cmNlKHByZWZpeDogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5fYXNzZXRzVXJsUm9vdCA9IHByZWZpeC5lbmRzV2l0aCgnLycpID8gcHJlZml4IDogcHJlZml4ICsgJy8nO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBpY29ucyBwcm92aWRlZCBieSBhbnQgZGVzaWduLlxuICAgKiBAcGFyYW0gaWNvbnNcbiAgICovXG4gIGFkZEljb24oLi4uaWNvbnM6IEljb25EZWZpbml0aW9uW10pOiB2b2lkIHtcbiAgICBpY29ucy5mb3JFYWNoKGljb24gPT4ge1xuICAgICAgdGhpcy5fc3ZnRGVmaW5pdGlvbnMuc2V0KHdpdGhTdWZmaXgoaWNvbi5uYW1lLCBpY29uLnRoZW1lKSwgaWNvbik7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXIgYW4gaWNvbi4gTmFtZXNwYWNlIGlzIHJlcXVpcmVkLlxuICAgKiBAcGFyYW0gdHlwZVxuICAgKiBAcGFyYW0gbGl0ZXJhbFxuICAgKi9cbiAgYWRkSWNvbkxpdGVyYWwodHlwZTogc3RyaW5nLCBsaXRlcmFsOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBjb25zdCBbXywgbmFtZXNwYWNlXSA9IGdldE5hbWVBbmROYW1lc3BhY2UodHlwZSk7XG4gICAgaWYgKCFuYW1lc3BhY2UpIHtcbiAgICAgIHRocm93IE5hbWVTcGFjZUlzTm90U3BlY2lmeUVycm9yKCk7XG4gICAgfVxuICAgIHRoaXMuYWRkSWNvbih7IG5hbWU6IHR5cGUsIGljb246IGxpdGVyYWwgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGFsbCBjYWNoZS5cbiAgICovXG4gIGNsZWFyKCk6IHZvaWQge1xuICAgIHRoaXMuX3N2Z0RlZmluaXRpb25zLmNsZWFyKCk7XG4gICAgdGhpcy5fc3ZnUmVuZGVyZWREZWZpbml0aW9ucy5jbGVhcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhIHJlbmRlcmVkIGBTVkdFbGVtZW50YC5cbiAgICogQHBhcmFtIGljb25cbiAgICogQHBhcmFtIHR3b1RvbmVDb2xvclxuICAgKi9cbiAgZ2V0UmVuZGVyZWRDb250ZW50KFxuICAgIGljb246IEljb25EZWZpbml0aW9uIHwgc3RyaW5nLFxuICAgIHR3b1RvbmVDb2xvcj86IHN0cmluZ1xuICApOiBPYnNlcnZhYmxlPFNWR0VsZW1lbnQ+IHtcbiAgICAvLyBJZiBgaWNvbmAgaXMgYSBgSWNvbkRlZmluaXRpb25gLCBnbyB0byB0aGUgbmV4dCBzdGVwLiBJZiBub3QsIHRyeSB0byBmZXRjaCBpdCBmcm9tIGNhY2hlLlxuICAgIGNvbnN0IGRlZmluaXRpb246IEljb25EZWZpbml0aW9uIHwgbnVsbCA9IGlzSWNvbkRlZmluaXRpb24oaWNvbilcbiAgICAgID8gKGljb24gYXMgSWNvbkRlZmluaXRpb24pXG4gICAgICA6IHRoaXMuX3N2Z0RlZmluaXRpb25zLmdldChpY29uKSB8fCBudWxsO1xuICAgIFxuICAgIGlmICghZGVmaW5pdGlvbiAmJiB0aGlzLl9kaXNhYmxlRHluYW1pY0xvYWRpbmcpIHtcbiAgICAgIHRocm93IEljb25Ob3RGb3VuZEVycm9yKGljb24gYXMgc3RyaW5nKTtcbiAgICB9XG5cbiAgICAvLyBJZiBgaWNvbmAgaXMgYSBgSWNvbkRlZmluaXRpb25gIG9mIHN1Y2Nlc3NmdWxseSBmZXRjaCwgd3JhcCBpdCBpbiBhbiBgT2JzZXJ2YWJsZWAuXG4gICAgLy8gT3RoZXJ3aXNlIHRyeSB0byBmZXRjaCBpdCBmcm9tIHJlbW90ZS5cbiAgICBjb25zdCAkaWNvbkRlZmluaXRpb24gPSBkZWZpbml0aW9uXG4gICAgICA/IG9mKGRlZmluaXRpb24pXG4gICAgICA6IHRoaXMuX2xvYWRJY29uRHluYW1pY2FsbHkoaWNvbiBhcyBzdHJpbmcpO1xuXG4gICAgLy8gSWYgZmluYWxseSBnZXQgYW4gYEljb25EZWZpbml0aW9uYCwgcmVuZGVyIGFuZCByZXR1cm4gaXQuIE90aGVyd2lzZSB0aHJvdyBhbiBlcnJvci5cbiAgICByZXR1cm4gJGljb25EZWZpbml0aW9uLnBpcGUoXG4gICAgICBtYXAoaSA9PiB7XG4gICAgICAgIGlmICghaSkge1xuICAgICAgICAgIHRocm93IEljb25Ob3RGb3VuZEVycm9yKGljb24gYXMgc3RyaW5nKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fbG9hZFNWR0Zyb21DYWNoZU9yQ3JlYXRlTmV3KGksIHR3b1RvbmVDb2xvcik7XG4gICAgICB9KVxuICAgICk7XG4gIH1cblxuICBnZXRDYWNoZWRJY29ucygpOiBNYXA8c3RyaW5nLCBJY29uRGVmaW5pdGlvbj4ge1xuICAgIHJldHVybiB0aGlzLl9zdmdEZWZpbml0aW9ucztcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgcmF3IHN2ZyBhbmQgYXNzZW1ibGUgYSBgSWNvbkRlZmluaXRpb25gIG9iamVjdC5cbiAgICogQHBhcmFtIHR5cGVcbiAgICovXG4gIHByb3RlY3RlZCBfbG9hZEljb25EeW5hbWljYWxseShcbiAgICB0eXBlOiBzdHJpbmdcbiAgKTogT2JzZXJ2YWJsZTxJY29uRGVmaW5pdGlvbiB8IG51bGw+IHtcbiAgICAvLyBJZiBkZXZlbG9wZXIgZG9lc24ndCBwcm92aWRlIEhUVFAgbW9kdWxlIG5vciBlbmFibGUganNvbnAgbG9hZGluZywganVzdCB0aHJvdyBhbiBlcnJvci5cbiAgICBpZiAoIXRoaXMuX2h0dHAgJiYgIXRoaXMuX2VuYWJsZUpzb25wTG9hZGluZykge1xuICAgICAgcmV0dXJuIG9mKEh0dHBNb2R1bGVOb3RJbXBvcnQoKSk7XG4gICAgfVxuXG4gICAgLy8gSWYgbXVsdGkgZGlyZWN0aXZlIGFzayBmb3IgdGhlIHNhbWUgaWNvbiBhdCB0aGUgc2FtZSB0aW1lLFxuICAgIC8vIHJlcXVlc3Qgc2hvdWxkIG9ubHkgYmUgZmlyZWQgb25jZS5cbiAgICBsZXQgaW5Qcm9ncmVzcyA9IHRoaXMuX2luUHJvZ3Jlc3NGZXRjaGVzLmdldCh0eXBlKTtcblxuICAgIGlmICghaW5Qcm9ncmVzcykge1xuICAgICAgY29uc3QgW25hbWUsIG5hbWVzcGFjZV0gPSBnZXROYW1lQW5kTmFtZXNwYWNlKHR5cGUpO1xuXG4gICAgICAvLyBJZiB0aGUgc3RyaW5nIGhhcyBhIG5hbWVzcGFjZSB3aXRoaW4sIGNyZWF0ZSBhIHNpbXBsZSBgSWNvbkRlZmluaXRpb25gLlxuICAgICAgY29uc3QgaWNvbjogSWNvbkRlZmluaXRpb24gPSBuYW1lc3BhY2VcbiAgICAgICAgPyB7IG5hbWU6IHR5cGUsIGljb246ICcnIH1cbiAgICAgICAgOiBnZXRJY29uRGVmaW5pdGlvbkZyb21BYmJyKG5hbWUpO1xuXG4gICAgICBjb25zdCBzdWZmaXggPSB0aGlzLl9lbmFibGVKc29ucExvYWRpbmcgPyAnLmpzJyA6ICcuc3ZnJztcbiAgICAgIGNvbnN0IHVybCA9XG4gICAgICAgIChuYW1lc3BhY2VcbiAgICAgICAgICA/IGAke3RoaXMuX2Fzc2V0c1VybFJvb3R9YXNzZXRzLyR7bmFtZXNwYWNlfS8ke25hbWV9YFxuICAgICAgICAgIDogYCR7dGhpcy5fYXNzZXRzVXJsUm9vdH1hc3NldHMvJHtpY29uLnRoZW1lfS8ke2ljb24ubmFtZX1gKSArIHN1ZmZpeDtcblxuICAgICAgY29uc3Qgc2FmZVVybCA9IHRoaXMuc2FuaXRpemVyLnNhbml0aXplKFNlY3VyaXR5Q29udGV4dC5VUkwsIHVybCk7XG5cbiAgICAgIGlmICghc2FmZVVybCkge1xuICAgICAgICB0aHJvdyBVcmxOb3RTYWZlRXJyb3IodXJsKTtcbiAgICAgIH1cblxuICAgICAgY29uc3Qgc291cmNlID0gIXRoaXMuX2VuYWJsZUpzb25wTG9hZGluZ1xuICAgICAgICA/IHRoaXMuX2h0dHBcbiAgICAgICAgICAgIC5nZXQoc2FmZVVybCwgeyByZXNwb25zZVR5cGU6ICd0ZXh0JyB9KVxuICAgICAgICAgICAgLnBpcGUobWFwKGxpdGVyYWwgPT4gKHsgLi4uaWNvbiwgaWNvbjogbGl0ZXJhbCB9KSkpXG4gICAgICAgIDogdGhpcy5fbG9hZEljb25EeW5hbWljYWxseVdpdGhKc29ucChpY29uLCBzYWZlVXJsKTtcblxuICAgICAgaW5Qcm9ncmVzcyA9IHNvdXJjZS5waXBlKFxuICAgICAgICB0YXAoZGVmaW5pdGlvbiA9PiB0aGlzLmFkZEljb24oZGVmaW5pdGlvbikpLFxuICAgICAgICBmaW5hbGl6ZSgoKSA9PiB0aGlzLl9pblByb2dyZXNzRmV0Y2hlcy5kZWxldGUodHlwZSkpLFxuICAgICAgICBjYXRjaEVycm9yKCgpID0+IG9mKG51bGwpKSxcbiAgICAgICAgc2hhcmUoKVxuICAgICAgKTtcblxuICAgICAgdGhpcy5faW5Qcm9ncmVzc0ZldGNoZXMuc2V0KHR5cGUsIGluUHJvZ3Jlc3MpO1xuICAgIH1cblxuICAgIHJldHVybiBpblByb2dyZXNzO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9sb2FkSWNvbkR5bmFtaWNhbGx5V2l0aEpzb25wKGljb246IEljb25EZWZpbml0aW9uLCB1cmw6IHN0cmluZyk6IE9ic2VydmFibGU8SWNvbkRlZmluaXRpb24+IHtcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGU8SWNvbkRlZmluaXRpb24+KHN1YnNjcmliZXIgPT4ge1xuICAgICAgY29uc3QgbG9hZGVyID0gdGhpcy5fZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG4gICAgICBjb25zdCB0aW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBjbGVhbigpO1xuICAgICAgICBzdWJzY3JpYmVyLmVycm9yKER5bmFtaWNMb2FkaW5nVGltZW91dEVycm9yKCkpO1xuICAgICAgfSwgNjAwMCk7XG5cbiAgICAgIGxvYWRlci5zcmMgPSB1cmw7XG5cbiAgICAgIGZ1bmN0aW9uIGNsZWFuKCk6IHZvaWQge1xuICAgICAgICBsb2FkZXIucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChsb2FkZXIpO1xuICAgICAgICBjbGVhclRpbWVvdXQodGltZXIpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGxvYWRlcik7XG4gICAgICB0aGlzLl9qc29ucEljb25Mb2FkJFxuICAgICAgICAgIC5waXBlKFxuICAgICAgICAgICAgICBmaWx0ZXIoaSA9PiBpLm5hbWUgPT09IGljb24ubmFtZSAmJiBpLnRoZW1lID09PSBpY29uLnRoZW1lKSxcbiAgICAgICAgICAgICAgdGFrZSgxKVxuICAgICAgICAgIClcbiAgICAgICAgICAuc3Vic2NyaWJlKGkgPT4ge1xuICAgICAgICAgICAgc3Vic2NyaWJlci5uZXh0KGkpO1xuICAgICAgICAgICAgY2xlYW4oKTtcbiAgICAgICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW5kZXIgYSBuZXcgYFNWR0VsZW1lbnRgIGZvciBhIGdpdmVuIGBJY29uRGVmaW5pdGlvbmAsIG9yIG1ha2UgYSBjb3B5IGZyb20gY2FjaGUuXG4gICAqIEBwYXJhbSBpY29uXG4gICAqIEBwYXJhbSB0d29Ub25lQ29sb3JcbiAgICovXG4gIHByb3RlY3RlZCBfbG9hZFNWR0Zyb21DYWNoZU9yQ3JlYXRlTmV3KFxuICAgIGljb246IEljb25EZWZpbml0aW9uLFxuICAgIHR3b1RvbmVDb2xvcj86IHN0cmluZ1xuICApOiBTVkdFbGVtZW50IHtcbiAgICBsZXQgc3ZnOiBTVkdFbGVtZW50O1xuXG4gICAgY29uc3QgcHJpID0gdHdvVG9uZUNvbG9yIHx8IHRoaXMuX3R3b1RvbmVDb2xvclBhbGV0dGUucHJpbWFyeUNvbG9yO1xuICAgIGNvbnN0IHNlYyA9XG4gICAgICBnZXRTZWNvbmRhcnlDb2xvcihwcmkpIHx8IHRoaXMuX3R3b1RvbmVDb2xvclBhbGV0dGUuc2Vjb25kYXJ5Q29sb3I7XG4gICAgY29uc3Qga2V5ID1cbiAgICAgIGljb24udGhlbWUgPT09ICd0d290b25lJ1xuICAgICAgICA/IHdpdGhTdWZmaXhBbmRDb2xvcihpY29uLm5hbWUsIGljb24udGhlbWUsIHByaSwgc2VjKVxuICAgICAgICA6IGljb24udGhlbWUgPT09IHVuZGVmaW5lZFxuICAgICAgICA/IGljb24ubmFtZVxuICAgICAgICA6IHdpdGhTdWZmaXgoaWNvbi5uYW1lLCBpY29uLnRoZW1lKTtcblxuICAgIC8vIFRyeSB0byBtYWtlIGEgY29weSBmcm9tIGNhY2hlLlxuICAgIGNvbnN0IGNhY2hlZCA9IHRoaXMuX3N2Z1JlbmRlcmVkRGVmaW5pdGlvbnMuZ2V0KGtleSk7XG5cbiAgICBpZiAoY2FjaGVkKSB7XG4gICAgICBzdmcgPSBjYWNoZWQuaWNvbjtcbiAgICB9IGVsc2Uge1xuICAgICAgc3ZnID0gdGhpcy5fc2V0U1ZHQXR0cmlidXRlKFxuICAgICAgICB0aGlzLl9jb2xvcml6ZVNWR0ljb24oXG4gICAgICAgICAgLy8gSWNvbnMgcHJvdmlkZWQgYnkgYW50IGRlc2lnbiBzaG91bGQgYmUgcmVmaW5lZCB0byByZW1vdmUgcHJlc2V0IGNvbG9ycy5cbiAgICAgICAgICB0aGlzLl9jcmVhdGVTVkdFbGVtZW50RnJvbVN0cmluZyhcbiAgICAgICAgICAgIGhhc05hbWVzcGFjZShpY29uLm5hbWUpID8gaWNvbi5pY29uIDogcmVwbGFjZUZpbGxDb2xvcihpY29uLmljb24pXG4gICAgICAgICAgKSxcbiAgICAgICAgICBpY29uLnRoZW1lID09PSAndHdvdG9uZScsXG4gICAgICAgICAgcHJpLFxuICAgICAgICAgIHNlY1xuICAgICAgICApXG4gICAgICApO1xuICAgICAgLy8gQ2FjaGUgaXQuXG4gICAgICB0aGlzLl9zdmdSZW5kZXJlZERlZmluaXRpb25zLnNldChrZXksIHtcbiAgICAgICAgLi4uaWNvbixcbiAgICAgICAgaWNvbjogc3ZnXG4gICAgICB9IGFzIENhY2hlZEljb25EZWZpbml0aW9uKTtcbiAgICB9XG5cbiAgICByZXR1cm4gY2xvbmVTVkcoc3ZnKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfY3JlYXRlU1ZHRWxlbWVudEZyb21TdHJpbmcoc3RyOiBzdHJpbmcpOiBTVkdFbGVtZW50IHtcbiAgICBjb25zdCBkaXYgPSB0aGlzLl9kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBkaXYuaW5uZXJIVE1MID0gc3RyO1xuICAgIGNvbnN0IHN2ZzogU1ZHRWxlbWVudCA9IGRpdi5xdWVyeVNlbGVjdG9yKCdzdmcnKTtcbiAgICBpZiAoIXN2Zykge1xuICAgICAgdGhyb3cgU1ZHVGFnTm90Rm91bmRFcnJvcjtcbiAgICB9XG4gICAgcmV0dXJuIHN2ZztcbiAgfVxuXG4gIHByb3RlY3RlZCBfc2V0U1ZHQXR0cmlidXRlKHN2ZzogU1ZHRWxlbWVudCk6IFNWR0VsZW1lbnQge1xuICAgIHRoaXMuX3JlbmRlcmVyLnNldEF0dHJpYnV0ZShzdmcsICd3aWR0aCcsICcxZW0nKTtcbiAgICB0aGlzLl9yZW5kZXJlci5zZXRBdHRyaWJ1dGUoc3ZnLCAnaGVpZ2h0JywgJzFlbScpO1xuICAgIHJldHVybiBzdmc7XG4gIH1cblxuICBwcm90ZWN0ZWQgX2NvbG9yaXplU1ZHSWNvbihcbiAgICBzdmc6IFNWR0VsZW1lbnQsXG4gICAgdHdvdG9uZTogYm9vbGVhbixcbiAgICBwcmk6IHN0cmluZyxcbiAgICBzZWM6IHN0cmluZ1xuICApOiBTVkdFbGVtZW50IHtcbiAgICBpZiAodHdvdG9uZSkge1xuICAgICAgY29uc3QgY2hpbGRyZW4gPSBzdmcuY2hpbGROb2RlcztcbiAgICAgIGNvbnN0IGxlbmd0aCA9IGNoaWxkcmVuLmxlbmd0aDtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgY2hpbGQ6IEhUTUxFbGVtZW50ID0gY2hpbGRyZW5baV0gYXMgSFRNTEVsZW1lbnQ7XG4gICAgICAgIGlmIChjaGlsZC5nZXRBdHRyaWJ1dGUoJ2ZpbGwnKSA9PT0gJ3NlY29uZGFyeUNvbG9yJykge1xuICAgICAgICAgIHRoaXMuX3JlbmRlcmVyLnNldEF0dHJpYnV0ZShjaGlsZCwgJ2ZpbGwnLCBzZWMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX3JlbmRlcmVyLnNldEF0dHJpYnV0ZShjaGlsZCwgJ2ZpbGwnLCBwcmkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuX3JlbmRlcmVyLnNldEF0dHJpYnV0ZShzdmcsICdmaWxsJywgJ2N1cnJlbnRDb2xvcicpO1xuICAgIHJldHVybiBzdmc7XG4gIH1cbn1cbiJdfQ==