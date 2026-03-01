import { context } from "../canvas";
import { playOnce } from "../sound";
import { getColor, randColorNr, unit_gap, unit_height, unit_width } from "../theme";
import { MenuEntry } from "../types";
import { Cell, CellInput } from "./cell";
import { SplitMenu } from "./split-menu";

export class MainMenu extends Cell {

  menu: MenuEntry[];

  private currentComponent: Cell | null = null;
  private componentCache: {[key: string]: Cell} = {};
  private bottomFillNr = randColorNr();

  private splitMenu = new SplitMenu({
    x: this.x + unit_width + unit_gap, y: this.y,
    w: this.w - unit_width - unit_gap, h: this.h,
    topMenu: [{
      height: 3,
      color: randColorNr(),
    }],
    mainMenu: [{
      height: 3,
      color: randColorNr(),
    }],
  });

  constructor(input: CellInput & {menu: MenuEntry[]}) {
    super(input);
    this.menu = input.menu;
  }

  frame() {
    let current_y = this.y;
    
    for (const mi of this.menu) {
        context.fillStyle = getColor(mi.color);
        const mih = (unit_height * mi.height) + (unit_gap * (mi.height - 1));
        context.fillRect(this.x, current_y, unit_width, mih);
        current_y += mih + unit_gap;
    }

    if (current_y < this.y + this.h) {
      context.fillStyle = getColor(this.bottomFillNr);
      context.fillRect(this.x, current_y, unit_width, this.y + this.h - current_y);
    }

    this.splitMenu.frame();
  }

  click(rootx: number, rooty: number): boolean {
    const x = rootx - this.x;
    const y = rooty - this.y;
    if (x > unit_width) {
      return false
    }

    let current_y = 0;
    for (const mi of this.menu) {
      if (mi.name || mi.height) {
        
        const mih = unit_height * (mi.height || 1);
        const match = y >= current_y && y <= current_y+mih;
        current_y += (mih) + unit_gap;
        if (match) {
          if (mi.cell) {
            playOnce('blip');
            mi.color = randColorNr();
            return true
          }
        }
      }
    }

    return false
  }
}
