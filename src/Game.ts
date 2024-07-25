import { bgctx, gamectx, bgcanvas, gamecanvas, gw, gh, bgw, bgh } from "./main";
import { Page } from "./types";
import { ColorScheme } from "./ColorScheme"
import { hexToRGB, gwp, ghp } from "./Utils";
import { Timer } from "./Timer";
import { Board } from "./Board";

export const LANES: number = 7;

export class Game implements Page {

    next_page: Page | null = null;
    tick: number = 0;
    cs: ColorScheme;
    timer: Timer;
    board: Board;

    constructor() {
        this.cs = new ColorScheme();
        this.timer = new Timer();
        this.board = new Board();
    }

    draw() {
        // gamecanvas.style.filter = "grayscale(1)";
        // bgcanvas.style.filter = "grayscale(1)";

        gamectx.fillStyle = this.cs.bg;
        gamectx.fillRect(0, 0, gw, gh);

        bgctx.fillStyle = this.cs.bg;
        bgctx.fillRect(0, 0, bgw, bgh);

        if (this.tick < 100) {
            for (let i = 0; i < Math.floor(this.tick / 20); i++) {
                let c = hexToRGB(this.cs.fg);
                gamectx.strokeStyle = `rgb(${c[0] - (i * 10)}, ${c[1] - (i * 10)}, ${c[2] - (i * 10)})`;

                gamectx.lineWidth = 3;
                gamectx.beginPath();
                gamectx.roundRect(i * 2, i * 2, gw - (i * 4), gh - (i * 4), 5);
                gamectx.stroke();
            }

            this.tick++;
            return;
        } else if (this.tick == 100) {
            this.timer.start();
        }

        this.timer.draw(gwp(50), ghp(55), this.cs);
        this.draw_lanes();
        this.draw_border();
        this.board.draw(10, 10, this.cs, gw - 20, gh - 20);

        this.tick++;
    }

    draw_lanes() {
        gamectx.fillStyle = this.cs.am;
        for (let l = 1; l < LANES; l++) {
            for (let d = 0; d < gh / 30; d++) {
                gamectx.fillRect(15 + (l * ((gw - 30) / LANES)), d * 60 + ((this.tick / 2) % 60) - 30, 2, 30);
            }
        }
    }

    draw_border() {
        for (let i = 0; i < 5; i++) {
            let c = hexToRGB(this.cs.fg);
            gamectx.strokeStyle = `rgb(${c[0] - (i * 10)}, ${c[1] - (i * 10)}, ${c[2] - (i * 10)})`;

            gamectx.lineWidth = 3;
            gamectx.beginPath();
            gamectx.roundRect(i * 2, i * 2, gw - (i * 4), gh - (i * 4), 5);
            gamectx.stroke();
        }
    }
}