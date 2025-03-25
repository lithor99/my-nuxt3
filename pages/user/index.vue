<template>
    <div class="min-h-screen bg-gray-100 p-4">
        <div class="mx-2 mb-2 text-lg text-gray-700">
            ຂໍ້ມູນຜູ້ໃຊ້
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
                <div v-if="branchCode == '400100'" class="flex items-center justify-end ml-4">
                    <button
                        class="flex justify-center items-center bg-blue-500 px-2 py-2 rounded-md text-white whitespace-nowrap hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        @click="onShowAddUserModal">
                        <Icon icon="ic:round-add-circle" class="w-5 h-5 text-white mr-1" />
                        Add User
                    </button>
                </div>
            </div>

            <!-- Table section -->
            <div class="flex items-end justify-between">
                <div class="text-gray-500 mt-0 flex items-center">
                    ຈຳນວນລາຍການທັງໝົດ:
                    <span class="text-gray-800 ml-2">
                        {{ userStore.getPagination?.count ?? 0 }}
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
                        <tr v-for="(item, index) in userStore.getPagination
                            .rows" :key="item.id" class="text-gray-700 hover:bg-gray-100 text-sm">
                            <td class="w-12 text-right border border-gray-300 px-2 py-1">
                                {{ index + 1 }}
                            </td>
                            <td class="border border-gray-300 px-2 py-1">
                                {{ item.tlrId ?? "" }}
                            </td>
                            <td class="border border-gray-300 px-2 py-1">
                                {{ item.tlrNameLa ?? "" }}
                            </td>
                            <td class="border border-gray-300 px-2 py-1">
                                {{ item.tlrNameEn ?? "" }}
                            </td>
                            <td class="border border-gray-300 px-2 py-1">
                                {{ item.tlrBranch ?? "" }}
                            </td>
                            <td class="border border-gray-300 px-2 py-1">
                                <div class="flex items-center justify-center space-x-4">
                                    <div :class="{
                                        'bg-green-500': item.role === 'ADMIN',
                                        'bg-blue-500':
                                            item.role === 'BRANCH',
                                        'bg-yellow-500':
                                            item.role === 'CHECKER',
                                        'bg-gray-500':
                                            item.role === 'USER',
                                    }"
                                        class="w-auto h-7 px-2 flex items-center justify-center rounded-full transition-colors duration-300 focus:outline-none">
                                        <span class="text-center text-sm text-gray-50">

                                            {{ROLES.find(role => role.value === item.role).label ?? ""}}
                                        </span>
                                    </div>
                                </div>
                            </td>
                            <td class="border border-gray-300 px-2 py-1">
                                {{ item.createdBy ?? "" }}
                            </td>
                            <td class="border border-gray-300 px-2 py-1">
                                {{ item.createdAt?.split("T")[0] ?? "" }}
                            </td>
                            <td class="border border-gray-300 px-2 py-1">
                                <div class="flex items-center justify-center space-x-2">
                                    <button class="relative group disabled:opacity-50 disabled:cursor-not-allowed"
                                        :disabled="item.tlrId === userId" @click="onShowEditUserModal(item)">
                                        <Icon icon="material-symbols:person-edit-outline-rounded" width="24" height="24"
                                            class="text-orange-400 group-hover:text-orange-600" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="userStore.getPagination.count === 0">
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
                    <span v-if="userStore.getPagination?.count > 0" class="text-gray-700 mr-4">Page {{ currentPage }}
                        of
                        {{ userStore.getPagination?.totalPage ?? 0 }}</span>
                    <button :disabled="currentPage === 1 ||
                        userStore.getPagination?.count === 0
                        "
                        class="flex justify-center items-center bg-blue-500 w-7 h-7 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        @click="onFirstPage">
                        <Icon icon="ic:round-keyboard-double-arrow-left" class="w-5 h-5 text-white" />
                    </button>
                    <button :disabled="currentPage === 1 ||
                        userStore.getPagination?.count === 0
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
                        userStore.getPagination?.totalPage ||
                        userStore.getPagination?.count === 0
                        "
                        class="flex justify-center items-center bg-blue-500 w-7 h-7 ml-1 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        @click="onNextPage">
                        <Icon icon="ic:round-navigate-next" class="w-5 h-5 text-white" />
                    </button>
                    <button :disabled="currentPage ===
                        userStore.getPagination?.totalPage ||
                        userStore.getPagination?.count === 0
                        "
                        class="flex justify-center items-center bg-blue-500 w-7 h-7 ml-1 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        @click="onLastPage">
                        <Icon icon="ic:round-keyboard-double-arrow-right" class="w-5 h-5 text-white" />
                    </button>
                </div>
            </div>
        </div>

        <!-- Modal -->
        <!-- show processing modal -->
        <div v-if="isProcessing" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div class="bg-white rounded-lg p-8 w-96 shadow-lg flex flex-col items-center">
                <Icon icon="eos-icons:three-dots-loading"
                    class="w-20 h-20 text-blue-500 flex justify-center text-center" />
                <p class="text-gray-800 flex justify-center">Processing...</p>
            </div>
        </div>

        <!-- add user modal -->
        <div v-if="showAddUserModal"
            class="fixed inset-0 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50 z-50">
            <div class="bg-white rounded-lg p-8 shadow-lg flex flex-col items-center" style="
                    width: 500px;
                    max-width: 100%;
                    max-height: 90vh;
                    overflow-y: auto;
                ">
                <div class="text-gray-600 text-xl font-bold mb-4">
                    ເພີ່ມຂໍ້ມູນຜູ້ໃຊ້
                </div>
                <div class="mb-4">
                    <label for="tlrId" class="text-gray-700 font-medium mb-1 flex justify-start items-center">
                        ເລກເທລເລີ
                        <div class="relative group">
                            <Icon icon="gg:info" class="text-blue-500 ml-1" />
                            <span
                                class="absolute w-56 left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-sm px-3 py-2 rounded-lg shadow-lg">
                                ປ້ອນເລກເທລເລີແລ້ວກົດ Enter
                            </span>
                        </div>
                    </label>
                    <input id="tlrId" v-model="tlrId" type="text" placeholder="ປ້ອນເລກເທລເລີ"
                        class="w-full border-gray-300 border rounded-md focus:ring-blue-100 focus:border-blue-500 p-2"
                        style="
                            width: 400px;
                            max-width: 100%;
                            max-height: 90vh;
                            overflow-y: auto;
                        " @keyup.enter="getTellerInfo(tlrId)" />
                    <p v-if="errors.tlrId" class="text-red-500 text-sm mt-1">
                        {{ errors.tlrId }}
                    </p>
                </div>
                <div class="mb-4">
                    <label for="tlrNameLa" :class="[
                        'block text-gray-700 font-medium mb-1',
                        loading ? 'animate-pulse' : '',
                    ]">
                        ຊື່ພາສາລາວ
                    </label>
                    <input id="tlrNameLa" v-model="tlrNameLa" disabled="true" type="text" :class="[
                        'w-full border-gray-300 border rounded-md focus:ring-blue-100 focus:border-blue-500 p-2',
                        loading ? 'animate-pulse' : '',
                    ]" style="
                            width: 400px;
                            max-width: 100;
                            max-height: 90vh;
                            overflow-y: auto;
                        " />
                </div>
                <div class="mb-4">
                    <label for="tlrNameEn" :class="[
                        'block text-gray-700 font-medium mb-1',
                        loading ? 'animate-pulse' : '',
                    ]">
                        ຊື່ພາສາອັງກິດ
                    </label>
                    <input id="tlrNameEn" v-model="tlrNameEn" disabled="true" type="text" :class="[
                        'w-full border-gray-300 border rounded-md focus:ring-blue-100 focus:border-blue-500 p-2',
                        loading ? 'animate-pulse' : '',
                    ]" style="
                            width: 400px;
                            max-width: 100%;
                            max-height: 90vh;
                            overflow-y: auto;
                        " />
                </div>
                <div class="mb-4">
                    <label for="tlrBranch" :class="[
                        'block text-gray-700 font-medium mb-1',
                        loading ? 'animate-pulse' : '',
                    ]">
                        ສາຂາ
                    </label>
                    <input id="tlrBranch" v-model="tlrBranch" type="text" disabled="true" :class="[
                        'w-full border-gray-300 text-gray-700 border rounded-md focus:ring-blue-100 focus:border-blue-500 p-2',
                        loading ? 'animate-pulse' : '',
                    ]" style="
                            width: 400px;
                            max-width: 100%;
                            max-height: 90vh;
                            overflow-y: auto;
                        " />
                </div>
                <div class="relative mb-4">
                    <label for="role" :class="[
                        'block text-gray-700 font-medium mb-1',
                        loading ? 'animate-pulse' : '',
                    ]">
                        ສິດທິຜູ້ໃຊ້
                    </label>
                    <div class="flex items-center justify-between relative">
                        <select id="role" v-model="role"
                            class="block w-full border border-gray-400 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-4 py-2 text-gray-700 appearance-none cursor-pointer"
                            style="
                                width: 400px;
                                max-width: 100%;
                                max-height: 90vh;
                                overflow-y: auto;
                            ">
                            <option value="" disabled>ເລືອກສິດທິຜູ້ໃຊ້</option>
                            <option v-for="item in ROLES" :key="item.value" :value="item.value"
                                class="bg-gray-200 hover:bg-gray-300">
                                {{ item.label }}
                            </option>
                        </select>
                        <span class="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                            <Icon icon="icon-park-outline:down" class="w-5 h-5 text-blue-500" />
                        </span>
                    </div>

                    <p v-if="errors.role" class="text-red-500 text-sm mt-1">
                        {{ errors.role }}
                    </p>
                </div>
                <div class="flex w-full justify-end space-x-6 mt-2" style="width: 400px; max-width: 100%">
                    <button class="w-14 h-8 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
                        @click="onDisableAddUserModal">
                        ຍົກເລີກ
                    </button>
                    <button class="w-14 h-8 bg-blue-500 text-gray-100 text-sm rounded hover:bg-blue-600"
                        @click="onAddUser">
                        ບັນທຶກ
                    </button>
                </div>
            </div>
        </div>

        <!-- edit user modal -->
        <div v-if="showEditUserModal"
            class="fixed inset-0 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50 z-50">
            <div class="bg-white rounded-lg p-8 shadow-lg flex flex-col items-center" style="
                    width: 500px;
                    max-width: 100%;
                    max-height: 90vh;
                    overflow-y: auto;
                ">
                <div class="text-gray-600 text-xl font-bold mb-4">
                    ແກ້ໄຂຂໍ້ມູນຜູ້ໃຊ້
                </div>
                <div class="mb-4">
                    <label for="tlrId" class="text-gray-700 font-medium mb-1 flex justify-start items-center">
                        ເລກເທລເລີ
                    </label>
                    <input id="tlrId" v-model="userItem.tlrId" disabled="true" type="text"
                        class="w-full border-gray-300 border rounded-md focus:ring-blue-100 focus:border-blue-500 p-2"
                        style="
                            width: 400px;
                            max-width: 100%;
                            max-height: 90vh;
                            overflow-y: auto;
                        " @keyup.enter="onGetUserInfo(tlrId)" />
                </div>
                <div class="mb-4">
                    <label for="tlrNameLa" :class="[
                        'block text-gray-700 font-medium mb-1',
                        loading ? 'animate-pulse' : '',
                    ]">
                        ຊື່ພາສາລາວ
                    </label>
                    <input id="tlrNameLa" v-model="userItem.tlrNameLa" disabled="true" type="text" :class="[
                        'w-full border-gray-300 border rounded-md focus:ring-blue-100 focus:border-blue-500 p-2',
                        loading ? 'animate-pulse' : '',
                    ]" style="
                            width: 400px;
                            max-width: 100;
                            max-height: 90vh;
                            overflow-y: auto;
                        " />
                </div>
                <div class="mb-4">
                    <label for="tlrNameEn" :class="[
                        'block text-gray-700 font-medium mb-1',
                        loading ? 'animate-pulse' : '',
                    ]">
                        ຊື່ພາສາອັງກິດ
                    </label>
                    <input id="tlrNameEn" v-model="userItem.tlrNameEn" disabled="true" type="text" :class="[
                        'w-full border-gray-300 border rounded-md focus:ring-blue-100 focus:border-blue-500 p-2',
                        loading ? 'animate-pulse' : '',
                    ]" style="
                            width: 400px;
                            max-width: 100%;
                            max-height: 90vh;
                            overflow-y: auto;
                        " />
                </div>
                <div class="mb-4">
                    <label for="tlrBranch" :class="[
                        'block text-gray-700 font-medium mb-1',
                        loading ? 'animate-pulse' : '',
                    ]">
                        ສາຂາ
                    </label>
                    <input id="tlrBranch" v-model="userItem.tlrBranch" type="text" disabled="true" :class="[
                        'w-full border-gray-300 text-gray-700 border rounded-md focus:ring-blue-100 focus:border-blue-500 p-2',
                        loading ? 'animate-pulse' : '',
                    ]" style="
                            width: 400px;
                            max-width: 100%;
                            max-height: 90vh;
                            overflow-y: auto;
                        " />
                </div>
                <div class="relative mb-4">
                    <label for="role" :class="[
                        'block text-gray-700 font-medium mb-1',
                        loading ? 'animate-pulse' : '',
                    ]">
                        ສິດທິຜູ້ໃຊ້
                    </label>
                    <div class="flex items-center justify-between relative">
                        <select id="role" v-model="role"
                            class="block w-full border border-gray-400 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-4 py-2 text-gray-700 appearance-none cursor-pointer"
                            style="
                                width: 400px;
                                max-width: 100%;
                                max-height: 90vh;
                                overflow-y: auto;
                            " @change="onSearch">
                            <option value="" disabled>ເລືອກສິດທິຜູ້ໃຊ້</option>
                            <option v-for="item in ROLES" :key="item.value" :value="item.value"
                                class="bg-gray-200 hover:bg-gray-300">
                                {{ item.label }}
                            </option>
                        </select>
                        <span class="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                            <Icon icon="icon-park-outline:down" class="w-5 h-5 text-blue-500" />
                        </span>
                    </div>

                    <p v-if="errors.role" class="text-red-500 text-sm mt-1">
                        {{ errors.role }}
                    </p>
                </div>
                <div class="flex w-full justify-end space-x-6 mt-2" style="width: 400px; max-width: 100%">
                    <button class="w-14 h-8 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
                        @click="onDisableEditUserModal">
                        ຍົກເລີກ
                    </button>
                    <button class="w-14 h-8 bg-blue-500 text-gray-100 text-sm rounded hover:bg-blue-600"
                        @click="onEditUser">
                        ບັນທຶກ
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { Icon } from "@iconify/vue";

// Assume these are provided from your store
const { setQueryServerSide, isQueryServerSide } = useMainStore();
const userStore = useUserStore();

// Pagination and other state
const itemsPerPageCookie = useCookie("itemsPerPage");
const currentPageCookie = useCookie("currentPage");
const branchCode = useCookie("branchCode");
const userId = useCookie("userId");
const listItemsPerPage = ref([10, 20, 30, 50]);
const itemsPerPage = ref();
const currentPage = ref();
const isDropdownOpen = ref(false);
const loading = ref(false);
const isFirst = ref(false);
const filters = ref();
const search = ref("");
const selectedBranch = ref("");
const disableSelectBranch = ref(false);
const showAddUserModal = ref(false);
const showEditUserModal = ref(false);
const isProcessing = ref(false);
const tlrId = ref("");
const tlrNameLa = ref("");
const tlrNameEn = ref("");
const tlrBranch = ref("");
const role = ref("");
const userItem = ref(null);

const errors = ref({
    tlrId: "",
    role: "",
});

const headers = ref([
    { title: "ລຳດັບ", key: "no", width: 12, align: "end" },
    { title: "ເລກເທລເລີ", key: "tlrId", align: "start" },
    { title: "ຊື່ພາສາລາວ", key: "tlrNameLa", align: "start" },
    { title: "ຊື່ພາສາອັງກິດ", key: "tlrNameEn", align: "start" },
    { title: "ສາຂາ", key: "tlrBranch", align: "start" },
    { title: "ສິດທິຜູ້ໃຊ້", key: "role", align: "center" },
    { title: "ເພີ່ມໂດຍຜູ້ໃຊ້", key: "createdBy", align: "start" },
    { title: "ວັນທີ່ເພີ່ມ", key: "createdAt", align: "start" },
    { title: "ຈັດການ", key: "action", align: "center" },
]);

onMounted(() => {
    if (branchCode.value.toString() === "400100") {
        selectedBranch.value = BRANCH[0].branchCode;
    } else {
        selectedBranch.value = branchCode.value;
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
        userStore.setPagination(filters.value);
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

//Get teller info
const getTellerInfo = async (tlrId) => {
    loading.value = true;
    await userStore.setTellerInfo(tlrId);

    if (userStore.getTellerInfo.data !== null) {
        tlrNameLa.value = userStore.getTellerInfo.data?.tlrNameLa;
        tlrNameEn.value = userStore.getTellerInfo.data?.tlrNameEn;
        tlrBranch.value = userStore.getTellerInfo.data?.tlrBranch;
    } else {
        tlrNameLa.value = "";
        tlrNameEn.value = "";
        tlrBranch.value = "";
    }
    loading.value = false;
};

// Validate inputs
const validateForm = () => {
    errors.value.tlrId = tlrId.value.trim() === "" ? "ກະລຸນາປ້ອນເລກເທລເລີ" : "";
    errors.value.role = role.value.trim() === "" ? "ກະລຸນາເລືອກສິດຜູ້ໃຊ້" : "";

    return Object.values(errors.value).every((error) => error === "");
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
    await userStore.setPagination(filters.value);
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
    if (currentPage.value < userStore.getPagination?.totalPage) {
        currentPage.value++;
        currentPageCookie.value = currentPage.value;
        await updatePagination();
    }
};

const onLastPage = async () => {
    if (currentPage.value < userStore.getPagination?.totalPage) {
        currentPage.value = userStore.getPagination?.totalPage;
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
    await userStore.setPagination(filters.value);
    setQueryServerSide(false);
};

const generatePageNumbers = () => {
    const totalPage = userStore.getPagination?.totalPage ?? 0;
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
    if (branchCode.value.toString() === "400100") {
        selectedBranch.value = BRANCH[0].branchCode;
    } else {
        selectedBranch.value = branchCode.value;
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
    await userStore.setPagination(filters.value);
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

const onShowAddUserModal = () => {
    showAddUserModal.value = true;
};

const onDisableAddUserModal = () => {
    showAddUserModal.value = false;
    tlrId.value = "";
    tlrNameLa.value = "";
    tlrNameEn.value = "";
    tlrBranch.value = "";
    role.value = "";
};

const onAddUser = async () => {
    if (!validateForm()) return;
    showAddUserModal.value = false;
    isProcessing.value = true;
    await userStore.create(
        JSON.parse(JSON.stringify({ tlrId: tlrId.value, role: role.value })),
    );
    await onRefresh();
    tlrId.value = "";
    tlrNameLa.value = "";
    tlrNameEn.value = "";
    tlrBranch.value = "";
    role.value = "";
    isProcessing.value = false;
};

const onShowEditUserModal = (item) => {
    showEditUserModal.value = true;
    userItem.value = item;
    role.value = item.role;
};

const onDisableEditUserModal = (item) => {
    showEditUserModal.value = false;
    userItem.value = null;
    role.value = null;
};

const onEditUser = async () => {
    showEditUserModal.value = false;
    isProcessing.value = true;
    await userStore.update(
        JSON.parse(
            JSON.stringify({
                id: userItem.value.id,
                role: role.value,
            }),
        ),
    );
    await onRefresh();
    userItem.value = null;
    role.value = null;
    isProcessing.value = false;
};
</script>
