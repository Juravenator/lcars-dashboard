import { intoMenuEntry } from "../tools";
import { Cell, CellInput } from "./cell";
import { Metrics } from "./metrics";
import { Services } from "./services";
import { SplitMenu } from "./split-menu";
import { ZFS } from "./zfs";

export class Xserve extends Cell {
    menu: SplitMenu;

    constructor(input: CellInput) {
        super(input);
        this.menu = new SplitMenu({
            x: input.x, y: input.y,
            w: input.w, h: input.h,
            topMenu: [{
                name: "core metrics",
                cell: (input: CellInput) => new Metrics(input),
            }].map(intoMenuEntry),
            mainMenu: [{
                name: "zfs",
                cell: (input: CellInput) => new ZFS(input),
            }, {
                name: "services",
                cell: (input: CellInput) => new Services(input),
            }].map(intoMenuEntry),
        })
    }

    frame() {
        this.menu.frame();
    }

    click(rootx: number, rooty: number): boolean {
        if (this.menu.click(rootx, rooty)) {
            return true
        }
        return false;
    }
}