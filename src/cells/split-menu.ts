import { context } from "../canvas";
import { getColor, randColorNr, unit_gap, unit_height, unit_width } from "../theme";
import { Cell } from "./cell";

export interface MenuEntry {
    height: number;
    color: number;
    cell?: Cell;
    name?: string;
}

export class SplitMenu extends Cell {
    topMenu: MenuEntry[];
    mainMenu: MenuEntry[];

    private topArchNr = randColorNr();
    private mainArchNr = randColorNr();
    private mainFillerNr = randColorNr();

    constructor(input: {
        x: number, y: number, w: number, h: number,
        topMenu: MenuEntry[], mainMenu: MenuEntry[]
    }) {
        super(input);
        this.topMenu = input.topMenu;
        this.mainMenu = input.mainMenu;
    }

    frame() {
        let current_y = this.y;

        for (const mi of this.topMenu) {
            context.fillStyle = getColor(mi.color);
            const mih = (unit_height * mi.height) + (unit_gap * (mi.height - 1));
            context.fillRect(this.x, current_y, unit_width, mih);
            current_y += mih + unit_gap;
        }

        const middlebarHeight = (unit_height - unit_gap) / 2;
        const innerArc = unit_height + unit_gap;
        const outerArc = innerArc + middlebarHeight;

        /* top arc */
        {
            context.fillStyle = getColor(this.topArchNr);
            context.fillRect(this.x, current_y, unit_width, unit_height + unit_gap);
            current_y += unit_height + unit_gap;
            context.beginPath();
            context.moveTo(this.x, current_y);
            context.lineTo(this.x + unit_width, current_y);
            context.arcTo(
                this.x + unit_width, current_y + innerArc,
                this.x + unit_width + innerArc, current_y + innerArc,
                innerArc,
            );
            current_y += innerArc + middlebarHeight;
            context.lineTo(this.x + unit_width + innerArc, current_y);
            context.lineTo(this.x + outerArc, current_y);
            context.arcTo(
                this.x, current_y,
                this.x, current_y - outerArc,
                outerArc
            );
            context.closePath();
            context.fill();
            context.fillRect(this.x + unit_width + innerArc, current_y - middlebarHeight, this.w - unit_width - innerArc, middlebarHeight);
            current_y += unit_gap;
        }
        /* bottom arc */
        {
            context.fillStyle = getColor(this.mainArchNr);
            context.fillRect(this.x + unit_width + innerArc, current_y, this.w - unit_width - innerArc, middlebarHeight);
            context.beginPath();
            context.moveTo(this.x + unit_width + innerArc, current_y);
            context.lineTo(this.x + unit_width + innerArc, current_y + middlebarHeight);
            context.arcTo(
                this.x + unit_width, current_y + middlebarHeight,
                this.x + unit_width, current_y + middlebarHeight + innerArc,
                innerArc
            );
            context.lineTo(this.x, current_y + outerArc);
            context.arcTo(
                this.x, current_y,
                this.x + outerArc, current_y,
                outerArc,
            )
            current_y += outerArc;
            context.closePath();
            context.fill();
            context.fillRect(this.x, current_y, unit_width, unit_height + unit_gap);
            current_y += unit_height + unit_gap + unit_gap;
        }

        for (const mi of this.mainMenu) {
            context.fillStyle = getColor(mi.color);
            const mih = (unit_height * mi.height) + (unit_gap * (mi.height - 1));
            context.fillRect(this.x, current_y, unit_width, mih);
            current_y += mih + unit_gap;
        }
        if (current_y < this.y + this.h) {
            context.fillStyle = getColor(this.mainFillerNr);
            context.fillRect(this.x, current_y, unit_width, this.y + this.h - current_y);
        }
    }

    click(x: number, y: number): boolean {
        return false
    }
}