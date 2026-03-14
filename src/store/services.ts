import { randColorNr } from "../theme";

export interface ServiceStatus {
    kind: String,
    namespace: string,
    name: string,
    num_desired: number,
    num_ready: number,
}

export const services_data = {
    services: [] as ServiceStatus[],
    service_colors: [] as [number, number, number, number][],
}

const fetch_services = () => {
    const req = new XMLHttpRequest();
    req.addEventListener("load", () => {
        if (req.status == 200) {
            services_data.services = req.response.deployments;
            for (let i = 0; i < services_data.services.length; i++) {
                services_data.service_colors[i] = services_data.service_colors[i] ||
                    [randColorNr(), randColorNr(), randColorNr(), randColorNr()];
            }
        }
    });
    req.responseType = 'json';
    req.open("GET", "/api/deployments");
    req.send();
}
setInterval(() => fetch_services(), 10000);
fetch_services();
