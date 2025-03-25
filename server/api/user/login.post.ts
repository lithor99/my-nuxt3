import handleError from "~/server/utils/handle-error";
export default defineEventHandler(
    handleError(async (event: any) => {
        const body: { username: string; password: string } =
            await readBody(event);
        const axios = event.context.axios;
        const { data } = await axios.post(`/users/login`, body);

        // console.log("data: ", data);
        /**
         *   set token cookie
         */
        setCookie(event, "token", data.data?.token);
        setCookie(event, "userId", data.data?.id);
        setCookie(event, "nameLa", data.data?.nameLa);
        setCookie(event, "nameEn", data.data?.nameEn);
        setCookie(event, "branchCode", data.data?.branchCode);
        setCookie(event, "status", data.data?.status);
        setCookie(event, "type", data.data?.type);
        setCookie(event, "role", data.data?.role);

        return data;
    }),
);