import { Page } from "./types";

export class Game implements Page {
    next_page: Page | null = null;

    constructor() { }

    draw() { }
}