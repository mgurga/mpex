import { Drawable } from "./types";
import { Coin } from "./Coin"
import { ColorScheme } from "./ColorScheme";
import { LANES } from "./Game"
import { gwp, rand } from "./Utils";
import { gamectx, gw } from "./main";

class BoardColumn {
    col: Coin[] = [];

    add_coin(c: Coin) { this.col.push(c); }
}

export class Board implements Drawable {
    board: BoardColumn[] = [];

    constructor() {
        for (let i = 0; i < LANES; i++) {
            let bc = new BoardColumn();
            
            for (let j = 0; j < 3; j++) {
                let r = rand(1, 4);
                if (r == 1) {
                    bc.add_coin(new Coin(1));
                } else if (r == 2) {
                    bc.add_coin(new Coin(5));
                } else if (r == 3) {
                    bc.add_coin(new Coin(10));
                } else if (r == 4) {
                    bc.add_coin(new Coin(50));
                }
            }
            
            this.board.push(bc);
        }
    }

    draw(x: number, y: number, cs: ColorScheme, w?: number, h?: number): void {
        if (w == undefined || h == undefined) {
            console.error("width or height not defined");
            return;
        }

        for (let i = 0; i < LANES; i++) {
            let bc = this.board[i];

            for (let j = 0; j < bc.col.length; j++) {
                let coinsize = ((gw - 30) / LANES) - 10;
                bc.col[j].draw(i * ((gw - 30) / LANES) + 20, (j * (coinsize + 10)) + 17, cs, coinsize, coinsize);
            }
        }
    }
}