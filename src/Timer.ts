import { Drawable } from "./types";
import { gamectx } from "./main";
import { hexToRGB } from "./Utils";
import { ColorScheme } from "./ColorScheme";

export class Timer implements Drawable {
    timer: number = 99;
    private timer_interval: number;

    constructor() { }

    start(): void {
        this.timer_interval = setInterval(() => { this.timer--; }, 1000);
    }

    draw(x: number, y: number, cs: ColorScheme): void {
        gamectx.textAlign = "center";
        gamectx.font = "bold 100px sixtyfour";
        let rgb = hexToRGB(cs.ab);
        gamectx.fillStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.4)`;
        gamectx.fillText(this.timer + "", x, y);

        if (this.timer <= 0) {
            clearInterval(this.timer_interval);
            this.timer = 0;
        }
    }
}