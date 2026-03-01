import 'audioContext-polyfill';
import { canvas, clearCanvas } from "./canvas";
import { MainMenu } from './cells/main-menu';
import { randColorNr } from './theme';
import { MenuEntry } from './types';

window.requestAnimationFrame =
  window.requestAnimationFrame ||
  (window as any).webkitRequestAnimationFrame ||
  (window as any).mozRequestAnimationFrame ||
  function (cb) { return setTimeout(cb, 1000/60); };

const menu = [{
  height: 2,
},{
  name: "alerts",
  height: 2,
}, {
  name: "home",
}, {
  name: "calendar",
}, {
  name: "weather",
  height: 2,
}, {
  name: "xServe",
  height: 2,
}, {
  name: "CERN",
}, {
  name: "space",
}].map((mi: any) => {
    mi.color = randColorNr();
    mi.height = mi.height || 1;
    return mi as MenuEntry;
});

const mainMenu = new MainMenu({
    x: 0, y: 0, w: canvas.width, h: canvas.height,
    menu, active: "xServe"
});

let frame_t: number | undefined;
const frame = () => {
    clearCanvas();
    mainMenu.frame();
    frame_t = setTimeout(() => requestAnimationFrame(frame), 500);
}
requestAnimationFrame(frame);

const click = (x: number, y: number) => {
    const needupdate = mainMenu.click(x, y);
    if (needupdate) {
        clearTimeout(frame_t);
        requestAnimationFrame(frame);
    }
}
export const isTouchDevice = 'ontouchstart' in window;
if (isTouchDevice) {
    addEventListener('touchstart', e => {
        const t = e.touches[0];
        if (t) {
            click(t.clientX, t.clientY);
        }
        e.stopPropagation();
        e.preventDefault();
    }, {passive: true});
} else {
    addEventListener('click', e => click(e.clientX, e.clientY));
}
