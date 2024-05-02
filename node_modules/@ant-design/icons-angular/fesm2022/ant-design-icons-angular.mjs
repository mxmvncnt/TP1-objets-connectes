import * as i0 from '@angular/core';
import { isDevMode, InjectionToken, SecurityContext, Injectable, Optional, Inject, Directive, Input, NgModule } from '@angular/core';
import { generate } from '@ant-design/colors';
import { DOCUMENT } from '@angular/common';
import * as i1 from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Subject, of, Observable } from 'rxjs';
import { map, tap, finalize, catchError, share, filter, take } from 'rxjs/operators';
import * as i2 from '@angular/platform-browser';

const ANT_ICON_ANGULAR_CONSOLE_PREFIX = '[@ant-design/icons-angular]:';
function error(message) {
    console.error(`${ANT_ICON_ANGULAR_CONSOLE_PREFIX} ${message}.`);
}
function warn(message) {
    if (isDevMode()) {
        console.warn(`${ANT_ICON_ANGULAR_CONSOLE_PREFIX} ${message}.`);
    }
}
function getSecondaryColor(primaryColor) {
    return generate(primaryColor)[0];
}
function withSuffix(name, theme) {
    switch (theme) {
        case 'fill': return `${name}-fill`;
        case 'outline': return `${name}-o`;
        case 'twotone': return `${name}-twotone`;
        case undefined: return name;
        default: throw new Error(`${ANT_ICON_ANGULAR_CONSOLE_PREFIX}Theme "${theme}" is not a recognized theme!`);
    }
}
function withSuffixAndColor(name, theme, pri, sec) {
    return `${withSuffix(name, theme)}-${pri}-${sec}`;
}
function mapAbbrToTheme(abbr) {
    return abbr === 'o' ? 'outline' : abbr;
}
function alreadyHasAThemeSuffix(name) {
    return name.endsWith('-fill') || name.endsWith('-o') || name.endsWith('-twotone');
}
function isIconDefinition(target) {
    return (typeof target === 'object' &&
        typeof target.name === 'string' &&
        (typeof target.theme === 'string' || target.theme === undefined) &&
        typeof target.icon === 'string');
}
/**
 * Get an `IconDefinition` object from abbreviation type, like `account-book-fill`.
 * @param str
 */
function getIconDefinitionFromAbbr(str) {
    const arr = str.split('-');
    const theme = mapAbbrToTheme(arr.splice(arr.length - 1, 1)[0]);
    const name = arr.join('-');
    return {
        name,
        theme,
        icon: ''
    };
}
function cloneSVG(svg) {
    return svg.cloneNode(true);
}
/**
 * Parse inline SVG string and replace colors with placeholders. For twotone icons only.
 */
function replaceFillColor(raw) {
    return raw
        .replace(/['"]#333['"]/g, '"primaryColor"')
        .replace(/['"]#E6E6E6['"]/g, '"secondaryColor"')
        .replace(/['"]#D9D9D9['"]/g, '"secondaryColor"')
        .replace(/['"]#D8D8D8['"]/g, '"secondaryColor"');
}
/**
 * Split a name with namespace in it into a tuple like [ name, namespace ].
 */
function getNameAndNamespace(type) {
    const split = type.split(':');
    switch (split.length) {
        case 1: return [type, ''];
        case 2: return [split[1], split[0]];
        default: throw new Error(`${ANT_ICON_ANGULAR_CONSOLE_PREFIX}The icon type ${type} is not valid!`);
    }
}
function hasNamespace(type) {
    return getNameAndNamespace(type)[1] !== '';
}

function NameSpaceIsNotSpecifyError() {
    return new Error(`${ANT_ICON_ANGULAR_CONSOLE_PREFIX}Type should have a namespace. Try "namespace:${name}".`);
}
function IconNotFoundError(icon) {
    return new Error(`${ANT_ICON_ANGULAR_CONSOLE_PREFIX}the icon ${icon} does not exist or is not registered.`);
}
function HttpModuleNotImport() {
    error(`you need to import "HttpClientModule" to use dynamic importing.`);
    return null;
}
function UrlNotSafeError(url) {
    return new Error(`${ANT_ICON_ANGULAR_CONSOLE_PREFIX}The url "${url}" is unsafe.`);
}
function SVGTagNotFoundError() {
    return new Error(`${ANT_ICON_ANGULAR_CONSOLE_PREFIX}<svg> tag not found.`);
}
function DynamicLoadingTimeoutError() {
    return new Error(`${ANT_ICON_ANGULAR_CONSOLE_PREFIX}Importing timeout error.`);
}

const JSONP_HANDLER_NAME = '__ant_icon_load';
const ANT_ICONS = new InjectionToken('ant_icons');
class IconService {
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

function checkMeta(prev, after) {
    return prev.type === after.type && prev.theme === after.theme && prev.twoToneColor === after.twoToneColor;
}
class IconDirective {
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.1", ngImport: i0, type: IconDirective, deps: [{ token: IconService }, { token: i0.ElementRef }, { token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.0.1", type: IconDirective, selector: "[antIcon]", inputs: { type: "type", theme: "theme", twoToneColor: "twoToneColor" }, usesOnChanges: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.1", ngImport: i0, type: IconDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[antIcon]'
                }]
        }], ctorParameters: () => [{ type: IconService }, { type: i0.ElementRef }, { type: i0.Renderer2 }], propDecorators: { type: [{
                type: Input
            }], theme: [{
                type: Input
            }], twoToneColor: [{
                type: Input
            }] } });

class IconModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.1", ngImport: i0, type: IconModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.0.1", ngImport: i0, type: IconModule, declarations: [IconDirective], exports: [IconDirective] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.0.1", ngImport: i0, type: IconModule, providers: [IconService] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.1", ngImport: i0, type: IconModule, decorators: [{
            type: NgModule,
            args: [{
                    exports: [IconDirective],
                    declarations: [IconDirective],
                    providers: [IconService]
                }]
        }] });

const manifest = {
    fill: [
        'account-book', 'alert', 'alipay-circle', 'alipay-square', 'amazon-square', 'android', 'apple', 'amazon-circle', 'appstore', 'bank', 'backward', 'audio', 'behance-circle', 'behance-square', 'aliwangwang', 'box-plot', 'book', 'build', 'bulb', 'calculator', 'bug', 'calendar', 'caret-down', 'car', 'camera', 'caret-up', 'carry-out', 'caret-left', 'check-circle', 'check-square', 'clock-circle', 'chrome', 'close-circle', 'close-square', 'caret-right', 'cloud', 'code', 'codepen-circle', 'code-sandbox-square', 'codepen-square', 'ci-circle', 'bell', 'contacts', 'container', 'copyright-circle', 'copy', 'control', 'compass', 'credit-card', 'crown', 'database', 'delete', 'dashboard', 'diff', 'dislike', 'dingtalk-circle', 'dingtalk-square', 'dollar-circle', 'down-circle', 'down-square', 'dribbble-square', 'dribbble-circle', 'dropbox-circle', 'edit', 'dropbox-square', 'environment', 'euro-circle', 'code-sandbox-circle', 'eye', 'experiment', 'exclamation-circle', 'facebook', 'fast-backward', 'eye-invisible', 'file-add', 'fast-forward', 'file-excel', 'file-exclamation', 'file', 'file-image', 'api', 'file-pdf', 'file-ppt', 'file-text', 'file-markdown', 'file-unknown', 'file-word', 'file-zip', 'fire', 'filter', 'flag', 'folder-add', 'folder-open', 'forward', 'frown', 'funnel-plot', 'fund', 'format-painter', 'gift', 'customer-service', 'github', 'gitlab', 'golden', 'google-circle', 'gold', 'google-square', 'google-plus-circle', 'highlight', 'heart', 'hourglass', 'home', 'html5', 'folder', 'idcard', 'ie-circle', 'info-circle', 'instagram', 'insurance', 'hdd', 'like', 'layout', 'left-square', 'left-circle', 'linkedin', 'lock', 'mac-command', 'mail', 'medium-circle', 'interaction', 'medium-square', 'meh', 'ie-square', 'message', 'minus-circle', 'minus-square', 'mobile', 'money-collect', 'notification', 'pause-circle', 'pay-circle', 'picture', 'phone', 'pie-chart', 'play-square', 'play-circle', 'plus-circle', 'pound-circle', 'plus-square', 'profile', 'printer', 'project', 'pushpin', 'qq-circle', 'property-safety', 'question-circle', 'qq-square', 'read', 'reconciliation', 'red-envelope', 'reddit-circle', 'google-plus-square', 'reddit-square', 'rest', 'right-circle', 'right-square', 'robot', 'rocket', 'safety-certificate', 'medicine-box', 'schedule', 'save', 'security-scan', 'setting', 'shop', 'shopping', 'signal', 'sketch-circle', 'sketch-square', 'slack-square', 'skype', 'sliders', 'snippets', 'smile', 'sound', 'star', 'step-forward', 'stop', 'switcher', 'tag', 'tablet', 'taobao-circle', 'tags', 'taobao-square', 'thunderbolt', 'tool', 'step-backward', 'trademark-circle', 'trophy', 'twitter-circle', 'unlock', 'slack-circle', 'up-circle', 'twitter-square', 'usb', 'up-square', 'video-camera', 'wallet', 'weibo-circle', 'weibo-square', 'yahoo', 'zhihu-circle', 'warning', 'youtube', 'windows', 'wechat', 'zhihu-square', 'yuque', 'skin'
    ],
    outline: [
        'account-book', 'alert', 'aim', 'alibaba', 'align-center', 'alipay-circle', 'align-right', 'alipay', 'api', 'aliwangwang', 'amazon', 'ant-cloud', 'appstore', 'appstore-add', 'apple', 'area-chart', 'arrow-right', 'audio-muted', 'arrows-alt', 'backward', 'audit', 'bar-chart', 'audio', 'bank', 'bars', 'arrow-left', 'arrow-up', 'bell', 'bold', 'behance', 'aliyun', 'arrow-down', 'behance-square', 'apartment', 'block', 'border-outer', 'barcode', 'border-horizontal', 'border-verticle', 'borderless-table', 'border', 'border-inner', 'border-top', 'bg-colors', 'border-left', 'branches', 'box-plot', 'bug', 'build', 'bulb', 'calculator', 'border-right', 'car', 'camera', 'calendar', 'caret-left', 'check-circle', 'ant-design', 'check', 'align-left', 'book', 'carry-out', 'caret-down', 'clear', 'chrome', 'close-circle', 'clock-circle', 'ci-circle', 'cloud-download', 'close', 'cloud-server', 'ci', 'cloud-sync', 'cloud', 'code-sandbox', 'check-square', 'cluster', 'cloud-upload', 'close-square', 'column-height', 'codepen', 'coffee', 'codepen-circle', 'code', 'compress', 'contacts', 'caret-up', 'compass', 'comment', 'border-bottom', 'container', 'caret-right', 'copy', 'column-width', 'control', 'database', 'crown', 'delete-column', 'delete', 'dashboard', 'dash', 'deployment-unit', 'desktop', 'diff', 'delivered-procedure', 'dingtalk', 'dingding', 'delete-row', 'credit-card', 'dollar-circle', 'dislike', 'double-left', 'dot-chart', 'dollar', 'copyright', 'double-right', 'down-circle', 'down', 'download', 'down-square', 'drag', 'dropbox', 'dribbble-square', 'edit', 'ellipsis', 'dribbble', 'enter', 'environment', 'euro-circle', 'expand-alt', 'expand', 'customer-service', 'exception', 'exclamation-circle', 'exclamation', 'euro', 'eye-invisible', 'export', 'facebook', 'fast-backward', 'fast-forward', 'field-number', 'field-string', 'field-time', 'file-add', 'fall', 'file-done', 'file-excel', 'file-exclamation', 'field-binary', 'file-gif', 'file-jpg', 'file-markdown', 'file-image', 'file-pdf', 'file-search', 'file-ppt', 'file-protect', 'file-unknown', 'file-text', 'file-sync', 'filter', 'file-word', 'file-zip', 'flag', 'fire', 'folder-add', 'folder', 'font-colors', 'fork', 'folder-view', 'form', 'folder-open', 'font-size', 'forward', 'experiment', 'fullscreen', 'function', 'fullscreen-exit', 'gateway', 'fund-view', 'format-painter', 'gift', 'gif', 'fund-projection-screen', 'funnel-plot', 'fund', 'global', 'frown', 'gold', 'github', 'google', 'google-plus', 'hdd', 'heart', 'android', 'heat-map', 'group', 'holder', 'home', 'highlight', 'html5', 'idcard', 'hourglass', 'copyright-circle', 'info-circle', 'info', 'insert-row-above', 'inbox', 'insert-row-left', 'import', 'instagram', 'key', 'insert-row-below', 'insurance', 'interaction', 'insert-row-right', 'left-circle', 'laptop', 'issues-close', 'italic', 'file', 'layout', 'left', 'left-square', 'line-height', 'like', 'link', 'linkedin', 'line-chart', 'loading-3-quarters', 'line', 'logout', 'lock', 'login', 'mail', 'mac-command', 'loading', 'console-sql', 'man', 'medicine-box', 'eye', 'meh', 'menu-unfold', 'medium', 'message', 'merge-cells', 'menu-fold', 'minus-circle', 'ie', 'disconnect', 'money-collect', 'monitor', 'minus', 'node-collapse', 'menu', 'node-expand', 'notification', 'number', 'gitlab', 'paper-clip', 'pause', 'phone', 'partition', 'one-to-one', 'pause-circle', 'ordered-list', 'pic-center', 'pay-circle', 'percentage', 'picture', 'minus-square', 'pie-chart', 'pic-left', 'pic-right', 'plus-circle', 'plus', 'plus-square', 'pound-circle', 'play-square', 'poweroff', 'pound', 'project', 'printer', 'property-safety', 'mobile', 'qq', 'pushpin', 'pull-request', 'profile', 'radius-bottomleft', 'question-circle', 'qrcode', 'radar-chart', 'reconciliation', 'radius-upright', 'question', 'read', 'red-envelope', 'radius-bottomright', 'radius-setting', 'reddit', 'redo', 'more', 'node-index', 'right-circle', 'right', 'reload', 'right-square', 'rocket', 'rotate-left', 'robot', 'safety', 'save', 'rotate-right', 'rollback', 'scan', 'schedule', 'safety-certificate', 'scissor', 'send', 'shake', 'share-alt', 'search', 'security-scan', 'radius-upleft', 'history', 'rest', 'shopping', 'medium-workmark', 'shrink', 'sketch', 'skype', 'retweet', 'slack', 'slack-square', 'sisternode', 'sliders', 'shop', 'small-dash', 'smile', 'snippets', 'shopping-cart', 'solution', 'sort-ascending', 'split-cells', 'play-circle', 'star', 'step-backward', 'strikethrough', 'step-forward', 'rise', 'stock', 'stop', 'swap-left', 'switcher', 'swap', 'subnode', 'swap-right', 'sync', 'table', 'skin', 'tag', 'taobao', 'tags', 'team', 'thunderbolt', 'taobao-circle', 'tool', 'trademark-circle', 'to-top', 'trademark', 'transaction', 'trophy', 'sound', 'underline', 'twitter', 'unlock', 'undo', 'setting', 'ungroup', 'select', 'up-circle', 'up-square', 'unordered-list', 'upload', 'up', 'tablet', 'user-delete', 'user', 'usergroup-delete', 'user-switch', 'verified', 'vertical-align-middle', 'vertical-align-top', 'video-camera-add', 'vertical-align-bottom', 'vertical-right', 'vertical-left', 'usb', 'wallet', 'video-camera', 'weibo-square', 'weibo', 'wechat', 'weibo-circle', 'usergroup-add', 'whats-app', 'woman', 'translation', 'windows', 'wifi', 'yahoo', 'yuque', 'warning', 'zoom-in', 'sort-descending', 'youtube', 'zoom-out', 'zhihu', 'user-add'
    ],
    twotone: [
        'alert', 'appstore', 'audio', 'bank', 'account-book', 'book', 'box-plot', 'bug', 'build', 'calculator', 'calendar', 'bulb', 'camera', 'car', 'carry-out', 'check-circle', 'check-square', 'ci', 'clock-circle', 'close-circle', 'ci-circle', 'bell', 'cloud', 'close-square', 'code', 'contacts', 'container', 'copyright-circle', 'control', 'credit-card', 'crown', 'compass', 'copyright', 'customer-service', 'delete', 'dashboard', 'database', 'api', 'copy', 'diff', 'dislike', 'dollar-circle', 'dollar', 'down-square', 'edit', 'environment', 'euro', 'exclamation-circle', 'down-circle', 'eye', 'experiment', 'file-excel', 'file-exclamation', 'file-add', 'file-image', 'file-markdown', 'file-pdf', 'file-ppt', 'file-text', 'file-zip', 'file', 'file-word', 'file-unknown', 'fire', 'filter', 'eye-invisible', 'flag', 'folder-add', 'folder', 'folder-open', 'fund', 'frown', 'funnel-plot', 'gift', 'gold', 'hdd', 'heart', 'euro-circle', 'highlight', 'idcard', 'hourglass', 'html5', 'home', 'info-circle', 'interaction', 'layout', 'left-square', 'left-circle', 'like', 'lock', 'mail', 'medicine-box', 'message', 'meh', 'minus-circle', 'mobile', 'minus-square', 'money-collect', 'pause-circle', 'notification', 'phone', 'pie-chart', 'play-circle', 'plus-circle', 'picture', 'play-square', 'plus-square', 'pound-circle', 'project', 'profile', 'printer', 'pushpin', 'reconciliation', 'property-safety', 'right-circle', 'red-envelope', 'right-square', 'rocket', 'insurance', 'question-circle', 'save', 'schedule', 'safety-certificate', 'security-scan', 'setting', 'shop', 'rest', 'skin', 'sliders', 'sound', 'smile', 'shopping', 'star', 'stop', 'switcher', 'tag', 'tags', 'tablet', 'thunderbolt', 'tool', 'trademark-circle', 'trophy', 'unlock', 'up-circle', 'usb', 'video-camera', 'warning', 'wallet', 'up-square', 'snippets'
    ]
};

/**
 * Generated bundle index. Do not edit.
 */

export { ANT_ICONS, ANT_ICON_ANGULAR_CONSOLE_PREFIX, DynamicLoadingTimeoutError, HttpModuleNotImport, IconDirective, IconModule, IconNotFoundError, IconService, NameSpaceIsNotSpecifyError, SVGTagNotFoundError, UrlNotSafeError, alreadyHasAThemeSuffix, cloneSVG, error, getIconDefinitionFromAbbr, getNameAndNamespace, getSecondaryColor, hasNamespace, isIconDefinition, manifest, mapAbbrToTheme, replaceFillColor, warn, withSuffix, withSuffixAndColor };
//# sourceMappingURL=ant-design-icons-angular.mjs.map
