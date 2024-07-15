export interface Page {
    draw(): void;
    next_page: Page | null;
}