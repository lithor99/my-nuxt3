import FormData from "form-data";
import handleError from "~/server/utils/handle-error";
export default defineEventHandler(
    handleError(async (event: any) => {
        const body: Array<any> = <Array<any>>await readMultipartFormData(event);
        const formData: FormData = new FormData();
        for (const data of body) {
            formData.append(
                data.name,
                data.type && data.filename ? data.data : data.data.toString(),
                data.filename,
            );
        }
        const axios = event.context.axios;
        const { data } = await axios.post(`/import-data`, formData);
        return data;
    }),
);
