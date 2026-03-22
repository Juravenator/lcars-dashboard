export interface CellInput {
    x: number;
    y: number;
    w: number;
    h: number;
}

export abstract class Cell {
    x: number;
    y: number;
    w: number;
    h: number;

    constructor(input: CellInput) {
        this.x = input.x;
        this.y = input.y;
        this.w = input.w;
        this.h = input.h;
    }

    abstract frame(): void;
    abstract click(x: number, y: number): boolean;
}