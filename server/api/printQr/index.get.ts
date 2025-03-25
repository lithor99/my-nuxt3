import handleError from "~/server/utils/handle-error";
export default defineEventHandler(
    handleError(async (event: any) => {
        const axios = event.context.axios;
        const params = getQuery(event);
        const { data } = await axios.get(`/print-qr-history`, {
            params,
        });
        return data;
    }),
);
