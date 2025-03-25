<template>
    <div class="min-h-screen bg-gray-100 p-4">
        <div class="mx-2 mb-2 text-lg text-gray-700">
            <span class="flex items-center justify-start">ໜ້າຫຼັກ
                <Icon icon="si:arrow-right-fill" width="24" height="24" />ລາຍລະອຽດຊັບສົມບັດ
            </span>

        </div>
        <div v-if="loading">
            <div class="text-gray-500 text-center flex items-center mt-10">
                <div class="rounded-lg p-8 w-full flex flex-col items-center">
                    <Icon icon="eos-icons:three-dots-loading"
                        class="w-20 h-20 text-blue-500 flex justify-center text-center mb-0" />
                    <p class="text-gray-800 flex justify-center mt-0">
                        Loading...
                    </p>
                </div>
            </div>
        </div>
        <div v-else class="max-w-4xl mx-auto bg-white shadow-md rounded-lg px-8 py-4">
            <div class="mb-6">
                <button @click="goBack">
                    <Icon icon="famicons:arrow-back-circle-outline"
                        class="w-10 h-10 text-blue-400 hover:text-blue-600" />
                </button>
            </div>
            <div v-if="asset" class="grid grid-cols-2 gap-4">
                <div>
                    <p class="text-gray-500">FIXED ASSETS NO:</p>
                    <p class="font-semibold text-gray-800">
                        {{ asset.id ?? "-" }}
                    </p>
                </div>
                <div>
                    <p class="text-gray-500">DESCRIPTION:</p>
                    <p class="font-semibold text-gray-800">
                        {{ asset.cname ?? "-" }}
                    </p>
                </div>
                <div>
                    <p class="text-gray-500">MANAGEMENT INSTITUTION:</p>
                    <p class="font-semibold text-gray-800">
                        {{ asset.sub_branch ?? "-" }}
                    </p>
                </div>
                <div>
                    <p class="text-gray-500">DOWN TYPE:</p>
                    <p class="font-semibold text-gray-800">
                        {{ asset.down_desc ?? "-" }}
                    </p>
                </div>
                <div>
                    <p class="text-gray-500">UP TYPE:</p>
                    <p class="font-semibold text-gray-800">
                        {{ asset.up_type ?? "-" }}
                    </p>
                </div>
                <div>
                    <p class="text-gray-500">SUB TYPE:</p>
                    <p class="font-semibold text-gray-800">
                        {{ asset.type ?? "-" }}
                    </p>
                </div>
                <div>
                    <p class="text-gray-500">BRAND:</p>
                    <p class="font-semibold text-gray-800">
                        {{ asset.brand ?? "-" }}
                    </p>
                </div>
                <div>
                    <p class="text-gray-500">MODEL:</p>
                    <p class="font-semibold text-gray-800">
                        {{ asset.model ?? "-" }}
                    </p>
                </div>
                <div>
                    <p class="text-gray-500">PRODUCT NO:</p>
                    <p class="font-semibold text-gray-800">
                        {{ asset.prod_no ?? "-" }}
                    </p>
                </div>
                <div>
                    <p class="text-gray-500">MANAGEMENT DEPARTMENT:</p>
                    <p class="font-semibold text-gray-800">
                        {{ asset.man_dp ?? "-" }}
                    </p>
                </div>
                <div>
                    <p class="text-gray-500">PURCHASE DATE:</p>
                    <p class="font-semibold text-gray-800">
                        {{ asset.buy_date ?? "-" }}
                    </p>
                </div>
                <div>
                    <p class="text-gray-500">WARRANTY DUE DATE:</p>
                    <p class="font-semibold text-gray-800">
                        {{ asset.war_exp_date ?? "-" }}
                    </p>
                </div>
                <div>
                    <p class="text-gray-500">BUY CURRENCY:</p>
                    <p class="font-semibold text-gray-800">
                        {{ asset.ccy ?? "-" }}
                    </p>
                </div>
                <div>
                    <p class="text-gray-500">PURCHASING PRICE:</p>
                    <p class="font-semibold text-gray-800">
                        {{ formatNumber(asset.amt ?? 0) }}
                    </p>
                </div>
                <div>
                    <p class="text-gray-500">ORIGINAL VALUE:</p>
                    <p class="font-semibold text-gray-800">
                        {{ formatNumber(asset.orig_val ?? 0) }}
                    </p>
                </div>
                <div>
                    <p class="text-gray-500">CURRENT VALUE:</p>
                    <p class="font-semibold text-gray-800">
                        {{ formatNumber(asset.curr_val ?? 0) }}
                    </p>
                </div>
                <div>
                    <p class="text-gray-500">ACCOUNTING CENTRE:</p>
                    <p class="font-semibold text-gray-800">
                        {{ asset.use_br ?? "-" }}
                    </p>
                </div>
                <div>
                    <p class="text-gray-500">STATUS:</p>
                    <p class="font-semibold text-gray-800">
                        {{ asset.sts ?? "-" }}
                    </p>
                </div>
                <div>
                    <p class="text-gray-500">DD ACCOUNT:</p>
                    <p class="font-semibold text-gray-800">
                        {{ asset.ib_ac ?? "-" }}
                    </p>
                </div>
                <div>
                    <p class="text-gray-500">GL ACCOUNT:</p>
                    <p class="font-semibold text-gray-800">
                        {{ asset.mib_ac ?? "-" }}
                    </p>
                </div>
                <div>
                    <p class="text-gray-500">DEPRECIATION FLAG:</p>
                    <p class="font-semibold text-gray-800">
                        {{ asset.am_flg ?? "-" }}
                    </p>
                </div>
                <div>
                    <p class="text-gray-500">NEXT DEPRECIATION DATE:</p>
                    <p class="font-semibold text-gray-800">
                        {{ asset.next_am_date ?? "-" }}
                    </p>
                </div>
                <div>
                    <p class="text-gray-500">DEPRECIATION PERIOD:</p>
                    <p class="font-semibold text-gray-800">
                        {{ asset.am_period ?? "-" }}
                    </p>
                </div>
                <div>
                    <p class="text-gray-500">DEPRECIATION MONTH:</p>
                    <p class="font-semibold text-gray-800">
                        {{ asset.next_am_month ?? "-" }}
                    </p>
                </div>
                <div>
                    <p class="text-gray-500">DEPRECIATION RESIDUAL PERCENT:</p>
                    <p class="font-semibold text-gray-800">
                        {{ asset.last_pct ?? "-" }}
                    </p>
                </div>
                <div>
                    <p class="text-gray-500">DEPRECIATION RESIDUAL AMOUNT:</p>
                    <p class="font-semibold text-gray-800">
                        {{ formatNumber(asset.last_amt ?? 0) }}
                    </p>
                </div>
                <div>
                    <p class="text-gray-500">DEPRECIATION AMOUNT:</p>
                    <p class="font-semibold text-gray-800">
                        {{ formatNumber(asset.am_amt ?? 0) }}
                    </p>
                </div>
                <div>
                    <p class="text-gray-500">TOTAL DEPRECIATION:</p>
                    <p class="font-semibold text-gray-800">
                        {{ formatNumber(asset.al_am_amt ?? 0) }}
                    </p>
                </div>
            </div>
            <div v-else>
                <div class="text-gray-500 text-center text-xl mb-4">
                    No data available
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { Icon } from "@iconify/vue";
import { useFixedAssetStore } from "@/stores/fixedAssetStore";

// Define an interface for the asset
interface Asset {
    id?: string;
    cname?: string;
    sub_branch?: string;
    down_desc?: string;
    up_type?: string;
    type?: string;
    brand?: string;
    model?: string;
    prod_no?: string;
    man_dp?: string;
    buy_date?: string;
    war_exp_date?: string;
    ccy?: string;
    amt?: number;
    orig_val?: number;
    curr_val?: number;
    use_br?: string;
    sts?: string;
    ib_ac?: string;
    mib_ac?: string;
    am_flg?: string;
    next_am_date?: string;
    am_period?: string;
    next_am_month?: string;
    last_pct?: string;
    last_amt?: number;
    am_amt?: number;
    al_am_amt?: number;
}

const route = useRoute();
const router = useRouter();
const fixedAssetStore = useFixedAssetStore();
const asset = ref<Asset | null>(null);
const loading = ref(false);

onMounted(async () => {
    const assetNo = route.params.id as string;
    loading.value = true;
    await fixedAssetStore.setOne(assetNo);
    asset.value = fixedAssetStore.getOne?.data;
    loading.value = false;
});

// Format a number as "#,###.##"
function formatNumber(value: number | string): string {
    const num = typeof value === "string" ? parseFloat(value) : value;
    if (isNaN(num)) {
        return "0";
    }
    return num.toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });
}

const goBack = () => {
    router.go(-1);
};
</script>
