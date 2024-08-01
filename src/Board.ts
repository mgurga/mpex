import { Drawable } from "./types";
import { Coin } from "./Coin"
import { ColorScheme } from "./ColorScheme";
import { LANES } from "./Game"
import { rand } from "./Utils";
import { gw } from "./main";
import easingsFunctions from "./Easings"

class CoinPos {
    row: number;
    col: number;
    val: number;

    constructor(col: number, row: number, val: number) {
        this.row = row;
        this.col = col;
        this.val = val;
    }
}

enum Action {
    AddCoin,
    ScreenFlash
};

class AfterAction {
    action: Action;
    constructor(a: Action) { this.action = a; }
}

class AddCoinAction extends AfterAction {
    value: number;
    lane: number;

    constructor(value: number, lane: number) {
        super(Action.AddCoin);
        this.value = value;
        this.lane = lane;
    }
}

class CoinAnim {
    start_tick: number;
    end_tick: number;

    x1: number;
    y1: number;
    x2: number;
    y2: number;

    coin_value: number;

    after_action: AfterAction;

    constructor(st: number, et: number, x1: number, y1: number, x2: number, y2: number, cv: number, aa: AfterAction) {
        this.start_tick = st;
        this.end_tick = et;
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.coin_value = cv;
        this.after_action = aa;
    }
}

class BoardColumn {
    private col: Coin[] = [];

    add_coin(c: Coin): void { this.col.push(c); }
    get_coin(i: number): Coin | undefined { return this.col[i] }

    front(): Coin | undefined { return this.col[0]; }
    back(): Coin | undefined { return this.col[this.size() - 1]; }

    size(): number { return this.col.length; }

    remove_coin(i: number): void { delete this.col[i]; }

    cleanup() {
        this.col = this.col.filter(function (obj) {
            return obj.cleanup != true;
        });
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
    anims: CoinAnim[] = [];
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

    get_lane_width(): number { return ((gw - 30) / LANES); }
    get_coin_size(): number { return ((gw - 30) / LANES) - 10; }
    get_row_height(): number { return (this.get_coin_size() + 10); }

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
                if (bc.get_coin(j) == undefined) continue;
                let coinsize = this.get_coin_size();
                bc.get_coin(j)!.draw(i * this.get_lane_width() + 20, (j * (coinsize + 10)) + 17, cs, coinsize, coinsize);
            }
        }

        this.draw_anims(cs);

        this.tick++;
    }

    draw_anims(cs: ColorScheme): void {
        for (let anim of this.anims) {
            if (anim.start_tick > this.tick) continue;

            let progress = (this.tick - anim.start_tick) / (anim.end_tick - anim.start_tick);
            let c = new Coin(anim.coin_value);
            c.draw(anim.x1 + (anim.x2 - anim.x1) * progress,
                anim.y1 + (anim.y2 - anim.y1) * easingsFunctions.easeOutBounce(progress),
                cs, this.get_coin_size(), this.get_coin_size());

            if (anim.end_tick <= this.tick)
                this.handle_after_action(anim.after_action);
        }

        this.anims = this.anims.filter((obj) => {
            return obj.end_tick > this.tick;
        });
    }

    handle_after_action(aa: AfterAction): void {
        if (aa.action == Action.AddCoin) {
            let aca = aa as AddCoinAction;
            this.board[aca.lane].add_coin(new Coin(aca.value));
        }
    }

    cleanup_board(): void {
        for (let i = 0; i < LANES; i++)
            this.board[i].cleanup();
    }

    update_board(start_lane: number): void {
        let bc = this.board[start_lane];
        let start_coin_pos = new CoinPos(start_lane, bc.size() - 1, bc.back()!.value);
        let adj_coins = this.get_adj_coins(start_coin_pos);

        // upgrade 1s to 5
        if (start_coin_pos.val == 1 && adj_coins.length >= 5)
            this.upgrade_coins(adj_coins, 5, 5);

        // upgrade 5s to 10
        if (start_coin_pos.val == 5 && adj_coins.length >= 2)
            this.upgrade_coins(adj_coins, 2, 10);

        // upgrade 10s to 50
        if (start_coin_pos.val == 10 && adj_coins.length >= 5)
            this.upgrade_coins(adj_coins, 5, 50);

        // upgrade 50s to 100
        if (start_coin_pos.val == 50 && adj_coins.length >= 2)
            this.upgrade_coins(adj_coins, 2, 100);

        // upgrade 100s to 500
        if (start_coin_pos.val == 100 && adj_coins.length >= 5)
            this.upgrade_coins(adj_coins, 5, 500);
    }

    upgrade_coins(adj_coins: CoinPos[], coin_num: number, new_coin_value: number): void {
        let lowest_row = adj_coins[0].row;

        for (let i = 0; i < coin_num; i++) {
            this.board[adj_coins[i].col].get_coin(adj_coins[i].row)!.sparkle();

            if (adj_coins[0].col == adj_coins[i].col && lowest_row > adj_coins[i].row)
                lowest_row = adj_coins[i].row;
        }

        let aa: AfterAction = new AddCoinAction(new_coin_value, adj_coins[0].col);
        let ca = new CoinAnim(this.tick + 50, this.tick + 50 + (adj_coins[0].row - lowest_row) * 10,
            this.get_lane_width() * adj_coins[0].col + 20, (adj_coins[0].row * this.get_row_height()) + 17,
            this.get_lane_width() * adj_coins[0].col + 20, (lowest_row * this.get_row_height()) + 17,
            new_coin_value, aa);
        this.anims.push(ca);
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