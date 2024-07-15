import { gw, gh } from "./main.ts";

// game canvas width percentage
export function gwp(p: number): number { return gw * (p / 100); }

// game canvas height percentage
export function ghp(p: number): number { return gh * (p / 100); }

export function getImageElement(data: string): HTMLImageElement {
    var img = new Image();
    img.src = data;
    return img;
}

export function rainbow(i: number): string {
    return "hsl(" + (i % 360) + " , 100%, 50%)";
}