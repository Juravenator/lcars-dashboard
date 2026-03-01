import { context } from "./canvas";
import { getColor, randColorNr, unit_gap, unit_height, unit_width } from "./theme";
import { MenuEntry } from "./types";

// let showHighlights = false;
// setInterval(() => {
//     showHighlights = !showHighlights;
// }, 500);

export const drawButton = (b: MenuEntry, x: number, y: number, {h = unit_height, w = unit_width, highlight = false} = {}) => {
    context.fillStyle = getColor(b.color, highlight);
    const mih = (h * b.height) + (unit_gap * (b.height - 1));
    context.fillRect(x, y, w, mih);

    if (b.name) {
        const t = b.name.toUpperCase();
        context.font = "700 16px Inter,Avenir,Helvetica,Arial,sans-serif";
        const m = context.measureText(t);
        context.fillStyle = 'black';
        context.fillText(t, x + w - m.width - 12, y + mih - 6);
    }

    return mih + unit_gap;
}

export const intoMenuEntry = (mi: any) => {
    mi.color = mi.color || randColorNr();
    mi.height = mi.height || 1;
    return mi as MenuEntry;
};