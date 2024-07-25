import { gw, gh } from "./main";

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

export function hexToRGB(hex: string) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)!;
    let r: number = parseInt(result[1], 16);
    let g: number = parseInt(result[2], 16);
    let b: number = parseInt(result[3], 16);
    // r /= 255, g /= 255, b /= 255;
    return [r, g, b];
}

export function rand(min: number, max: number): number {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}