export const useUserStore = defineStore("userStore", () => {
    const { $toast } = useNuxtApp();
    const userPagination = ref<any>({} as any);
    const tellerInfo = ref<any>({} as any);

    const getPagination = computed(() => userPagination.value);
    const getTellerInfo = computed(() => tellerInfo.value);

    const create = useAsyncHandler(async (body: any) => {
        const { data } = await useServer("user", {
            method: "POST",
            body,
        });
        const response: any = data.value;
        $toast.success(response?.message ?? "Add user successfully");
        return data.value;
    });

    const update = useAsyncHandler(async (body: any) => {
        const { data } = await useServer("user", {
            method: "PUT",
            body,
        });
        const response: any = data.value;
        $toast.success(response?.message ?? "Add user successfully");
        return data.value;
    });

    const setPagination = useAsyncHandler(async (params: any) => {
        const { data } = await useServer("user", {
            method: "GET",
            params,
        });
        const response: any = data?.value;
        userPagination.value = response?.data as any;
    });
    const setTellerInfo = useAsyncHandler(async (id: string) => {
        const { data } = await useServer(`user/teller/${id}`, {
            method: "GET",
        });
        tellerInfo.value = data.value;
    });

    return {
        getPagination,
        getTellerInfo,
        create,
        update,
        setPagination,
        setTellerInfo,
    };
});
