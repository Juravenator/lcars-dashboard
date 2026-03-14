import { context } from "../canvas";
import { metrics_data } from "../store/metrics";
import { getColor, unit_gap } from "../theme";
import { Cell } from "./cell";

const column_width = 100;
let last_newest = 0;

export class Metrics extends Cell {
    frame() {
        context.font = "700 18px Antonio,'Arial Narrow','Avenir Next Condensed','sans-serif'";
        let current_y = this.y + 18;
        let current_x= this.x + 100;
        for (let i = 0; i < metrics_data.metrics.length; i++) {
            const metrics = metrics_data.metrics[i] || [];
            const is_newest = i == metrics_data.last_updated && last_newest != metrics_data.last_updated;
            if (is_newest) {
                last_newest = metrics_data.last_updated;
            }
            for (const section of metrics) {
                context.fillStyle = 'white';
                for (const s of section) {
                    context.fillText(s, current_x, current_y);
                    context.fillStyle = is_newest ? 'white' : getColor(metrics_data.colors[i]!);
                    current_x += column_width;
                    if (current_x + column_width > this.x + this.w) {
                        current_x = this.x + 100;
                        current_y += 18 + unit_gap;
                    }
                    if (current_y + 18 > this.y + this.h) {
                        return
                    }
                }
            }
        }
    }

    click(x: number, y: number) {
        return false
    }
}