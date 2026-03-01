import { intoMenuEntry } from "../tools";
import { Cell, CellInput } from "./cell";
import { SplitMenu } from "./split-menu";

export class Xserve extends Cell {
    menu: SplitMenu;

    constructor(input: CellInput) {
        super(input);
        this.menu = new SplitMenu({
            x: input.x, y: input.y,
            w: input.w, h: input.h,
            topMenu: [{
                name: "core metrics"
            }].map(intoMenuEntry),
            mainMenu: [{
                name: "zfs",
            }, {
                name: "services",
            }].map(intoMenuEntry),
        })
    }

    frame() {
        this.menu.frame();
    }

    click(x: number, y: number): boolean {
        return false;
    }
}