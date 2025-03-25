import handleError from "~/server/utils/handle-error";
export default defineEventHandler(
    handleError(async (event: any) => {
        const body: { id: string } = await readBody(event);
        const axios = event.context.axios;
        const { data } = await axios.post(`/sync-one-data`, body);
        return data;
    }),
);
