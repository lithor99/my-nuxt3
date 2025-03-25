import handleError from "~/server/utils/handle-error";
export default defineEventHandler(
    handleError(async (event: any) => {
        const axios = event.context.axios;
        const { id } = getRouterParams(event);
        const { data } = await axios.get(`/users/teller-info/${id}`);
        return data;
    }),
);
