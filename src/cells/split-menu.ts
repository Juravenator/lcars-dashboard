import { context } from "../canvas";
import { playOnce } from "../sound";
import { getColor, randColorNr, unit_gap, unit_height, unit_width } from "../theme";
import { drawButton } from "../tools";
import { MenuEntry } from "../types";
import { Cell } from "./cell";


export class SplitMenu extends Cell {
    topMenu: MenuEntry[];
    mainMenu: MenuEntry[];

    private topArchNr = randColorNr();
    private mainArchNr = randColorNr();
    private mainFillerNr = randColorNr();

    private currentTopCell: Cell | undefined;
    private currentTopName: string | undefined;
    private topCache: {[key: string]: Cell} = {};
    private currentMainCell: Cell | undefined;
    private currentMainName: string | undefined;
    private mainCache: {[key: string]: Cell} = {};

    constructor(input: {
        x: number, y: number, w: number, h: number,
        topMenu: MenuEntry[], mainMenu: MenuEntry[],
        topActive?: string, mainActive?: string,
    }) {
        super(input);
        this.topMenu = input.topMenu;
        this.mainMenu = input.mainMenu;

        const topActive = input.topMenu.filter(mi => input.topActive ? mi.name == input.topActive : mi.name)[0];
        topActive && this.activateTopMenu(topActive);
        const mainActive = input.mainMenu.filter(mi => input.mainActive ? mi.name == input.mainActive : mi.name)[0];
        mainActive && this.activateMainMenu(mainActive);
    }


    private activateTopMenu = (mi: MenuEntry) => {
        if (!mi.name) {
            return
        }
        const name = mi.name;
        if (!this.topCache[name]) {
            if (mi?.cell) {
                const w = unit_width + unit_gap;
                this.topCache[name] = mi.cell({x: this.x + w, y: this.y, w: this.w - w, h: this.h})
            }
        }

        if (this.topCache[name]) {
            this.currentTopName = name;
            this.currentTopCell = this.topCache[name];
        }
    }
    private activateMainMenu = (mi: MenuEntry) => {
        if (!mi.name) {
            return
        }
        const name = mi.name;
        if (!this.mainCache[name]) {
            if (mi?.cell) {
                const w = unit_width + unit_gap;
                const y = (unit_height + unit_gap) * (this.topMenu.map(mi => mi.height).reduce((a, b) => a + b, 3));
                this.mainCache[name] = mi.cell({x: this.x + w, y: this.y + y, w: this.w - w, h: this.h})
            }
        }

        if (this.mainCache[name]) {
            this.currentMainName = name;
            this.currentMainCell = this.mainCache[name];
        }
    }

    frame() {
        this.currentTopCell?.frame();
        this.currentMainCell?.frame();

        let current_y = this.y;

        for (const mi of this.topMenu) {
            current_y += drawButton(mi, this.x, current_y, {highlight: this.currentTopName == mi.name});
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
            current_y += drawButton(mi, this.x, current_y, {highlight: this.currentMainName == mi.name});
        }
        if (current_y < this.y + this.h) {
            drawButton({height: 1, color: this.mainFillerNr}, this.x, current_y, {h: this.y + this.h - current_y});
        }
    }

    click(rootx: number, rooty: number): boolean {
        if (this.currentTopCell?.click(rootx, rooty) || this.currentMainCell?.click(rootx, rooty)) {
            return true;
        }
        const x = rootx - this.x;
        const y = rooty - this.y;
        if (x < 0 || y < 0 || x > unit_width) {
            return false
        }

        let current_y = 0;
        for (const mi of this.topMenu) {
            const mih = (unit_height + unit_gap) * mi.height;
            const match = y >= current_y && y <= current_y+mih;
            current_y += mih;
            if (match) {
                if (mi.cell && mi.name) {
                    playOnce('blip');
                    this.activateTopMenu(mi);
                    return true
                } else {
                    return false
                }
            }
        }

        current_y += (unit_height + unit_gap) * 5;
        for (const mi of this.mainMenu) {
            const mih = (unit_height + unit_gap) * mi.height;
            const match = y >= current_y && y <= current_y+mih;
            current_y += mih;
            if (match) {
                if (mi.cell && mi.name) {
                    playOnce('blip');
                    this.activateMainMenu(mi);
                    return true
                } else {
                    playOnce('denied');
                    return false
                }
            }
        }

        // let topY = (unit_height + unit_gap) * this.topMenu.map(mi => mi.height).reduce((a, b) => a + b);
        // if (y < topY) {
        //     const i = Math.floor(y / (unit_height + unit_gap))
        //     const mi = this.topMenu[i]!;
        //     if (mi.name) {
        //         this.activateTopMenu(mi);
        //         return true;

        //     }
        // }
        // let bottomY = topY + (unit_height + unit_gap) * 5;
        // topY = bottomY + (unit_height + unit_gap) * this.mainMenu.map(mi => mi.height).reduce((a,b) => a + b);
        // if (y > bottomY && y < topY) {
        //     const i = Math.floor((y - bottomY) / (unit_height + unit_gap));
        //     const mi = this.mainMenu[i]!;
        //     if (mi.name) {
        //         this.activateMainMenu(mi);
        //         return true;
        //     }
        // }
        
        return false;
    }
}