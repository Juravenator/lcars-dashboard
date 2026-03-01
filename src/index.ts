import 'audioContext-polyfill';
import { canvas, clearCanvas } from "./canvas";
import * as mainMenu from "./cells/main-menu";

window.requestAnimationFrame =
  window.requestAnimationFrame ||
  (window as any).webkitRequestAnimationFrame ||
  (window as any).mozRequestAnimationFrame ||
  function (cb) { return setTimeout(cb, 1000/60); };

let frame_t: number | undefined;
const frame = () => {
    // requestAnimationFrame(frame);
    clearCanvas();
    mainMenu.frame(0, 0, canvas.width, canvas.height);
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
