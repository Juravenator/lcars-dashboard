import { context } from "../canvas";
import { Cell } from "./cell";

export class CERN extends Cell {
    frame() {
        context.fillStyle = 'white';
        context.fillRect(this.x, this.y, 10, 10);
    }

    click(x: number, y: number): boolean {
        return false;
    }
}