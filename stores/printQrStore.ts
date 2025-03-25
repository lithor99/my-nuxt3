export const usePrintQrStore = defineStore("printQrStore", () => {
    const { $toast } = useNuxtApp();
    const printQrPagination = ref<any>({} as any);

    const getPagination = computed(() => printQrPagination.value);

    const createOne = useAsyncHandler(async (body: any) => {
        const { data } = await useServer("printQr", {
            method: "POST",
            body,
        });
        const response: any = data.value;
        $toast.success(response?.message ?? "Print Qr successfully");
        return data.value;
    });

    const setPagination = useAsyncHandler(async (params: any) => {
        const { data } = await useServer("printQr", {
            method: "GET",
            params,
        });
        const response: any = data?.value;
        printQrPagination.value = response?.data as any;
    });

    return {
        getPagination,
        createOne,
        setPagination,
    };
});
