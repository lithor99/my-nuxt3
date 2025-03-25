import axios from "axios";
export default defineEventHandler((event) => {
    const config = useRuntimeConfig();
    const headers = getHeaders(event);
    const axiosConfig = axios.create({
        baseURL: config.API_URL,
    });
    axiosConfig.interceptors.request.use((req) => {
        req.headers = {
            "sec-ch-ua": headers["sec-ch-ua"],
            "sec-ch-ua-mobile": headers["sec-ch-ua"],
            Authorization: headers.authorization,
            "user-agent": headers["user-agent"],
            "sec-ch-ua-platform": headers["sec-ch-ua-platform"],
            accept: headers.accept,
            origin: headers.origin || "*",
            "sec-fetch-site": headers["sec-fetch-site"],
            "sec-fetch-mode": headers["sec-fetch-site"],
            "sec-fetch-dest": headers["sec-fetch-dest"],
            referer: headers.referer,
            "accept-encoding": headers["accept-encoding"],
            "accept-language": headers["accept-language"],
            "x-forwarded-for": headers["x-forwarded-for"],
            "x-forwarded-port": headers["x-forwarded-port"],
            "x-forwarded-proto": headers["x-forwarded-proto"],
            cookie: headers.cookie,
            // apikey: config.API_KEY,
            // platform: "LIBRARY",
        } as any;
        return req;
    });
    event.context.axios = axiosConfig;
});