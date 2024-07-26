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

        gamectx.beginPath();
        gamectx.moveTo(x, y + h!);
        gamectx.quadraticCurveTo(x + (w! / pb), y + h!, x + (w! / pb), y);
        gamectx.stroke();

        gamectx.beginPath();
        gamectx.moveTo(x + w!, y + h!);
        gamectx.quadraticCurveTo(x + w! - (w! / pb), y + h!, x + w! - (w! / pb), y);
        gamectx.stroke();
    }
}