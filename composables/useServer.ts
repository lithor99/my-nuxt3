import { defu } from "defu";
import type { UseFetchOptions } from "nuxt/app";

export async function useServer<T>(
    url: string,
    options: UseFetchOptions<T> = {},
) {
    const token: any = useCookie("token");
    const userId: any = useCookie<any>("userId");

    const router = useRouter();
    const { $toast } = useNuxtApp();
    let hder = {};
    if (process.server) {
        hder = useRequestHeaders();
    }
    const defaults: UseFetchOptions<T> = {
        baseURL: "/api/",
        // cache request
        key: url,

        // set user token if connected
        headers: {
            Authorization: token.value ? `Bearer ${token.value}` : "",
            ...hder,
        },

        onResponse(_ctx: any) { },

        onResponseError(_ctx: any) {
            const errorMessage = _ctx.response?._data?.message;
            if (errorMessage) $toast.error(errorMessage);
            switch (_ctx.response.status) {
                case 401:
                    token.value = null;
                    userId.value = null;
                    router.push("/login");
                    break;
                case 403:
                    token.value = null;
                    userId.value = null;
                    router.push("/login");
                    break;
                case 404:
                    break;
                case 500:
                    break;
                case 503:
                    break;
                default:
                    break;
            }
        },
    };

    // for nice deep defaults, please use unjs/defu

    // const params = defu(options, defaults);
    // return useFetch(url, params);

    const params: any = defu(options, defaults);
    if (process.server) {
        return useFetch(url, params);
    } else {
        const response = await $fetch(url, params);
        return {
            data: { value: response },
        };
    }
}