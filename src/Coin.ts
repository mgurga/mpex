import { ColorScheme } from "./ColorScheme";
import { Drawable } from "./types";
import { gamectx } from "./main";

export class Coin implements Drawable {
    value: number;

    constructor(value: number) { this.value = value; }

    draw(x: number, y: number, cs: ColorScheme, w?: number, h?: number): void {
        gamectx.lineWidth = 5;
        gamectx.strokeStyle = "#D4AF37";
        gamectx.beginPath();
        gamectx.arc(x + (w! / 2), y + (h! / 2), (w! / 2), 0, 2 * Math.PI);
        gamectx.stroke();

        gamectx.font = "20px sixtyfour";
        gamectx.textAlign = "center";
        gamectx.fillStyle = "#ffc919";
        gamectx.fillText(this.value + "", x + (w! / 2), y + (h! / 2) + 10);
    }
}