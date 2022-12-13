export type ExplosionOrder = 'random' | 'sequential' | number;
export type BackgroundMode = 'mask' | 'image';
export type GifMode = 'continue' | 'restart';

export interface ScreenShakerConfig {
    "shake.enable": boolean;
    "shake.intensity"?: number;
}

export interface ExplosionConfig {
    "explosions.enable": boolean;
    "explosions.maxExplosions": number;
    "explosions.size": number;
    "explosions.frequency": number;
    "explosions.offset": number;
    "explosions.duration": number;
    "explosions.customExplosions": string[];
    "explosions.explosionOrder": ExplosionOrder;
    "explosions.backgroundMode": BackgroundMode;
    "explosions.gifMode": GifMode
    "explosions.customCss"?: {[key: string]: string};
}

export const CSS_LEFT = "margin-left";
export const CSS_TOP = "top";

export interface ThemeConfig extends ExplosionConfig, ScreenShakerConfig { }

export interface ExtensionConfig extends ThemeConfig {
    enabled?: boolean;
    comboThreshold?: number;
    comboTimeout?: number;
}