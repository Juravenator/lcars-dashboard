import { randColorNr } from "../theme";

export const metrics_data = {
    metrics: [null, null, null, null] as [string[][] | null, string[][] | null, string[][] | null, string[][] | null],
    colors: [randColorNr(), randColorNr(), randColorNr(), randColorNr()],
    last_updated: 0,
}

const fetch_metrics = () => {
    const req = new XMLHttpRequest();
    req.addEventListener("load", () => {
        if (req.status == 200) {
            const data: {[k: string]: string[]} = JSON.parse(req.response).metrics;
            let s: string[][] = [];
            for (const k in data) {
                let ss = [k.toUpperCase()].concat(data[k]!);
                s.push(ss);
            }
            s.sort((a, b) => (a[0]!).localeCompare(b[0]!));
            metrics_data.last_updated += 1;
            metrics_data.last_updated %= metrics_data.metrics.length;
            metrics_data.metrics[metrics_data.last_updated] = s;
        }
    });
    req.responseType = 'text';
    req.open("GET", "/api/metrics");
    req.send();
}
setInterval(() => fetch_metrics(), 5000);
fetch_metrics();