import { context } from "../canvas";
import { playOnce } from "../sound";
import { getColor, randColorNr, unit_gap, unit_height, unit_width } from "../theme";
import { Cell } from "./cell";
import { SplitMenu } from "./split-menu";

const menu = [{
  height: 2,
  c: randColorNr(),
}, {
  name: "registration",
  c: randColorNr(),
//   component: AlertsMenu,
  height: 2,
}, {
  name: "operations",
  c: randColorNr(),
//   component: HomeMenu,
  component: true,
}, {
  name: "security",
  c: randColorNr(),
//   component: HomeMenu,
}, {
  name: "science",
  c: randColorNr(),
//   component: HomeMenu,
  height: 2,
}, {
  name: "command",
  c: randColorNr(),
//   component: HomeMenu,
}, {
  name: "engineering",
  c: randColorNr(),
//   component: HomeMenu,
}, {
  name: "map",
  c: randColorNr(),
//   component: HomeMenu,
}, {
  name: "info",
  c: randColorNr(),
//   component: HomeMenu,
}, {
  c: randColorNr(),
}];

export class MainMenu extends Cell {

  private currentComponent: Cell | null = null;
  private componentCache: {[key: string]: Cell} = {};

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

  frame() {
    let current_y = this.y;
    
    for (const mi of menu) {
        context.fillStyle = getColor(mi.c);
        if (mi.name || mi.height) {
          mi.height = mi.height || 1;
          const mih = (unit_height * mi.height) + (unit_gap * (mi.height - 1));
          context.fillRect(this.x, current_y, unit_width, mih);
          current_y += mih + unit_gap;
        } else {
          context.fillRect(this.x, current_y, unit_width, this.y + this.h - current_y);
        }
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
    for (const mi of menu) {
      if (mi.name || mi.height) {
        
        const mih = unit_height * (mi.height || 1);
        const match = y >= current_y && y <= current_y+mih;
        current_y += (mih) + unit_gap;
        if (match) {
          if (mi.component) {
            playOnce('blip');
            mi.c = randColorNr();
            return true
          }
        }
      }
    }

    return false
  }
}
