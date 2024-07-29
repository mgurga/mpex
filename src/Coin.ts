import { ColorScheme } from "./ColorScheme";
import { Drawable } from "./types";
import { gamectx } from "./main";
import { rand } from "./Utils";

export class Coin implements Drawable {
    value: number;
    sparkle_timer: number = 0;

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

        if (this.sparkle_timer > 0)
            this.draw_sparkles(x, y, cs, w!, h!);
    }

    private draw_sparkles(x: number, y: number, cs: ColorScheme, w: number, h: number): void {
        gamectx.fillStyle = cs.ab;

        for (let i = 0; i < 4; i++) {
            let sx = rand(x, x + w);
            let sy = rand(y, y + h);
            let size = 10;

            let region = new Path2D();
            region.moveTo(sx, sy - 2);
            region.quadraticCurveTo(sx, sy, sx + size, sy);
            region.quadraticCurveTo(sx, sy, sx, sy + size);
            region.quadraticCurveTo(sx, sy, sx - size, sy);
            region.quadraticCurveTo(sx, sy, sx, sy - size);
            region.closePath();

            gamectx.fill(region);
        }

        this.sparkle_timer--;
    }

    sparkle(): void {
        this.sparkle_timer = 50;
    }
}