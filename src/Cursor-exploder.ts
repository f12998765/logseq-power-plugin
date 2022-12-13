import { ExplosionConfig } from './config/config';

export class CursorExploder {

    private config: ExplosionConfig = {} as ExplosionConfig;
    private keystrokeCounter = -1;
    private explosionIndex = -1;
    // private counterTimeout: NodeJS.Timer;

    constructor(public themeConfig: ExplosionConfig) {
        this.config = themeConfig;
    }

    public getConfigValue = (key)=>{
        return this.config[key];
    }

    activate = () => {
        this.initialize();
    }
    public initialize = () => {

        if (!this.config["explosions.enable"]) {
            return;
        }

        this.explosionIndex = -1;
        this.keystrokeCounter = -1;
    }

    public getExplosionDecoration = ()=> {
        let explosions = this.config["explosions.customExplosions"];
        const explosion = this.pickExplosion(explosions);

        if (!explosion) {
            return null;
        }

        return this.createExplosionDecorationType(explosion);
    }

    private pickExplosion(explosions: string[]): string {
        if (!explosions) {
            return '';
        }
        switch (typeof this.config["explosions.explosionOrder"]) {
            case 'string':
                switch (this.config["explosions.explosionOrder"]) {
                    case 'random':
                        this.explosionIndex = getRandomInt(0, explosions.length);
                        break;
                    case 'sequential':
                        this.explosionIndex = (this.explosionIndex + 1) % explosions.length;
                        break;
                    default:
                        this.explosionIndex = 0;
                }
                break;
            case 'number':
                this.explosionIndex = Math.min(explosions.length - 1, Math.floor(Math.abs(this.config["explosions.explosionOrder"] as number)));
            default:
                break;
        }
        return explosions[this.explosionIndex];
    }

    /**
     * @returns an decoration type with the configured background image
     */
    private createExplosionDecorationType = (explosion: Object ) => {
        // subtract 1 ch to account for the character and divide by two to make it centered
        // Use Math.floor to skew to the right which especially helps when deleting chars
        const leftValue = Math.floor((this.config["explosions.size"] - 1) / 2);
        // By default, the top of the gif will be at the top of the text.
        // Setting the top to a negative value will raise it up.
        // The default gifs are "tall" and the bottom halves are empty.
        // Lowering them makes them appear in a more natural position,
        // but limiting the top to the line number keeps it from going
        // off the top of the editor
        const topValue = this.config["explosions.size"] * this.config["explosions.offset"];

        const explosionUrl = this.getExplosionUrl(explosion);

        const backgroundCss = this.config["explosions.backgroundMode"] === 'mask' ?
            this.getMaskCssSettings(explosionUrl) :
            this.getBackgroundCssSettings(explosionUrl);
       
        const defaultCss = {
            position: 'absolute',
            left : `- ${leftValue}ch`,
            top: `- ${topValue}rem`,
            width: `${this.config["explosions.size"]}ch`,
            height: `${this.config["explosions.size"]}rem`,
            display: `inline-block`,
            ['z-index']: 1,
            ['pointer-events']: 'none',
        };

    
        // const backgroundCssString = this.objectToCssString(backgroundCss);
        // const defaultCssString = this.objectToCssString(defaultCss);
        // const customCssString = this.objectToCssString(this.config["explosions.customCss"] || {});

        // return {
        //     before: {
        //         contentText: '',
        //         textDecoration: `${defaultCssString} ${backgroundCssString} ${customCssString}`,
        //     },
        //     textDecoration: `none; position: relative;`,
        // };
        return Object.assign(backgroundCss,defaultCss,this.config["explosions.customCss"] || {});
    }

    private getExplosionUrl(explosion: string): string {
        if (this.config["explosions.gifMode"] !== 'restart') {
            return explosion;
        }

        if (this.isUrl(explosion)) {
            return `${explosion}?timestamp=${Date.now()}`;
        } else {
            // https://tools.ietf.org/html/rfc2397
            return explosion.replace('base64,', `timestamp=${Date.now()};base64,`);
        }
    }

    private isUrl(value: string): boolean {
        return value.indexOf('https') === 0;
    }

    private getBackgroundCssSettings(explosion: string) {
        return {
            'background-repeat': 'no-repeat',
            'background-size': 'contain',
            'background-image': `url("${explosion}")`,
        }
    }

    private getMaskCssSettings(explosion: string): any {
        return {
            'background-color': 'currentColor',
            '-webkit-mask-repeat': 'no-repeat',
            '-webkit-mask-size': 'contain',
            '-webkit-mask-image': `url("${explosion}")`,
            filter: 'saturate(150%)',
        }
    }

    private objectToCssString(settings: any): string {
        let value = '';
        const cssString = Object.keys(settings).map(setting => {
            value = settings[setting];
            if (typeof value === 'string' || typeof value === 'number') {
                return `${setting}: ${value};`
            }
        }).join(' ');

        return cssString;
    }

    /**
     * "Explodes" where the cursor is by setting a text decoration
     * that contains a base64 encoded gif as the background image.
     * The gif is then removed 1 second later
     *
     * @param {boolean} [left=false] place the decoration to
     * the left or the right of the cursor
     */
    private explode = ( left = false) => {
        // To give the explosions space, only explode every X strokes
        // Where X is the configured explosion frequency
        // This counter resets if the user does not type for 1 second.
        // clearTimeout(this.counterTimeout);
        // this.counterTimeout = setTimeout(() => {
        //     this.keystrokeCounter = -1;
        // }, 1000);

        if (++this.keystrokeCounter % this.config["explosions.frequency"] !== 0) {
            return;
        }

        // The delta is greater to the left than to the right because otherwise the gif doesn't appear
        const delta = left ? -2 : 1;
        // const newRange = new vscode.Range(
        //     cursorPosition.with(cursorPosition.line, cursorPosition.character),
        //     // Value can't be negative
        //     cursorPosition.with(cursorPosition.line, Math.max(0, cursorPosition.character + delta))
        // );

        // A new decoration is used each time because otherwise adjacent
        // gifs will all be identical. This helps them be at least a little
        // offset.
        // 每次都重新绘制
        // const decoration = this.getExplosionDecoration(newRange.start);
        // if (!decoration) {
        //     return;
        // }

        // this.activeDecorations.push(decoration);
        // 多少秒之后删除
        // if (this.config["explosions.duration"] !== 0) {
        //     setTimeout(() => {
        //         decoration.dispose();
        //     }, this.config["explosions.duration"]);
        // }
        // editor.setDecorations(decoration, [newRange]);
    }
}

function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}
