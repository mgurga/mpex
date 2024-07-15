import { Page } from "./types.ts";
import { gamectx, gw, gh, leftpressed, rightpressed, zpressed, noleft, noright } from "./main.ts";
import Controls from "../assets/controls.png";
import { getImageElement, gwp, ghp, rainbow } from "./Utils.ts"
// import { rainbow } from "./Utils.ts"

export class MainMenu implements Page {
    next_page: Page | null = null;
    choice: number = 0;
    tick: number = 0;

    constructor() {}

    draw(): void {
        gamectx.fillStyle = "black";
        gamectx.fillRect(0, 0, gw, gh);

        this.draw_logo();
        this.draw_controls();
        this.draw_selection();

        if (leftpressed && this.choice > 0) { this.choice--; noleft(); }
        if (rightpressed && this.choice < 2) { this.choice++; noright(); }
        if (zpressed) { console.log(`choice #${this.choice} clicked`); }

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