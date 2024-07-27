import { Drawable } from "./types";
import { Coin } from "./Coin"
import { ColorScheme } from "./ColorScheme";
import { LANES } from "./Game"
import { gwp, rand } from "./Utils";
import { gamectx, gw } from "./main";

class BoardColumn {
    private col: Coin[] = [];

    add_coin(c: Coin) { this.col.push(c); }
    get_coin(i: number): Coin { return this.col[i] }

    size(): number { return this.col.length; }

    grab_coins(): Coin[] {
        let out: Coin[] = [];

        for (let i = this.size() - 1; i >= 0; i--) {
            let last_coin = this.col.pop();
            if (last_coin == undefined) break;

            if (out.length == 0) {
                out.push(last_coin);
            } else {
                if (out[out.length - 1].value == last_coin.value) {
                    out.push(last_coin);
                } else {
                    this.col.push(last_coin);
                    break;
                }
            }
        }

        return out;
    }
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

            for (let j = 0; j < bc.size(); j++) {
                let coinsize = ((gw - 30) / LANES) - 10;
                bc.get_coin(j).draw(i * ((gw - 30) / LANES) + 20, (j * (coinsize + 10)) + 17, cs, coinsize, coinsize);
            }
        }
    }

    grab_coins(lane: number): Coin[] {
        return this.board[lane].grab_coins();
    }

    first_coin(lane: number): Coin {
        return this.board[lane].get_coin(this.board[lane].size() - 1);
    }
}