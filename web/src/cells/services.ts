import { redraw } from "..";
import { context } from "../canvas";
import { playOnce } from "../sound";
import { services_data, ServiceStatus } from "../store/services";
import { getColor, unit_gap, unit_height, unit_width } from "../theme";
import { Cell } from "./cell";

export class Services extends Cell {
    frame() {
        let current_y = this.y;
        let current_x = this.x;

        context.fillStyle = 'white';
        context.font = "700 65px Antonio,'Arial Narrow','Avenir Next Condensed','sans-serif'";
        {
            const t = "SERVICES";
            const m = context.measureText(t);
            context.fillText(t, this.x + this.w - m.width - 12, this.y + 65);
        }
        current_y += unit_height + unit_gap;

        for (let i = 0; i < services_data.services.length; i++) {
            const prev_x = current_x;
            const svc = services_data.services[i]!;
            
            // left hand rounded corner
            context.fillStyle = getColor(services_data.service_colors[i]![0]);
            context.beginPath();
            context.moveTo(current_x + 35 + 10, current_y);
            context.lineTo(current_x + 35, current_y);
            context.arcTo (current_x, current_y,
                           current_x, current_y + unit_height / 2,
                           35);
            context.arcTo (current_x, current_y + unit_height,
                           current_x + 35, current_y + unit_height,
                           35);
            context.lineTo(current_x + 35 + 10, current_y + unit_height);
            context.closePath();
            context.fill();
            current_x += 35 + 10 + unit_gap;

            // name box
            context.fillStyle = getColor(services_data.service_colors[i]![1]);
            context.fillRect(current_x, current_y, unit_width, unit_height);
            context.fillStyle = 'black';
            {
                const r = new RegExp(svc.namespace, 'g');
                let t = svc.name.replace(r, "").split("-").filter(p => p).join("-");
                if (!t) {
                    t = "app"
                }

                context.font = "700 20px Antonio,'Arial Narrow','Avenir Next Condensed','sans-serif'";
                const m_max = unit_width - 24;
                const m = context.measureText(t);
                context.fillText(t, current_x + unit_width - Math.min(m.width, m_max) - 12, current_y + unit_height - 6, unit_width - 24);
            }
            {
                context.font = "16px Antonio,'Arial Narrow','Avenir Next Condensed','sans-serif'";
                const m_max = unit_width - 24;
                const m = context.measureText(svc.namespace);
                context.fillText(svc.namespace, current_x + unit_width - Math.min(m.width, m_max) - 12, current_y + unit_height - 6 - 20 - 6, unit_width - 24);
            }
            current_x += unit_width + unit_gap;

            // health bar
            if (svc.num_desired == svc.num_ready) {
                context.fillStyle = 'green';
            } else {
                context.fillStyle = 'red';
            }
            context.fillRect(current_x, current_y, 10, unit_height);
            current_x += 10 + unit_gap;

            // restart button
            context.fillStyle = getColor(services_data.service_colors[i]![2]);
            context.fillRect(current_x, current_y, 100, unit_height);
            {
                context.fillStyle = 'black';
                context.font = "700 16px Antonio,'Arial Narrow','Avenir Next Condensed','sans-serif'";
                const m = context.measureText('restart');
                context.fillText('restart', current_x + 100 - m.width - 12, current_y + unit_height / 2 + 8);
            }
            current_x += 100 + unit_gap;

            // right hand rounded corner
            context.fillStyle = getColor(services_data.service_colors[i]![3]);
            context.beginPath();
            context.moveTo(current_x, current_y);
            context.lineTo(current_x + 10, current_y);
            context.arcTo (current_x + 10 + 35, current_y,
                           current_x + 10 + 35, current_y + unit_height / 2,
                           35);
            context.arcTo (current_x + 10 + 35, current_y + unit_height,
                           current_x + 10, current_y + unit_height,
                           35);
            context.lineTo(current_x, current_y + unit_height);
            context.closePath();
            context.fill();
            current_x += 10 + 35 + unit_gap;

            if (current_x + (current_x - prev_x) > this.x + this.w) {
                current_x = this.x;
                current_y += unit_height + unit_gap;
            }
        }
    }

    click(x: number, y: number) {
        if (x < this.x || x > this.x + this.w || y < this.y || y > this.y + this.h) {
            return false;
        }
        let current_x = this.x;
        let current_y = this.y + unit_height + unit_gap;
        for (const svc of services_data.services) {
            const prev_x = current_x;
            // left hand rounded corner
            current_x += 35 + 10 + unit_gap;
            // name box
            current_x += unit_width + unit_gap;
            // health bar
            current_x += 10 + unit_gap;
            // restart button            
            if (y > current_y && y < current_y + unit_height &&
                x > current_x && x < current_x + 100) {
                    this.restart(svc);
                    return false;
            }
            current_x += 100 + unit_gap;
            // right hand rounded corner
            current_x += 10 + 35 + unit_gap;
            if (current_x + (current_x - prev_x) > this.x + this.w) {
                current_x = this.x;
                current_y += unit_height + unit_gap;
            }
        }

        return false
    }

    private restart(service: ServiceStatus) {
        const t = setTimeout(() => playOnce('blip'), 100);
        const req = new XMLHttpRequest();
        req.addEventListener("load", () => {
            if (req.status != 200) {
                clearTimeout(t);
                playOnce('denied');
            } else {
                service.num_ready = 0;
                redraw();
            }
        });
        req.open("GET", `/api/deployments/${service.namespace}/${service.kind}/${service.name}/restart`);
        req.send();
    }
}