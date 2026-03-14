import { context } from "../canvas";
import { playOnce } from "../sound";
import { zfs_data } from "../store/zfs";
import { getColor, randColorNr, unit_gap, unit_height, unit_width } from "../theme";
import { toXiB } from "../tools";
import { Cell } from "./cell";

export class ZFS extends Cell {

    private dividerNr = randColorNr();


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

        for (let i = 0; i < zfs_data.status.pools.length; i++) {
            const zpool = zfs_data.status.pools[i]!;

            // name
            context.fillStyle = getColor(zfs_data.pool_colors[i]![0]);
            context.fillRect(this.x, current_y, unit_width, unit_height);
            context.fillStyle = 'black';
            context.font = "700 20px Antonio,'Arial Narrow','Avenir Next Condensed','sans-serif'";
            {
                const m = context.measureText(zpool.name);
                context.fillText(zpool.name, this.x + unit_width - m.width - 12, current_y + unit_height - 6);
            }

            // health
            if (zpool.health == "ONLINE") {
                context.fillStyle = 'green';
            } else {
                context.fillStyle = 'red';
            }
            context.fillRect(this.x + unit_width + unit_gap, current_y, 10, unit_height);

            // progress box
            const perc = zpool.alloc * 100 / zpool.size;
            if (perc > 80) {
                context.fillStyle = 'red';
            } else if (perc > 60) {
                context.fillStyle = 'orange';
            } else {
                context.fillStyle = getColor(zfs_data.pool_colors[i]![1]);
            }
            context.fillRect(this.x + unit_width + unit_gap * 2 + 10, current_y, 100, unit_height);
            let x_start = unit_width + unit_gap * 2 + 110;
            const bar_w = this.w - x_start - unit_gap;
            x_start += this.x;
            context.fillRect(x_start, current_y, bar_w, 20);
            const bar_interval = bar_w / 10;
            for (let i = 0; i <=10-2; i++) {
                context.fillRect(x_start + bar_interval * (i+1), current_y + 20, 5, 30);
                // context.fillRect(x_start + bar_interval * (i+1), current_y + 45, 20, 5);
            }
            context.fillStyle = 'white';
            context.font = "14px Antonio,'Arial Narrow','Avenir Next Condensed','sans-serif'";
            for (let i = 0; i <=10-2; i++) {
                let n = Math.floor(100 / 10 * (i+1));
                context.fillText(`${n}%`, x_start + bar_interval * (i+1), current_y + 66);
            }

            // size texts
            context.fillStyle = 'black';
            context.font = "700 18px Antonio,'Arial Narrow','Avenir Next Condensed','sans-serif'";
            {
                const t = toXiB(zpool.size);
                const m = context.measureText(t);
                context.fillText(t, this.x + unit_width + 2*unit_gap + 110 - m.width - 12, current_y + 20);
            }
            {
                const t = toXiB(zpool.alloc);
                const m = context.measureText(t);
                context.fillText(t, this.x + unit_width + 2*unit_gap + 110 - m.width - 12, current_y + unit_height - 6);
            }

            // progress bar
            context.fillStyle = getColor(zfs_data.pool_colors[i]![2]);
            context.fillRect(x_start, current_y + 30, Math.floor(bar_w * (zpool.alloc/zpool.size)), 15);

            current_y += unit_height + unit_gap;
        }

        // divider
        context.fillStyle = getColor(this.dividerNr);
        context.fillRect(this.x, current_y, this.w - unit_gap, 40);
        current_y += 40 + unit_gap;


        // title
        context.fillStyle = 'white';
        context.font = "700 65px Antonio,'Arial Narrow','Avenir Next Condensed','sans-serif'";
        {
            const t = "DISK STATUS";
            const m = context.measureText(t);
            context.fillText(t, this.x + this.w - m.width - 12, current_y + 65);
        }
        current_y += unit_height;

        let current_x = this.x + 10 - unit_gap;
        for (let i = 0; i < zfs_data.status.pools.length; i++) {
            const zpool = zfs_data.status.pools[i]!;
            for (let i2 = 0; i2 < zpool.disks.length; i2++) {
                const disk = zpool.disks[i2]!;
                context.fillStyle = getColor(zfs_data.disk_colors[i]![i2]!);
                context.beginPath();
                context.moveTo(current_x + unit_width - 40, current_y);
                context.lineTo(current_x + 40, current_y);
                context.arcTo (current_x, current_y,
                               current_x, current_y + unit_height / 2,
                               35);
                context.arcTo (current_x, current_y + unit_height,
                               current_x + 40, current_y + unit_height,
                               35);
                context.lineTo(current_x + unit_width - 40, current_y + unit_height);
                context.arcTo (current_x + unit_width, current_y + unit_height,
                               current_x + unit_width, current_y + unit_height / 2,
                               35);
                context.arcTo (current_x + unit_width, current_y,
                               current_x + unit_width - 40, current_y,
                               35);
                context.fill();
                {
                    context.fillStyle = 'black';
                    {
                        context.font = "700 12px Antonio,'Arial Narrow','Avenir Next Condensed','sans-serif'";
                        const li = disk.device.lastIndexOf("/");
                        let s = disk.device;
                        if (li != -1) {
                            s = disk.device.substring(li + 1);
                        }
                        if (s.length > 10) {
                            s = s.substring(s.length - 10);
                        }
                        const m = context.measureText(s);
                        context.fillText(s, current_x + unit_width /2 - m.width / 2, current_y + unit_height / 2 - (12+18)/2 + 12);
                    }
                    {
                        context.font = "700 18px Antonio,'Arial Narrow','Avenir Next Condensed','sans-serif'";
                        const m = context.measureText(disk.spinning);
                        context.fillText(disk.spinning, current_x + unit_width /2 - m.width / 2, current_y + unit_height / 2 - (12+18)/2 + 12 + 18);
                    }
                }
                current_x += unit_width + 10;
                if (current_x + unit_width + 10 > this.x + this.w) {
                    current_x = this.x + 10 - unit_gap;
                    current_y += unit_height + 10;
                }
            }
        }
    }

    click(x: number, y: number) {
        if (x < this.x || x > this.x + this.w || y < this.y || y > this.y + this.h) {
            return false;
        }
        playOnce('denied');
        return false;
    }
}
