export const useCheckHistoryStore = defineStore("checkHistoryStore", () => {
    const { $toast } = useNuxtApp();
    const checkHistoryPagination = ref<any>({} as any);

    const getPagination = computed(() => checkHistoryPagination.value);

    const setPagination = useAsyncHandler(async (params: any) => {
        const { data } = await useServer("checkHistory", {
            method: "GET",
            params,
        });
        const response: any = data?.value;
        checkHistoryPagination.value = response?.data as any;
    });

    return {
        getPagination,
        setPagination,
    };
});
