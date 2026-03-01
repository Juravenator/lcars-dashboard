import { context } from "../canvas";
import { playOnce } from "../sound";
import { getColor, randColorNr, unit_gap, unit_height, unit_width } from "../theme";

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
}]

export const frame = (x: number, y: number, w: number, h: number) => {
    let current_y = 0;
    
    for (const mi of menu) {
        context.fillStyle = getColor(mi.c);
        if (mi.name || mi.height) {
          const mih = unit_height * (mi.height || 1);
          context.fillRect(x, current_y, unit_width, mih);
          current_y += (mih) + unit_gap;
        } else {
          context.fillRect(x, current_y, unit_width, h-current_y);
        }
    }
}

export const click = (x: number, y: number): boolean => {
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
