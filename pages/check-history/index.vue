<template>
    <div class="min-h-screen bg-gray-100 p-4">
        <div class="mx-2 mb-2 text-lg text-gray-700">
            ປະຫວັດການກວດສອບ
        </div>
        <div class="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-6">
            <!-- Search and add section -->
            <div class="flex justify-between items-center mb-4">
                <div class="relative flex text-md text-gray-700 justify-start items-center">
                    <div class="relative w-72">
                        <span class="absolute inset-y-0 left-0 flex items-center pl-2">
                            <Icon icon="akar-icons:search" class="w-5 h-5 text-gray-500" />
                        </span>
                        <input v-model="search" type="text" placeholder="ຄົ້ນຫາ..."
                            class="w-full pl-8 border border-gray-400 rounded-lg shadow-sm focus:border-blue-500 px-4 py-2"
                            @keyup.enter="onSearch" />
                    </div>
                    <div class="relative w-60 mx-auto ml-4">
                        <select id="branchSelect" v-model="selectedBranch" :disabled="disableSelectBranch"
                            class="block w-60 border border-gray-400 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 px-4 py-2 text-gray-700 appearance-none cursor-pointer"
                            @change="onSearch">
                            <option value="" disabled>ເລືອກສາຂາ</option>
                            <option v-for="branch in BRANCH" :key="branch.branchCode" :value="branch.branchCode"
                                class="bg-gray-200 hover:bg-gray-300">
                                {{
                                    branch.branchCode === ":branch"
                                        ? ""
                                        : branch.branchCode
                                }}
                                {{ branch.branchName }}
                            </option>
                        </select>
                        <span class="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                            <Icon icon="icon-park-outline:down" :class="[
                                'w-5 h-5 text-blue-50',
                                disableSelectBranch
                                    ? 'text-gray-400'
                                    : 'text-blue-500',
                            ]" />
                        </span>
                    </div>
                    <div class="relative w-40 ml-4">
                        <input v-model="startDate" type="date"
                            class="w-full border border-gray-400 cursor-pointer rounded-lg shadow-sm focus:border-blue-500 pl-4 pr-2"
                            style="height: 42px" />
                    </div>
                    <Icon icon="si:arrow-right-duotone" width="24" height="24" />
                    <div class="relative w-40">
                        <input v-model="endDate" type="date"
                            class="w-full border border-gray-400 cursor-pointer rounded-lg shadow-sm focus:border-blue-500 pl-4 pr-2"
                            style="height: 42px" />
                    </div>
                    <button
                        class="flex items-center justify-center text-white ml-2 w-10 h-10 border border-blue-400 rounded-full hover:bg-blue-100"
                        @click="onSearch">
                        <Icon icon="iconamoon:search-bold" class="w-5 h-5 text-blue-500" />
                    </button>
                    <button
                        class="flex items-center justify-center text-white ml-2 w-10 h-10 border border-orange-400 rounded-full hover:bg-orange-100"
                        @click="onRefresh">
                        <Icon icon="nrk:refresh" class="h-5 w-5 text-orange-400" />
                    </button>
                </div>
            </div>
            {{ item }}
            <!-- Table section -->
            <div class="flex items-end justify-between">
                <div class="text-gray-500 mt-0 flex items-center">
                    ຈຳນວນລາຍການທັງໝົດ:
                    <span class="text-gray-800 ml-2">
                        {{ checkHistoryStore.getPagination?.count ?? 0 }}
                    </span>
                </div>
            </div>
            <div v-if="loading && isFirst" class="animate-pulse">
                <table class="w-full border-separate rounded-md border border-gray-200">
                    <thead>
                        <tr class="bg-gray-200 text-gray-800">
                            <th v-for="header in headers" :key="header.key" :class="[
                                'border border-gray-300 px-2 py-2 text-sm font-semibold',
                                header.align === 'end'
                                    ? 'text-right'
                                    : header.align === 'start'
                                        ? 'text-left'
                                        : 'text-center',
                                header.width ? `w-${header.width}` : '',
                            ]">
                                <span>{{ header.title }}</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="n in 10" :key="n" class="text-gray-700 hover:bg-gray-100">
                            <td class="border w-12 border-gray-300 px-2 py-1">
                                <div class="h-5 w-8 bg-gray-200 rounded"></div>
                            </td>
                            <td v-for="m in 5" :key="m" class="border border-gray-300 px-2 py-1">
                                <div class="h-5 w-36 bg-gray-200 rounded"></div>
                            </td>
                            <td class="border w-12 border-gray-300 px-2 py-1">
                                <div class="h-5 w-20 bg-gray-200 rounded"></div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div v-else class="overflow-x-auto">
                <table class="w-full border-collapse border rounded-md border-gray-200">
                    <thead>
                        <tr class="bg-gray-200 text-gray-800">
                            <th v-for="header in headers" :key="header.key" :class="[
                                'border border-gray-300 px-2 py-2 text-sm font-semibold',
                                header.align === 'end'
                                    ? 'text-right'
                                    : header.align === 'start'
                                        ? 'text-left'
                                        : 'text-center',
                                header.width ? `w-${header.width}` : '',
                            ]">
                                <span>{{ header.title }}</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in checkHistoryStore
                            .getPagination.rows" :key="item.id" class="text-gray-700 hover:bg-gray-100 text-sm">
                            <td class="w-12 text-right border border-gray-300 px-2 py-1">
                                {{ index + 1 }}
                            </td>
                            <td class="border border-gray-300 px-2 py-1">
                                {{ item.fixedAssetNo ?? "" }}
                            </td>
                            <td class="border border-gray-300 px-2 py-1">
                                {{ item.fixedAssetName ?? "" }}
                            </td>
                            <td class="border border-gray-300 px-2 py-1">
                                {{ item.branchCode ?? "" }}
                            </td>
                            <td class="border border-gray-300 px-2 py-1">
                                {{ item.checkedBy ?? "" }}
                            </td>
                            <td class="border border-gray-300 px-2 py-1">
                                {{ item.lastCheckDate?.split("T")[0] }}
                            </td>
                            <td class="border border-gray-300 px-2 py-1 text-center">
                                <div class="flex flex-col items-center justify-center p-0">
                                    <button class="relative group" @click="onViewDetail(item)">
                                        <Icon icon="fa6-solid:eye"
                                            class="w-4 h-4 text-blue-500 cursor-pointer hover:text-blue-600" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="checkHistoryStore.getPagination.count === 0">
                            <td colspan="12" class="text-center text-gray-500 py-4">
                                No data available
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div class="flex items-center justify-between mt-4 space-x-2">
                <div class="relative inline-block text-left mr-4">
                    <button
                        class="flex justify-center items-center w-full rounded-md border border-gray-300 shadow-sm p-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        @click="toggleDropdown">
                        ລາຍການຕໍ່ໜ້າ {{ itemsPerPage }}
                        <Icon icon="mingcute:down-line" class="w-4 h-4 ml-1 text-gray-600" />
                    </button>

                    <div v-show="isDropdownOpen"
                        class="absolute right-0 mt-1 w-20 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                        <div v-for="item in listItemsPerPage" :key="item" class="py-1">
                            <a href="#" class="px-4 py-1 text-sm flex justify-end text-gray-700 hover:bg-gray-100"
                                @click="onSelectedItemsPerPage(item)">
                                {{ item }}
                            </a>
                        </div>
                    </div>
                </div>
                <div class="flex items-center">
                    <span v-if="checkHistoryStore.getPagination?.count > 0" class="text-gray-700 mr-4">Page {{
                        currentPage }}
                        of
                        {{
                            checkHistoryStore.getPagination?.totalPage ?? 0
                        }}</span>
                    <button :disabled="currentPage === 1 ||
                        checkHistoryStore.getPagination?.count === 0
                        "
                        class="flex justify-center items-center bg-blue-500 w-7 h-7 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        @click="onFirstPage">
                        <Icon icon="ic:round-keyboard-double-arrow-left" class="w-5 h-5 text-white" />
                    </button>
                    <button :disabled="currentPage === 1 ||
                        checkHistoryStore.getPagination?.count === 0
                        "
                        class="flex justify-center items-center ml-1 bg-blue-500 w-7 h-7 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        @click="onPreviousPage">
                        <Icon icon="ic:round-navigate-next" class="w-5 h-5 text-white transform rotate-180" />
                    </button>

                    <button v-for="page in generatePageNumbers()" :key="page" :class="{
                        'bg-blue-500 text-white hover:bg-blue-600':
                            page === currentPage,
                        'bg-gray-300 text-gray-700 hover:bg-gray-400':
                            page !== currentPage,
                    }" class="text-ms w-7 h-7 ml-1 rounded" @click="
                        () => typeof page === 'number' && onPageSelect(page)
                    ">
                        {{ page }}
                    </button>

                    <button :disabled="currentPage ===
                        checkHistoryStore.getPagination?.totalPage ||
                        checkHistoryStore.getPagination?.count === 0
                        "
                        class="flex justify-center items-center bg-blue-500 w-7 h-7 ml-1 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        @click="onNextPage">
                        <Icon icon="ic:round-navigate-next" class="w-5 h-5 text-white" />
                    </button>
                    <button :disabled="currentPage ===
                        checkHistoryStore.getPagination?.totalPage ||
                        checkHistoryStore.getPagination?.count === 0
                        "
                        class="flex justify-center items-center bg-blue-500 w-7 h-7 ml-1 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        @click="onLastPage">
                        <Icon icon="ic:round-keyboard-double-arrow-right" class="w-5 h-5 text-white" />
                    </button>
                </div>
            </div>
        </div>
        <!-- Modals -->
        <div v-if="showDetailDialog" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            @click.self="showDetailDialog = false">
            <div class="bg-white rounded-lg p-4 shadow-lg overflow-y-auto"
                style="width: 100%; max-width: 600px; max-height: 90vh;">
                <p class="my-2 text-lg text-gray-800 flex justify-center">
                    ລາຍລະອຽດການກວດສອບ
                </p>
                <div class="mt-4">
                    <p class="text-gray-500">FIXED ASSET NO:</p>
                    <p class="font-semibold text-gray-800">
                        {{ fixedAssetHistory.fixedAssetNo ?? "-" }}
                    </p>
                </div>
                <div class="mt-4">
                    <p class="text-gray-500">FIXED ASSET NAME:</p>
                    <p class="font-semibold text-gray-800">
                        {{ fixedAssetHistory.fixedAssetName ?? "-" }}
                    </p>
                </div>
                <div class="mt-4">
                    <p class="text-gray-500">CHECK DATE:</p>
                    <p class="font-semibold text-gray-800">
                        {{ fixedAssetHistory.lastCheckDate.split("T")[0] ?? "-" }}
                    </p>
                </div>
                <div class="mt-4">
                    <p class="text-gray-500">CHECK BY:</p>
                    <p class="font-semibold text-gray-800">
                        {{ fixedAssetHistory.checkedBy ?? "-" }}
                    </p>
                </div>
                <div class="mt-4">
                    <p class="text-gray-500">BRANCH:</p>
                    <p class="font-semibold text-gray-800">
                        {{ fixedAssetHistory.branchCode ?? "-" }}
                    </p>
                </div>
                <div class="mt-4 mb-4">
                    <p class="text-gray-500">DESCRIPTION:</p>
                    <p class="font-semibold text-gray-800">
                        {{ fixedAssetHistory.description ?? "-" }}
                    </p>
                </div>
                <div v-for="image in images" :key="image">
                    <img :src="`${cdn}${image}`" alt="image" class="my-2" style="width: 100%;" />
                </div>
                <div class="flex justify-end space-x-4 mt-4">
                    <button class="w-14 h-8 bg-blue-400 text-white rounded hover:bg-blue-500"
                        @click="showDetailDialog = false">
                        ປິດ
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Icon } from "@iconify/vue";
import { useCheckHistoryStore } from "~/stores/checkHistoryStore";

// Assume these are provided from your store
const { setQueryServerSide, isQueryServerSide } = useMainStore();
const checkHistoryStore = useCheckHistoryStore();

// Pagination and other state
const itemsPerPageCookie = useCookie("itemsPerPage");
const currentPageCookie = useCookie("currentPage");
const branchCodeCookie = useCookie("branchCode");
const listItemsPerPage = ref([10, 20, 30, 50]);
const itemsPerPage = ref();
const currentPage = ref();
const isDropdownOpen = ref(false);
const loading = ref(false);
const isFirst = ref(false);
const startDate = ref("");
const endDate = ref("");
const filters = ref();
const search = ref("");
const selectedBranch = ref("");
const disableSelectBranch = ref(false);
const showDetailDialog = ref(false);
const fixedAssetHistory = ref(null);
const images = ref([])

const config = useRuntimeConfig();
const cdn = config.public.CDN;

const headers = ref([
    { title: "ລຳດັບ", key: "no", width: 12, align: "end" },
    { title: "ລະຫັດຊັບສົມບັດ", key: "fixedAssetNo", align: "start" },
    { title: "ຊື່ຊັບສົມບັດ", key: "fixedAssetName", align: "start" },
    { title: "ສາຂາ", key: "branchCode", align: "start" },
    { title: "ກວດໂດຍຜູ້ໃຊ້", key: "checkBy", align: "start" },
    { title: "ວັນທີ່ກວດ", key: "lastCheckDate", align: "start" },
    { title: "ຈັດການ", key: "action", align: "center" },
]);

onMounted(() => {
    if (branchCodeCookie.value.toString() === "400100") {
        selectedBranch.value = BRANCH[0].branchCode;
    } else {
        selectedBranch.value = branchCodeCookie.value;
        disableSelectBranch.value = true;
    }
    itemsPerPage.value = itemsPerPageCookie.value ?? 10;
    currentPage.value = currentPageCookie.value ?? 1;
    filters.value = {
        ...filters.value,
        page: currentPage.value,
        limit: itemsPerPage.value,
        branchCode:
            selectedBranch.value.toString() === BRANCH[0].branchCode
                ? ""
                : selectedBranch.value,
        startDate: startDate.value,
        endDate: endDate.value,
        search: search.value,
    };
    if (!isQueryServerSide) {
        loading.value = true;
        isFirst.value = true;
        checkHistoryStore.setPagination(filters.value);
        loading.value = false;
        isFirst.value = false;
    }
    setQueryServerSide(false);

    const handleClickOutside = (event) => {
        if (!event.target.closest(".relative")) {
            isDropdownOpen.value = false;
        }
    };

    document.addEventListener("click", handleClickOutside);

    onBeforeUnmount(() => {
        document.removeEventListener("click", handleClickOutside);
    });
});

const onSearch = async () => {
    currentPage.value = 1;
    filters.value = {
        ...filters.value,
        page: currentPage.value,
        limit: itemsPerPage.value,
        branchCode:
            selectedBranch.value.toString() === BRANCH[0].branchCode
                ? ""
                : selectedBranch.value,
        startDate: startDate.value,
        endDate: endDate.value,
        search: search.value,
    };
    await checkHistoryStore.setPagination(filters.value);
    setQueryServerSide(false);
};

const onFirstPage = async () => {
    if (currentPage.value > 1) {
        currentPage.value = 1;
        currentPageCookie.value = 1;
        await updatePagination();
    }
};

const onPreviousPage = async () => {
    if (currentPage.value > 1) {
        currentPage.value--;
        currentPageCookie.value = currentPage.value;
        await updatePagination();
    }
};

const onNextPage = async () => {
    if (currentPage.value < checkHistoryStore.getPagination?.totalPage) {
        currentPage.value++;
        currentPageCookie.value = currentPage.value;
        await updatePagination();
    }
};

const onLastPage = async () => {
    if (currentPage.value < checkHistoryStore.getPagination?.totalPage) {
        currentPage.value = checkHistoryStore.getPagination?.totalPage;
        currentPageCookie.value = currentPage.value;
        await updatePagination();
    }
};

const onPageSelect = async (page) => {
    if (page !== currentPage.value) {
        currentPage.value = page;
        currentPageCookie.value = currentPage.value;
        await updatePagination();
    }
};

const updatePagination = async () => {
    filters.value = {
        ...filters.value,
        page: currentPage.value,
        limit: itemsPerPage.value,
        branchCode:
            selectedBranch.value.toString() === BRANCH[0].branchCode
                ? ""
                : selectedBranch.value,
        startDate: startDate.value,
        endDate: endDate.value,
        search: search.value,
    };
    await checkHistoryStore.setPagination(filters.value);
    setQueryServerSide(false);
};

const generatePageNumbers = () => {
    const totalPage = checkHistoryStore.getPagination?.totalPage ?? 0;
    const pages = [];

    if (totalPage <= 5) {
        for (let i = 1; i <= totalPage; i++) {
            pages.push(i);
        }
    } else if (currentPage.value === 1) {
        pages.push(
            currentPage.value,
            currentPage.value + 1,
            currentPage.value + 2,
            currentPage.value + 3,
            currentPage.value + 4,
        );
    } else if (currentPage.value === 2) {
        pages.push(
            currentPage.value - 1,
            currentPage.value,
            currentPage.value + 1,
            currentPage.value + 2,
            currentPage.value + 3,
        );
    } else if (currentPage.value === totalPage - 1) {
        pages.push(
            currentPage.value - 3,
            currentPage.value - 2,
            currentPage.value - 1,
            currentPage.value,
            currentPage.value + 1,
        );
    } else if (currentPage.value === totalPage) {
        pages.push(
            currentPage.value - 4,
            currentPage.value - 3,
            currentPage.value - 2,
            currentPage.value - 1,
            currentPage.value,
        );
    } else {
        pages.push(
            currentPage.value - 2,
            currentPage.value - 1,
            currentPage.value,
            currentPage.value + 1,
            currentPage.value + 2,
        );
    }

    return pages;
};

const onRefresh = async () => {
    if (branchCodeCookie.value.toString() === "400100") {
        selectedBranch.value = BRANCH[0].branchCode;
    } else {
        selectedBranch.value = branchCodeCookie.value;
        disableSelectBranch.value = true;
    }
    startDate.value = "";
    endDate.value = "";
    search.value = "";
    currentPage.value = 1;
    filters.value = {
        ...filters.value,
        page: currentPage.value,
        limit: itemsPerPage.value,
        branchCode:
            selectedBranch.value.toString() === BRANCH[0].branchCode
                ? ""
                : selectedBranch.value,
        startDate: startDate.value,
        endDate: endDate.value,
        search: search.value,
    };
    await checkHistoryStore.setPagination(filters.value);
};

const toggleDropdown = () => {
    isDropdownOpen.value = !isDropdownOpen.value;
};

const onSelectedItemsPerPage = (item) => {
    itemsPerPage.value = item;
    itemsPerPageCookie.value = item;
    isDropdownOpen.value = false;
    onRefresh();
};

const onViewDetail = (item) => {
    showDetailDialog.value = true;
    fixedAssetHistory.value = item;
    images.value = JSON.parse(item.imageUrl);
};
</script>
