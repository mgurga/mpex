import { Drawable } from "./types";
import { Coin } from "./Coin"
import { ColorScheme } from "./ColorScheme";
import { LANES } from "./Game"
import { gwp, rand } from "./Utils";
import { gamectx, gw } from "./main";

export class CoinPos {
    row: number;
    col: number;
    val: number;

    constructor(col: number, row: number, val: number) {
        this.row = row;
        this.col = col;
        this.val = val;
    }
}

class BoardColumn {
    private col: Coin[] = [];

    add_coin(c: Coin): void { this.col.push(c); }
    get_coin(i: number): Coin | undefined { return this.col[i] }

    front(): Coin | undefined { return this.col[0]; }
    back(): Coin | undefined { return this.col[this.size() - 1]; }

    size(): number { return this.col.length; }

    remove_coin(i: number): void {
        delete this.col[i];
    }

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
    tick: number = 0;

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

    get_coin(lane: number, row: number): Coin | undefined {
        if (lane < 0 || lane > LANES - 1) return undefined;
        if (row < 0 || row > this.board[lane].size() - 1) return undefined;
        return this.board[lane].get_coin(row);
    }
    get_coin_pos(c: CoinPos): Coin | undefined { return this.get_coin(c.col, c.row); }

    draw(x: number, y: number, cs: ColorScheme, w?: number, h?: number): void {
        if (w == undefined || h == undefined) {
            console.error("width or height not defined");
            return;
        }

        this.cleanup_board();

        for (let i = 0; i < LANES; i++) {
            let bc = this.board[i];
            let bcsize = bc.size();

            for (let j = 0; j < bcsize; j++) {
                let coinsize = ((gw - 30) / LANES) - 10;
                if (bc.get_coin(j) == undefined) continue;
                bc.get_coin(j)!.draw(i * ((gw - 30) / LANES) + 20, (j * (coinsize + 10)) + 17, cs, coinsize, coinsize);
            }
        }

        this.tick++;
    }

    cleanup_board(): void {
        let rerun = false;
        for (let i = 0; i < LANES; i++) {
            let bc = this.board[i];
            for (let j = 0; j < bc.size(); j++) {
                if (bc.get_coin(j) == undefined) continue;
                if (bc.get_coin(j)!.cleanup) {
                    bc.remove_coin(j);
                    rerun = true;
                    break;
                }
            }
            if (rerun) break;
        }
        if (rerun) this.cleanup_board();
    }

    update_board(start_lane: number): void {
        let bc = this.board[start_lane];
        let start_coin_pos = new CoinPos(start_lane, bc.size() - 1, bc.back()!.value);
        let adj_coins = this.get_adj_coins(start_coin_pos);

        if (start_coin_pos.val == 1 && adj_coins.length >= 5) {
            for (let i = 0; i < 5; i++) {
                this.board[adj_coins[i].col].get_coin(adj_coins[i].row)!.sparkle();
            }
        }
    }

    get_adj_coins(coinpos: CoinPos): CoinPos[] {
        let adj_coins = this.get_adj_coins_rec(coinpos, 0);

        let unique_out: CoinPos[] = [];
        for (let cp of adj_coins)
            if (this.unique_check(unique_out, cp))
                unique_out.push(cp);

        return unique_out;
    }

    get_adj_coins_rec(coinpos: CoinPos, steps: number): CoinPos[] {
        let out: CoinPos[] = [];

        if (steps > 10) return out;

        out.push(new CoinPos(coinpos.col, coinpos.row, coinpos.val));

        let up_coin = this.get_coin(coinpos.col, coinpos.row - 1);
        if (up_coin != undefined && up_coin.value == coinpos.val) {
            for (let c of this.get_adj_coins_rec(new CoinPos(coinpos.col, coinpos.row - 1, up_coin.value), steps + 1))
                out.push(c);
        }

        let down_coin = this.get_coin(coinpos.col, coinpos.row + 1);
        if (down_coin != undefined && down_coin.value == coinpos.val) {
            for (let c of this.get_adj_coins_rec(new CoinPos(coinpos.col, coinpos.row + 1, down_coin.value), steps + 1))
                out.push(c);
        }

        let left_coin = this.get_coin(coinpos.col - 1, coinpos.row);
        if (left_coin != undefined && left_coin.value == coinpos.val) {
            for (let c of this.get_adj_coins_rec(new CoinPos(coinpos.col - 1, coinpos.row, left_coin.value), steps + 1))
                out.push(c);
        }

        let right_coin = this.get_coin(coinpos.col + 1, coinpos.row);
        if (right_coin != undefined && right_coin.value == coinpos.val) {
            for (let c of this.get_adj_coins_rec(new CoinPos(coinpos.col + 1, coinpos.row, right_coin.value), steps + 1))
                out.push(c);
        }

        // remove duplicates every recursion step
        let unique_out: CoinPos[] = [];
        for (let cp of out)
            if (this.unique_check(unique_out, cp))
                unique_out.push(cp);

        return unique_out;
    }

    unique_check(unique_out: CoinPos[], cp: CoinPos): boolean {
        for (let c of unique_out)
            if (c.col == cp.col && c.row == cp.row)
                return false;
        return true;
    }

    shoot_coins(lane: number, coins: Coin[]): void {
        for (let c of coins)
            this.board[lane].add_coin(c);

        this.update_board(lane);
    }

    grab_coins(lane: number): Coin[] {
        return this.board[lane].grab_coins();
    }

    first_coin(lane: number): Coin | undefined {
        if (this.board[lane].size() == 0)
            return undefined;
        return this.board[lane].get_coin(this.board[lane].size() - 1);
    }
}