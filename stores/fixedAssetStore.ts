export const useFixedAssetStore = defineStore("fixedAssetStore", () => {
    const { $toast } = useNuxtApp();
    const fixedAssetsCount = ref<any>({} as any);
    const fixedAssetsPagination = ref<any>({} as any);
    const fixedAsset = ref<any>({} as any);
    // const fixedAsset = ref<any>({
    //     id: null,
    //     sub_branch: null,
    //     down_desc: null,
    //     cname: null,
    //     up_type: null,
    //     type: null,
    //     brand: null,
    //     model: null,
    //     prod_no: null,
    //     man_dp: null,
    //     buy_date: null,
    //     war_exp_date: null,
    //     ccy: null,
    //     amt: null,
    //     orig_val: null,
    //     curr_val: null,
    //     use_br: null,
    //     sts: null,
    //     ib_ac: null,
    //     mib_ac: null,
    //     am_flg: null,
    //     next_am_date: null,
    //     am_period: null,
    //     next_am_month: null,
    //     last_pct: null,
    //     last_amt: null,
    //     am_amt: null,
    //     al_am_amt: null
    // });

    const getCount = computed(() => fixedAssetsCount.value);
    const getPagination = computed(() => fixedAssetsPagination.value);
    const getOne = computed(() => fixedAsset.value);

    const createOne = useAsyncHandler(async (body: any) => {
        const { data } = await useServer("fixedAsset/createOne", {
            method: "POST",
            body,
        });
        const response: any = data.value;
        $toast.success(response?.message ?? "Add data successfully");
        return data.value;
    });

    const createMulti = useAsyncHandler(async (body: any) => {
        const { data } = await useServer("fixedAsset", {
            method: "POST",
            body,
        });
        const response: any = data.value;
        $toast.success(response?.message ?? "Add data successfully");
        return data.value;
    });

    const importData = useAsyncHandler(async (body: any) => {
        const { data } = await useServer("fixedAsset/import", {
            method: "POST",
            body,
        });
        const response: any = data.value;
        $toast.success(response?.message ?? "Import data successfully");
        return data.value;
    });

    const setCount = useAsyncHandler(async () => {
        const { data } = await useServer("fixedAsset/count", {
            method: "GET",
        });
        fixedAssetsCount.value = data.value;
    });
    const setPagination = useAsyncHandler(async (params: any) => {
        const { data } = await useServer("fixedAsset", {
            method: "GET",
            params,
        });
        const response: any = data?.value;
        fixedAssetsPagination.value = response?.data as any;
    });
    const setOne = useAsyncHandler(async (id: string) => {
        const { data } = await useServer(`fixedAsset/${id}`, {
            method: "GET",
        });
        fixedAsset.value = data.value;
    });

    return {
        getCount,
        getPagination,
        getOne,
        createOne,
        createMulti,
        importData,
        setCount,
        setPagination,
        setOne,
    };
});
