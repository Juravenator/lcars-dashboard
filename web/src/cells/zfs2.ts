import { context } from "../canvas";
import { playOnce } from "../sound";
import { zfs_data } from "../store/zfs";
import { getColor, randColorNr, unit_gap, unit_height, unit_width } from "../theme";
import { toXiB } from "../tools";
import { Cell } from "./cell";

export class ZFS2 extends Cell {

    private dividerNr = randColorNr();
    private selected_zpool: number | undefined;

    frame() {
        let current_y = this.y;

        // title
        context.fillStyle = 'white';
        context.font = "700 65px Antonio,'Arial Narrow','Avenir Next Condensed','sans-serif'";
        {
            const t = "ZPOOL STATUS";
            const m = context.measureText(t);
            context.fillText(t, this.x + this.w - m.width - 12, this.y + 65);
        }
        current_y += unit_height + unit_gap;

        // zpool list
        for (let i = 0; i < zfs_data.status.pools.length; i++) {
            const zpool = zfs_data.status.pools[i]!;

            let current_x = this.x;
            // health
            if (this.selected_zpool == i) {
                context.fillStyle = "white";
            } else if (zpool.health == "ONLINE") {
                context.fillStyle = 'green';
            } else {
                context.fillStyle = 'red';
            }
            context.fillRect(current_x, current_y, 10, unit_height);
            current_x += 10 + unit_gap;

            // name
            context.fillStyle = getColor(zfs_data.pool_colors[i]![0]);
            context.fillRect(current_x, current_y, unit_width, unit_height);
            context.fillStyle = 'black';
            context.font = "700 20px Antonio,'Arial Narrow','Avenir Next Condensed','sans-serif'";
            {
                const m = context.measureText(zpool.name);
                context.fillText(zpool.name, current_x + unit_width - m.width - 12, current_y + unit_height - 6);
            }
            current_x += unit_width + unit_gap;

            // disk active
            for (let i2 = 0; i2 < zpool.disks.length; i2++) {
                const disk = zpool.disks[i2]!;
                if (disk.spinning == 'STANDBY') {
                    context.fillStyle = 'gray';
                } else {
                    context.fillStyle = 'white';
                }
                context.fillRect(current_x, current_y, 10, unit_height);
                current_x += 10 + unit_gap;
            }

            // total space
            context.fillStyle = getColor(zfs_data.pool_colors[i]![1]);
            context.fillRect(current_x, current_y, 100, unit_height);
            context.fillStyle = 'black';
            {
                const t = toXiB(zpool.size);
                const m = context.measureText(t);
                context.fillText(t, current_x + 100 - m.width - 12, current_y + unit_height - 6);
            }
            current_x += 100 + unit_gap;

            // used space
            const perc = zpool.alloc * 100 / zpool.size;
            if (perc > 80) {
                context.fillStyle = 'red';
            } else if (perc > 60) {
                context.fillStyle = 'orange';
            } else {
                context.fillStyle = getColor(zfs_data.pool_colors[i]![2]);
            }
            context.fillRect(current_x, current_y, 100, unit_height);
            context.fillStyle = 'black';
            {
                const t = `${Math.ceil(perc)}%`;
                const m = context.measureText(t);
                context.fillText(t, current_x + 100 - m.width - 12, current_y + 20);
            }
            {
                const t = toXiB(zpool.alloc);
                const m = context.measureText(t);
                context.fillText(t, current_x + 100 - m.width - 12, current_y + unit_height - 6);
            }
            current_x += 100 + unit_gap;
        }

        // selected zpool status
        if (this.selected_zpool != undefined) {
            context.fillStyle = 'white';
            context.font = "700 16px 'IBM Plex Mono',monospace";
            const lines = zfs_data.status.pools[this.selected_zpool]!.status.split("\n").reverse();
            const lines_m = lines.map(t => context.measureText(t));
            const max_m = Math.max(...lines_m.map(m => m.width));
            const x = this.x + this.w - max_m - 12;

            for (let i = 0; i < lines.length; i++) {
                context.fillText(lines[i]!, x, this.y + this.h - 12 - i * 20);
            }
        }
    }

    click(x: number, y: number) {
        if (x < this.x || x > this.x + this.w || y < this.y || y > this.y + this.h) {
            return false;
        }
        for (let i = 0; i < zfs_data.status.pools.length; i++) {
            if (y < this.y + (i + 1) * (unit_height * unit_gap)) {
                this.selected_zpool = i;
                playOnce('blip');
                return true;
            }
        }
        return false;
    }
}