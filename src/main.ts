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

export let leftpressed: boolean, rightpressed: boolean, zpressed: boolean, xpressed: boolean = false;
let page: Page = new MainMenu();

gamectx.fillStyle = "black";
gamectx.fillRect(0, 0, gw, gh);
bgctx.fillStyle = "black";
bgctx.fillRect(0, 0, bgcanvas.width, bgcanvas.height);

document.addEventListener('keydown', function (event) {
    if (event.key == "ArrowLeft") leftpressed = true;
    if (event.key == "ArrowRight") rightpressed = true;
    if (event.key == "x") xpressed = true;
    if (event.key == "z") zpressed = true;
});
document.addEventListener('keyup', function (event) {
    if (event.key == "ArrowLeft") leftpressed = false;
    if (event.key == "ArrowRight") rightpressed = false;
    if (event.key == "x") xpressed = false;
    if (event.key == "z") zpressed = false;
});
export function noleft() { leftpressed = false; }
export function noright() { rightpressed = false; }
export function noz() { zpressed = false; }
export function nox() { xpressed = false; }

draw();

function draw() {
    page.draw();

    if (page.next_page != null) page = page.next_page;

    requestAnimationFrame(draw);
}