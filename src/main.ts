import { MainMenu } from "./MainMenu";
import { Page } from "./types";

export const gamecanvas: HTMLCanvasElement = document.getElementById("game")! as HTMLCanvasElement;
export const gamectx = gamecanvas.getContext("2d")!;
gamecanvas.width = gamecanvas.clientWidth;
gamecanvas.height = gamecanvas.clientHeight;
export const gw = gamecanvas.width; // game canvas width
export const gh = gamecanvas.height; // game canvas height

export const bgcanvas: HTMLCanvasElement = document.getElementById("bg") as HTMLCanvasElement;
export const bgctx = bgcanvas.getContext("2d")!;
bgcanvas.width = bgcanvas.clientWidth;
bgcanvas.height = bgcanvas.clientHeight;
export const bgw = bgcanvas.width; // background canvas width
export const bgh = bgcanvas.height; // background canvas height

let page: Page = new MainMenu();

gamectx.fillStyle = "black";
gamectx.fillRect(0, 0, gw, gh);
bgctx.fillStyle = "black";
bgctx.fillRect(0, 0, bgcanvas.width, bgcanvas.height);

draw();

function draw() {
    page.draw();

    if (page.next_page != null) page = page.next_page;

    requestAnimationFrame(draw);
}