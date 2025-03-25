import handleError from "~/server/utils/handle-error";
export default defineEventHandler(
    handleError(async (event: any) => {
        const body: { data: any } = await readBody(event);
        const axios = event.context.axios;
        const { data } = await axios.put(`/users/update`, body);
        return data;
    }),
);
