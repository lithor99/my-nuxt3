<template>
    <div class="min-h-screen bg-gray-100 p-4">
        <div class="mx-2 mb-2 text-lg text-gray-700">
            ໜ້າຫຼັກ
        </div>
        <div class="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-6">
            <!-- Search and add section -->
            <div class="flex justify-between items-center mb-4">
                <div class="relative flex justify-start items-center">
                    <div class="relative w-72">
                        <span class="absolute inset-y-0 left-0 flex items-center pl-2">
                            <Icon icon="akar-icons:search" class="w-5 h-5 text-gray-500" />
                        </span>
                        <input v-model="search" type="text" placeholder="ຄົ້ນຫາ..."
                            class="w-full pl-8 border border-gray-400 rounded-lg shadow-sm focus:border-blue-500 px-4 py-2"
                            @keyup.enter="onSearch" />
                    </div>
                    <div class="relative w-64 mx-auto ml-2">
                        <select id="branchSelect" v-model="selectedBranch" :disabled="disableSelectBranch"
                            class="block w-full border border-gray-400 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 px-4 py-2 text-gray-700 appearance-none cursor-pointer"
                            @change="onSearch">
                            <option value="" disabled>ເລືອກສາຂາ</option>
                            <option v-for="branch in BRANCH" :key="branch.branchCode" :value="branch.branchCode"
                                class="bg-gray-200 hover:bg-gray-300 text-gray-800">
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
                <input ref="fileInput" type="file" id="file" class="hidden" accept=".xlsx, .xls"
                    @change="handleFileChange" />
                <div v-if="branchCodeCookie?.toString() == '400100' && roleCookie?.toString() == 'ADMIN'"
                    class="flex items-center justify-end ml-4">
                    <button
                        class="flex justify-center items-center bg-green-600 px-2 py-2 mr-3 rounded-md text-white whitespace-nowrap hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        @click="onSelectFile">
                        <Icon icon="file-icons:microsoft-excel" class="w-4 h-4 text-white mr-2" />
                        Import
                    </button>
                    <button :disabled="fixedAssetStore.getCount?.data?.countAll >=
                        fixedAssetStore.getCount?.data?.countCore
                        "
                        class="flex justify-center items-center bg-orange-400 px-2 py-2 mr-3 rounded-md text-white whitespace-nowrap hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        @click="onShowAddOneItemDialog">
                        <Icon icon="ic:round-add-circle" class="w-5 h-5 text-white mr-1" />
                        Add Single
                    </button>
                    <button :disabled="fixedAssetStore.getCount?.data?.countAll >=
                        fixedAssetStore.getCount?.data?.countCore
                        "
                        class="flex justify-center items-center bg-blue-500 px-2 py-2 rounded-md text-white whitespace-nowrap hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        @click="onShowConfirmDialog">
                        <Icon icon="ic:round-add-circle" class="w-5 h-5 text-white mr-1" />
                        Add Multiple
                    </button>
                </div>
            </div>

            <!-- Table section -->
            <div class="flex items-end justify-between">
                <div class="text-gray-500 mt-0 flex items-center">
                    ຈຳນວນລາຍການທັງໝົດ:
                    <span class="text-gray-800 ml-2">
                        {{ fixedAssetStore.getPagination?.count ?? 0 }}
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
                        <tr v-for="(item, index) in fixedAssetStore
                            .getPagination.rows" :key="item.id" class="text-gray-700 hover:bg-gray-100 text-sm">
                            <td class="w-12 text-right border border-gray-300 px-2 py-1">
                                {{ index + 1 }}
                            </td>
                            <td class="border border-gray-300 px-2 py-1">
                                {{ item.fixedAssetNo }}
                            </td>
                            <td class="border border-gray-300 px-2 py-1">
                                {{ item.fixedAssetName }}
                            </td>
                            <td class="border border-gray-300 px-2 py-1 text-center">
                                <div class="flex items-center justify-center space-x-4">
                                    <div :class="{
                                        'bg-blue-500': item.inSystem === 1,
                                        'bg-yellow-600':
                                            item.inSystem === 0,
                                    }"
                                        class="w-16 h-7 flex items-center justify-center rounded-full transition-colors duration-300 focus:outline-none">
                                        <span class="text-center text-sm text-gray-50">
                                            {{
                                                item.inSystem === 1
                                                    ? "ໃນລະບົບ"
                                                    : "ນອກລະບົບ"
                                            }}
                                        </span>
                                    </div>
                                </div>
                            </td>
                            <td class="border border-gray-300 px-2 py-1">
                                {{ item.countPrinting ?? 0 }}
                            </td>
                            <td class="border border-gray-300 px-2 py-1">
                                {{ item.lastPrintDate?.split("T")[0] }}
                            </td>
                            <td class="border border-gray-300 px-2 py-1">
                                {{ item.lastCheckDate?.split("T")[0] }}
                            </td>
                            <td class="border border-gray-300 px-2 py-1 text-center">
                                <div class="flex items-center justify-center space-x-4">
                                    <div :class="{
                                        'bg-green-500':
                                            item.printStatus === 1,
                                        'bg-orange-500':
                                            item.printStatus === 0,
                                    }"
                                        class="w-14 h-7 flex items-center justify-center rounded-full transition-colors duration-300 focus:outline-none">
                                        <span class="text-center text-sm text-gray-50">
                                            {{
                                                item.printStatus === 1
                                                    ? "ພີມແລ້ວ"
                                                    : "ຍັງບໍ່ພີມ"
                                            }}
                                        </span>
                                    </div>
                                </div>
                            </td>
                            <td class="border border-gray-300 px-2 py-1 text-center">
                                <div class="flex flex-col items-center justify-center p-0">
                                    <div ref="qrCodeCanvas" class="bg-white p-0 m-0 rounded-md print-section-only">
                                        <div class="text-xs p-0 m-0">
                                            {{ item.fixedAssetNo }}
                                        </div>
                                        <canvas id="qrCodeCanvas" class="custom-canvas"></canvas>
                                        <div class="text-xs p-0 m-0">
                                            {{ item.fixedAssetName }}
                                        </div>
                                    </div>
                                    <div class="flex items-center justify-center">
                                        <button class="relative group" @click="
                                            onViewDetail(item.fixedAssetNo)
                                            ">
                                            <Icon icon="fa6-solid:eye"
                                                class="w-4 h-4 text-blue-500 cursor-pointer hover:text-blue-600" />
                                        </button>
                                        <button
                                            v-if="branchCodeCookie?.toString() == '400100' && roleCookie?.toString() == 'ADMIN'"
                                            class="
                                            relative group" @click="onPrintSingleQR([item])">
                                            <Icon icon="flowbite:printer-solid"
                                                class="w-5 h-5 text-blue-500 cursor-pointer ml-4 hover:text-blue-600" />
                                        </button>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="fixedAssetStore.getPagination.count === 0">
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
                    <span v-if="fixedAssetStore.getPagination?.count > 0" class="text-gray-700 mr-4">Page {{ currentPage
                    }} of
                        {{
                            fixedAssetStore.getPagination?.totalPage ?? 0
                        }}</span>
                    <button :disabled="currentPage === 1 ||
                        fixedAssetStore.getPagination?.count === 0
                        "
                        class="flex justify-center items-center bg-blue-500 w-7 h-7 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        @click="onFirstPage">
                        <Icon icon="ic:round-keyboard-double-arrow-left" class="w-5 h-5 text-white" />
                    </button>
                    <button :disabled="currentPage === 1 ||
                        fixedAssetStore.getPagination?.count === 0
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
                        fixedAssetStore.getPagination?.totalPage ||
                        fixedAssetStore.getPagination?.count === 0
                        "
                        class="flex justify-center items-center bg-blue-500 w-7 h-7 ml-1 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        @click="onNextPage">
                        <Icon icon="ic:round-navigate-next" class="w-5 h-5 text-white" />
                    </button>
                    <button :disabled="currentPage ===
                        fixedAssetStore.getPagination?.totalPage ||
                        fixedAssetStore.getPagination?.count === 0
                        "
                        class="flex justify-center items-center bg-blue-500 w-7 h-7 ml-1 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        @click="onLastPage">
                        <Icon icon="ic:round-keyboard-double-arrow-right" class="w-5 h-5 text-white" />
                    </button>
                </div>
            </div>

            <!-- New Button for Printing Multiple QR Codes -->
            <div v-if="branchCodeCookie?.toString() == '400100' && roleCookie?.toString() == 'ADMIN'"
                class="mt-4 flex justify-end">
                <button
                    class="flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white py-2 px-2 rounded"
                    @click="
                        onPrintMultiQR(fixedAssetStore.getPagination.rows ?? [])
                        ">
                    <Icon icon="flowbite:printer-solid" class="w-6 h-6 mr-2 text-gray-100" />
                    Print {{ itemsPerPage ?? 0 }} QR
                </button>
            </div>
        </div>

        <!-- Modal and other components... (unchanged) -->
        <div v-if="showSyncMultiDataConfirm"
            class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div class="bg-white rounded-lg p-4 w-96 shadow-lg">
                <p class="mb-10 mt-5 text-gray-800 flex justify-center">
                    ທ່ານຕ້ອງການ Sync Data ບໍ?
                </p>
                <div class="flex justify-end space-x-4">
                    <button class="w-14 h-8 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                        @click="showConfirm = false">
                        ຍົກເລີກ
                    </button>
                    <button class="w-14 h-8 bg-blue-400 text-white rounded hover:bg-blue-500" @click="onSyncMultiItems">
                        ຕົກລົງ
                    </button>
                </div>
            </div>
        </div>
        <div v-if="showImportDataConfirm"
            class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div class="bg-white rounded-lg p-4 w-96 shadow-lg">
                <p class="mb-10 mt-5 text-gray-800 flex justify-center">
                    ທ່ານຕ້ອງການ Import Data ບໍ?
                </p>
                <div class="flex justify-end space-x-4">
                    <button class="w-14 h-8 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                        @click="showConfirm = false">
                        ຍົກເລີກ
                    </button>
                    <button class="w-14 h-8 bg-blue-400 text-white rounded hover:bg-blue-500" @click="onImportData">
                        ຕົກລົງ
                    </button>
                </div>
            </div>
        </div>
        <div v-if="showSyncData" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div class="bg-white rounded-lg p-8 w-96 shadow-lg flex flex-col items-center">
                <Icon icon="eos-icons:three-dots-loading"
                    class="w-20 h-20 text-blue-500 flex justify-center text-center" />
                <p class="text-gray-800 flex justify-center">Processing...</p>
            </div>
        </div>
        <div v-if="showAddOneItem" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div class="bg-white rounded-lg p-8 shadow-lg flex flex-col items-center"
                style="width: 500px; max-width: 100%">
                <div class="text-gray-600 text-xl font-bold mb-8">
                    ເພີ່ມຂໍ້ມູນຊັບສົມບັດ
                </div>
                <div class="mb-4">
                    <label for="fixedAssetNo" class="text-gray-700 font-medium mb-1 flex justify-start items-center">
                        FIXED ASSETS NO
                        <div class="relative group">
                            <Icon icon="gg:info" class="text-blue-500 ml-1" />
                            <span
                                class="absolute w-56 left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-sm px-3 py-2 rounded-lg shadow-lg">
                                Input fixed assets no then press key enter
                            </span>
                        </div>
                    </label>
                    <input id="fixedAssetNo" v-model="fixedAssetNo" type="text" placeholder="FIXED ASSETS NO"
                        class="w-full border-gray-300 border rounded-md focus:ring-blue-100 focus:border-blue-500 p-2"
                        style="width: 400px; max-width: 100%" @keyup.enter="onGetOneData(fixedAssetNo)" />
                    <p v-if="errors.fixedAssetNo" class="text-red-500 text-sm mt-1">
                        {{ errors.fixedAssetNo }}
                    </p>
                </div>
                <div class="mb-4">
                    <label for="fixedAssetName" :class="[
                        'block text-gray-700 font-medium mb-1',
                        loading ? 'animate-pulse' : '',
                    ]">
                        FIXED ASSETS NAME
                    </label>
                    <input id="fixedAssetName" v-model="fixedAssetName" type="text" :class="[
                        'w-full border-gray-300 border rounded-md focus:ring-blue-100 focus:border-blue-500 p-2',
                        loading ? 'animate-pulse' : '',
                    ]" style="width: 400px; max-width: 100%" />
                    <p v-if="errors.fixedAssetName" class="text-red-500 text-sm mt-1">
                        {{ errors.fixedAssetName }}
                    </p>
                </div>
                <div class="mb-4">
                    <label for="branchCode" :class="[
                        'block text-gray-700 font-medium mb-1',
                        loading ? 'animate-pulse' : '',
                    ]">
                        BRANCH CODE
                    </label>
                    <input id="branchCode" v-model="branchCode" type="text" disabled="true" :class="[
                        'w-full border-gray-300 text-gray-700 border rounded-md focus:ring-blue-100 focus:border-blue-500 p-2',
                        loading ? 'animate-pulse' : '',
                    ]" style="width: 400px; max-width: 100%" />
                    <p v-if="errors.branchCode" class="text-red-500 text-sm mt-1">
                        {{ errors.branchCode }}
                    </p>
                    <div class="flex justify-end space-x-6 mt-8">
                        <button class="w-14 h-8 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
                            @click="onCancelShowAddOneItemDialog">
                            ຍົກເລີກ
                        </button>
                        <button class="w-14 h-8 bg-blue-500 text-gray-100 text-sm rounded hover:bg-blue-600"
                            @click="onSyncOneItem">
                            ຕົກລົງ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import QRCode from "qrcode";
import { Icon } from "@iconify/vue";
import { useRouter } from "vue-router";

// Assume these are provided from your store
const { setQueryServerSide, isQueryServerSide } = useMainStore();
const fixedAssetStore = useFixedAssetStore();
const printQrStore = usePrintQrStore();
const router = useRouter();

// Pagination and other state
const itemsPerPageCookie = useCookie("itemsPerPage");
const currentPageCookie = useCookie("currentPage");
const branchCodeCookie = useCookie("branchCode");
const roleCookie = useCookie("role");
const listItemsPerPage = ref([10, 20, 30, 50]);
const itemsPerPage = ref();
const currentPage = ref();
const isDropdownOpen = ref(false);
const loading = ref(false);
const isFirst = ref(false);
const search = ref("");
const filters = ref();
const showSyncMultiDataConfirm = ref(false);
const showImportDataConfirm = ref(false);
const showSyncData = ref(false);
const showAddOneItem = ref(false);
const fixedAssetNo = ref("");
const fixedAssetName = ref("");
const branchCode = ref("");
const selectedBranch = ref("");
const disableSelectBranch = ref(false);
const file = ref(null);
const fileInput = ref(null);

const errors = ref({
    fixedAssetNo: "",
    fixedAssetName: "",
    branchCode: "",
});

const headers = ref([
    { title: "ລຳດັບ", key: "no", width: 12, align: "end" },
    { title: "ລະຫັດຊັບສົມບັດ", key: "fixedAssetNo", align: "start" },
    { title: "ຊື່ຊັບສົມບັດ", key: "fixedAssetName", align: "start" },
    { title: "ສະຖານະ", key: "inSystem", align: "center" },
    { title: "ຈຳນວນຄັ້ງພີມ", key: "countPrinting", align: "start" },
    { title: "ວັນທີ່ພີມ QR ລ່າສຸດ", key: "lastPrintDate", align: "start" },
    { title: "ວັນທີ່ກວດລ່າສຸດ", key: "lastCheckDate", align: "start" },
    { title: "ສະຖານະການພີມ QR", key: "printStatus", align: "center" },
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
        search: search.value,
    };
    if (!isQueryServerSide) {
        loading.value = true;
        isFirst.value = true;
        fixedAssetStore.setCount();
        fixedAssetStore.setPagination(filters.value);
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

const onShowConfirmDialog = () => {
    showSyncMultiDataConfirm.value = true;
};

const onShowAddOneItemDialog = () => {
    showAddOneItem.value = true;
};

const onCancelShowAddOneItemDialog = () => {
    showAddOneItem.value = false;
    fixedAssetNo.value = "";
    fixedAssetName.value = "";
    branchCode.value = "";
};

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
        search: search.value,
    };
    await fixedAssetStore.setPagination(filters.value);
    setQueryServerSide(false);
};

const onReload = async () => {
    await fixedAssetStore.setPagination(filters.value);
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
    if (currentPage.value < fixedAssetStore.getPagination?.totalPage) {
        currentPage.value++;
        currentPageCookie.value = currentPage.value;
        await updatePagination();
    }
};

const onLastPage = async () => {
    if (currentPage.value < fixedAssetStore.getPagination?.totalPage) {
        currentPage.value = fixedAssetStore.getPagination?.totalPage;
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
        search: search.value,
    };
    await fixedAssetStore.setPagination(filters.value);
    setQueryServerSide(false);
};

const generatePageNumbers = () => {
    const totalPage = fixedAssetStore.getPagination?.totalPage ?? 0;
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
        search: search.value,
    };
    await fixedAssetStore.setPagination(filters.value);
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

const onViewDetail = (fixedAssetNo) => {
    router.push(`/fixed-asset/${fixedAssetNo}`);
};

// Validate inputs
const validateForm = () => {
    errors.value.fixedAssetNo =
        fixedAssetNo.value.trim() === "" ? "FIXED ASSETS NO is required" : "";
    errors.value.fixedAssetName =
        fixedAssetName.value.trim() === ""
            ? "FIXED ASSETS NAME is required"
            : "";
    errors.value.branchCode =
        branchCode.value.trim() === "" ? "BRANCH CODE is required" : "";

    return Object.values(errors.value).every((error) => error === "");
};

const onGetOneData = async (fixedAssetNo) => {
    if (fixedAssetNo.trim() === "") return;
    loading.value = true;
    fixedAssetName.value = "";
    branchCode.value = "";
    await fixedAssetStore.setOne(fixedAssetNo);
    fixedAssetName.value = fixedAssetStore.getOne?.data?.cname ?? "";
    branchCode.value = fixedAssetStore.getOne?.data?.use_br ?? "";
    loading.value = false;
};

const onSyncMultiItems = async () => {
    showSyncMultiDataConfirm.value = false;
    showSyncData.value = true;
    await fixedAssetStore.createMulti();
    await onRefresh();
    showSyncData.value = false;
};

const onSyncOneItem = async () => {
    if (!validateForm()) return;
    showAddOneItem.value = false;
    showSyncData.value = true;
    await fixedAssetStore.createOne(
        JSON.parse(JSON.stringify({ id: fixedAssetNo.value })),
    );
    await onRefresh();
    fixedAssetNo.value = "";
    fixedAssetName.value = "";
    branchCode.value = "";
    showSyncData.value = false;
};

// Trigger file input click
const onSelectFile = () => {
    fileInput.value.click();
};

// Handle file selection
const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;
    file.value = selectedFile;
    showImportDataConfirm.value = true;
};

const onImportData = async () => {
    showImportDataConfirm.value = false;
    showSyncData.value = true;
    const formData = new FormData();
    formData.append("file", file.value);
    await fixedAssetStore.importData(formData);
    await onRefresh();
    showSyncData.value = false;
    file.value = null;
    fileInput.value.value = "";
};

const onPrintQr = async (items) => {
    let qrItems = [];
    if (items.length > 0) {
        qrItems = items.slice(0, items.length).map((item) => item.fixedAssetNo);
    }
    await printQrStore.createOne(JSON.parse(JSON.stringify({ data: qrItems })));
    await onReload();
};

/* The updated multi-print function with consistent top padding for each label. */
const printQRCode = async (qrDataArray) => {
    try {
        let printHTML = `
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            @page {
              size: 60mm 36mm;
              margin: 0;
            }
            html, body {
              margin: 0;
              padding: 0;
              align-items: center;
            }
            .label {
              box-sizing: border-box;
              width: 50mm;
              height: 36mm;
              /* Ensure each label has the same top padding: 1.5mm */
              padding-top: 3mm;
              display: flex;
              flex-direction: row;
              justify-content: start;
              align-items: center;
              page-break-after: always;
            }
            .label img {
              width: 30mm;
              height: 30mm;
              padding-left: 2mm;
              padding-top: 3mm;
            }
            .label .qr-text {
              margin-top: 2mm;
              margin-left: 2mm;
              font-size: 13px;
              font-family: Times New Roman;
            }
            .label .name-text {
              margin-left: 2mm;
              font-size: 13px;
              font-family: Times New Roman, sans-serif;
              /* For multi-line if needed: */
              width: 28mm;
              white-space: normal;
              word-wrap: break-word;
            }
            .label .dot-text {
              margin-top: 1mm;
              margin-bottom: 1mm;
              margin-left: 2mm;
              font-size: 10px;
              font-family: Times New Roman, sans-serif;
            }
          </style>
        </head>
        <body>
      `;

        // Generate each QR code as a data URL
        for (const data of qrDataArray) {
            const qrImage = await QRCode.toDataURL(data.fixedAssetNo, {
                width: 300,
                margin: 0,
            });
            printHTML += `
          <div class="label">
            <img src="${qrImage}" alt="QR Code" />
            <div>
              <div class="name-text">${data.fixedAssetName}</div>
              <div class="dot-text">-------------------------</div>
              <div class="name-text">${data.fixedAssetNo.substring(0, 11)}</div>
              <div class="name-text">${data.fixedAssetNo.substring(11, 22)}</div>
            </div>
          </div>
        `;
        }

        printHTML += `
        </body>
      </html>
      `;

        const printWindow = window.open("", "_blank");
        printWindow.document.write(printHTML);
        printWindow.document.close();
        printWindow.onload = () => {
            printWindow.focus();
            printWindow.print();
            printWindow.close();
        };
    } catch (error) {
        throw new Error("Error printing multiple QR codes");
    }
};

// Single QR print calls the same function
const onPrintSingleQR = async (items) => {
    await printQRCode(items);
    await onPrintQr(items);
};

const onPrintMultiQR = async (qrDataArray) => {
    let items = [];
    if (qrDataArray.length > 0) {
        items = qrDataArray.slice(0, qrDataArray.length).map((item) => item);
    }
    await printQRCode(items);
    await onPrintQr(items);
};
</script>

<style scoped>
@page {
    size: 60mm 36mm;
    margin: 0;
}

.print-section-only {
    visibility: hidden;
    width: 0;
    height: 0;
    display: none;
}

.custom-canvas {
    padding: 0;
    margin: 0;
    display: block;
}
</style>
