import handleError from "~/server/utils/handle-error";
export default defineEventHandler(
    handleError(async (event: any) => {
        const axios = event.context.axios;
        const { data } = await axios.post(`/sync-multi-data`);
        return data;
    }),
);
