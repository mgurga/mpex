import { bgctx, gamectx, bgcanvas, gamecanvas, gw, gh, bgw, bgh } from "./main";
import { Page } from "./types";
import { ColorScheme } from "./ColorScheme"
import { hexToRGB, gwp, ghp } from "./Utils";
import { Timer } from "./Timer";
import { Board } from "./Board";
import { Player } from "./Player";
import { leftpressed, noleft, noright, nox, noz, rightpressed, xpressed, zpressed } from "./Inputs";

export const LANES: number = 7;

export class Game implements Page {
    next_page: Page | null = null;
    tick: number = 0;
    cs: ColorScheme;
    timer: Timer;
    board: Board;
    player: Player;

    constructor() {
        this.cs = new ColorScheme();
        this.timer = new Timer();
        this.board = new Board();
        this.player = new Player(Math.floor(LANES / 2));
    }

    get_lane_x(l: number): number { return 15 + (l * ((gw - 30) / LANES)); }
    get_lane_width(): number { return ((gw - 30) / LANES) - 10; }
    coin_grabbable(): boolean {
        // player not holding coins
        if (this.player.held_coins.length == 0)
            return true;

        // player holding coins of same value
        if (this.board.first_coin(this.player.lane) == undefined) return false;
        if (this.player.held_coins[0].value == this.board.first_coin(this.player.lane)!.value)
            return true;

        return false;
    }

    draw(): void {
        // gamecanvas.style.filter = "grayscale(1)";
        // bgcanvas.style.filter = "grayscale(1)";

        if (rightpressed) {
            if (this.player.lane < LANES - 1) this.player.lane++;
            noright();
        }
        if (leftpressed) {
            if (this.player.lane > 0) this.player.lane--;
            noleft();
        }
        if (zpressed && this.coin_grabbable()) {
            for (let c of this.board.grab_coins(this.player.lane))
                this.player.held_coins.push(c);
            noz();
        }
        if (xpressed && this.player.held_coins.length != 0) {
            this.board.shoot_coins(this.player.lane, this.player.held_coins);
            this.player.held_coins = [];
            nox();
        }

        gamectx.fillStyle = this.cs.bg;
        gamectx.fillRect(0, 0, gw, gh);

        bgctx.fillStyle = this.cs.bg;
        bgctx.fillRect(0, 0, bgw, bgh);

        if (this.tick < 100) {
            this.intro_anim();
            this.tick++;
            return;
        } else if (this.tick == 100) {
            this.timer.start();
        }

        this.timer.draw(gwp(50), ghp(55), this.cs);
        this.draw_lanes();
        this.draw_border();
        this.board.draw(10, 10, this.cs, gw - 20, gh - 20);
        this.player.draw(this.get_lane_x(this.player.lane) + 6, gh - 15 - this.get_lane_width(), this.cs, this.get_lane_width(), this.get_lane_width() - 5);

        this.tick++;
    }

    intro_anim(): void {
        for (let i = 0; i < Math.floor(this.tick / 20); i++) {
            let c = hexToRGB(this.cs.fg);
            gamectx.strokeStyle = `rgb(${c[0] - (i * 10)}, ${c[1] - (i * 10)}, ${c[2] - (i * 10)})`;

            gamectx.lineWidth = 3;
            gamectx.beginPath();
            gamectx.roundRect(i * 2, i * 2, gw - (i * 4), gh - (i * 4), 5);
            gamectx.stroke();
        }
    }

    draw_lanes(): void {
        gamectx.fillStyle = this.cs.am;
        for (let l = 1; l < LANES; l++) {
            for (let d = 0; d < gh / 30; d++) {
                gamectx.fillRect(15 + (l * ((gw - 30) / LANES)), d * 60 + ((this.tick / 2) % 60) - 30, 2, 30);
            }
        }
    }

    draw_border(): void {
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