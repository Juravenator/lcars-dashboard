import { playOnce } from "../sound";
import { randColorNr, unit_gap, unit_height, unit_width } from "../theme";
import { drawButton } from "../tools";
import { MenuEntry } from "../types";
import { Cell, CellInput } from "./cell";
import { SplitMenu } from "./split-menu";

export class MainMenu extends Cell {

  menu: MenuEntry[];

  private currentCell: Cell | undefined;
  private currentCellName: string | undefined;
  private componentCache: {[key: string]: Cell} = {};
  private bottomFillNr = randColorNr();

  constructor(input: CellInput & {menu: MenuEntry[], active?: string}) {
    super(input);
    this.menu = input.menu;
    this.activateMenu(input.active || input.menu.filter(mi => mi.name)[0]?.name || "");
  }

  private activateMenu = (name: string) => {
    if (!this.componentCache[name]) {
      const m = this.menu.filter(mi => mi.name == name)[0];
      if (m?.cell) {
        const w = unit_width + unit_gap;
        this.componentCache[name] = m.cell({x: this.x + w, y: this.y, w: this.w - w, h: this.h})
      }
    }

    if (this.componentCache[name]) {
      this.currentCellName = name;
      this.currentCell = this.componentCache[name];
    }
  }

  frame() {
    let current_y = this.y;
    
    for (const mi of this.menu) {
        current_y += drawButton(mi, this.x, current_y, {highlight: mi.name == this.currentCellName});
    }

    if (current_y < this.y + this.h) {
      drawButton({height: 1, color: this.bottomFillNr}, this.x, current_y, {h: this.y + this.h - current_y});
    }

    if (this.currentCell) {
      this.currentCell.frame()
    }
  }

  click(rootx: number, rooty: number): boolean {
    if (this.currentCell?.click(rootx, rooty)) {
      return true
    }

    const x = rootx - this.x;
    const y = rooty - this.y;
    if (x < 0 || y < 0 || x > unit_width) {
      return false
    }

    let current_y = 0;
    for (const mi of this.menu) {
      const mih = unit_height * (mi.height || 1);
      const match = y >= current_y && y <= current_y+mih;
      current_y += (mih) + unit_gap;
      if (match) {
        if (mi.cell && mi.name) {
          playOnce('blip');
          this.activateMenu(mi.name);
          return true
        } else {
          playOnce('denied');
          return false
        }
      }
    }

    return false
  }
}
