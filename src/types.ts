import { ColorScheme } from "./ColorScheme";

export interface Page {
    draw(): void;
    next_page: Page | null;
}

export interface Drawable {
    draw(x: number, y: number, cs: ColorScheme, w?: number, h?: number): void;
}