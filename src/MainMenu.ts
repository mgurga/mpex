import { Page } from "./types.ts";
import { bgctx, gamectx, gw, gh, bgw, bgh } from "./main.ts";
import { leftpressed, rightpressed, zpressed, noleft, noright } from "./Inputs.ts"
import Controls from "../assets/controls.png";
import { getImageElement, gwp, ghp, rainbow } from "./Utils.ts"
import { Game } from "./Game.ts";

export class MainMenu implements Page {
    next_page: Page | null = null;
    choice: number = 0;
    tick: number = 0;
    transition_tick: number = 0;
    menu_image: ImageData;

    constructor() { }

    draw(): void {
        if (this.transition_tick >= 1) {
            gamectx.fillStyle = "white";
            gamectx.fillRect(0, 0, gw, gh);

            gamectx.putImageData(this.menu_image, 0, this.transition_tick);

            for (let i = 0; i < 18; i++) {
                gamectx.fillStyle = `rgb(${i * 15}, ${i * 15}, ${i * 15})`;
                gamectx.fillRect(0, this.transition_tick - (i * 45), gw, 45);
                let bgcolor = ((this.transition_tick + 10) / (gh * 2)) * 255;
                bgctx.fillStyle = `rgb(${bgcolor}, ${bgcolor}, ${bgcolor})`;
                bgctx.fillRect(0, 0, bgw, bgh);
            }

            this.transition_tick += 20;
            this.tick++;

            if (this.transition_tick >= gh * 2) this.next_page = new Game();

            return;
        }

        gamectx.fillStyle = "black";
        gamectx.fillRect(0, 0, gw, gh);

        this.draw_logo();
        this.draw_controls();
        this.draw_selection();

        if (leftpressed && this.choice > 0) { this.choice--; noleft(); }
        if (rightpressed && this.choice < 2) { this.choice++; noright(); }
        if (zpressed) {
            this.transition_tick = 1;
            this.menu_image = gamectx.getImageData(0, 0, gw, gh);
        }

        this.tick++;
    }

    draw_logo(): void {
        gamectx.fillStyle = "white";
        gamectx.textAlign = "center";
        gamectx.font = "bold 100px sixtyfour";
        gamectx.fillText("MPEX", gwp(50), ghp(18));
    }

    draw_controls(): void {
        gamectx.drawImage(getImageElement(Controls), gwp(10), ghp(25), gwp(80), ghp(30));
    }

    draw_selection(): void {
        gamectx.fillStyle = "white";
        gamectx.textAlign = "center";
        gamectx.font = "bold 35px sixtyfour";
        gamectx.fillText("gamemode", gwp(50), ghp(65));

        let options = ["timed 1 player", "timed 2 player", "versus"];

        gamectx.textAlign = "left";
        gamectx.font = "bold 25px sixtyfour";
        for (let i = 0; i < 3; i++) {
            if (this.choice == i) {
                gamectx.fillStyle = rainbow(this.tick * 2);
                gamectx.fillText(">" + options[i], gwp(10 + (i * 10)) - 20, ghp(73 + (i * 5)));
            } else {
                gamectx.fillStyle = "white";
                gamectx.fillText(options[i], gwp(10 + (i * 10)), ghp(73 + (i * 5)));
            }
        }
    }
}