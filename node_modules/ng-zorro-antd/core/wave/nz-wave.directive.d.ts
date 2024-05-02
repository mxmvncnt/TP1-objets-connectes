/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { ElementRef, InjectionToken, EnvironmentProviders, NgZone, OnDestroy, OnInit } from '@angular/core';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzWaveRenderer } from './nz-wave-renderer';
import * as i0 from "@angular/core";
export interface NzWaveConfig {
    disabled?: boolean;
}
export declare const NZ_WAVE_GLOBAL_DEFAULT_CONFIG: NzWaveConfig;
export declare const NZ_WAVE_GLOBAL_CONFIG: InjectionToken<NzWaveConfig>;
export declare function provideNzWave(config: NzWaveConfig): EnvironmentProviders;
export declare class NzWaveDirective implements OnInit, OnDestroy {
    private ngZone;
    private elementRef;
    private config;
    private animationType;
    private platformId;
    private cspNonce?;
    nzWaveExtraNode: boolean;
    private waveRenderer?;
    private waveDisabled;
    get disabled(): boolean;
    get rendererRef(): NzWaveRenderer | undefined;
    constructor(ngZone: NgZone, elementRef: ElementRef, config: NzWaveConfig, animationType: string, platformId: NzSafeAny, cspNonce?: string | null | undefined);
    isConfigDisabled(): boolean;
    ngOnDestroy(): void;
    ngOnInit(): void;
    renderWaveIfEnabled(): void;
    disable(): void;
    enable(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<NzWaveDirective, [null, null, { optional: true; }, { optional: true; }, null, { optional: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<NzWaveDirective, "[nz-wave],button[nz-button]:not([nzType=\"link\"]):not([nzType=\"text\"])", ["nzWave"], { "nzWaveExtraNode": { "alias": "nzWaveExtraNode"; "required": false; }; }, {}, never, never, true, never>;
}
