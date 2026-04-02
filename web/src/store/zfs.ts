import { randColorNr } from "../theme";

interface ZpoolStatus {
    pools: {
        name: string,
        health: string,
        size: number,
        alloc: number,
        free: number,
        status: string,
        disks: {
            device: string,
            spinning: 'STANDBY' | 'ONLINE' | 'UNKNOWN',
            kb_read: number,
            kb_write: number,
        }[]
    }[]
}

export const zfs_data = {
    status: {pools: []} as ZpoolStatus,
    pool_colors: [] as [number, number, number, number][],
    disk_colors: [] as number[][],
}

const fetch_zpool = () => {
    const req = new XMLHttpRequest();
    req.addEventListener("load", () => {
        if (req.status == 200) {
            zfs_data.status = JSON.parse(req.response);
            for (let i = 0; i < zfs_data.status.pools.length; i++) {
                const pool = zfs_data.status.pools[i]!;
                zfs_data.pool_colors[i] = zfs_data.pool_colors[i] || [randColorNr(), randColorNr(), randColorNr(), randColorNr()];
                if (zfs_data.disk_colors[i]?.length != pool.disks.length) {
                    zfs_data.disk_colors[i] = pool.disks.map(() => randColorNr());
                }
            }
        }
    });
    // req.responseType = 'json';
    req.open("GET", "/api/zpools");
    req.send();
}

setInterval(() => fetch_zpool(), 10000);
fetch_zpool();