import axios from "axios";
export default defineNuxtPlugin((_) => {
    const cookie = useCookie<string>("token");
    const defaultUrl = "/api";
    const api = axios.create({
        baseURL: defaultUrl,
        headers: {
            common: {
                Authorization: `Bearer ${cookie.value}`,
            },
        },
    });
    return {
        provide: {
            api,
        },
    };
});