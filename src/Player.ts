import { Coin } from "./Coin";
import { ColorScheme } from "./ColorScheme";
import { gamectx } from "./main";
import { Drawable } from "./types";

export class Player implements Drawable {
    lane: number;
    held_coins: Coin[] = [];

    constructor(starting_lane: number) { this.lane = starting_lane; }

    draw(x: number, y: number, cs: ColorScheme, w?: number, h?: number): void {
        let pb = 2.8; // player barrel width
        gamectx.lineWidth = 7;
        gamectx.strokeStyle = cs.fg;

        if (this.held_coins.length == 0) {
            gamectx.beginPath();
            gamectx.moveTo(x, y + h!);
            gamectx.quadraticCurveTo(x + (w! / pb), y + h!, x + (w! / pb), y);
            gamectx.stroke();

            gamectx.beginPath();
            gamectx.moveTo(x + w!, y + h!);
            gamectx.quadraticCurveTo(x + w! - (w! / pb), y + h!, x + w! - (w! / pb), y);
            gamectx.stroke();
        } else {
            gamectx.beginPath();
            gamectx.moveTo(x, y + h!);
            gamectx.quadraticCurveTo(x, y, x + (w! / pb), y);
            gamectx.stroke();

            gamectx.beginPath();
            gamectx.moveTo(x + w!, y + h!);
            gamectx.quadraticCurveTo(x + w!, y, x + w! - (w! / pb), y);
            gamectx.stroke();

            this.held_coins[0].draw(x + 10, y + 10, cs, w! - 20, h! - 20);
            if (this.held_coins.length > 1) {
                gamectx.font = "16px sixtyfour";
                gamectx.textAlign = "right";
                gamectx.fillStyle = cs.ad;
                gamectx.fillText("x" + this.held_coins.length + "", x + w! - 5, y + h!);
            }
        }
    }
}