<template>
    <div>
        <header class="bg-primary text-white shadow-md">
            <div
                class="w-full mx-auto px-0 py-2 flex justify-between items-center"
            >
                <div class="text-2xl font-bold ml-5">
                    ລະບົບຕິດຕາມຊັບສົມບັດ ທສກ
                </div>
                <div ref="dropdownRef" class="relative">
                    <div class="flex justify-end items-center">
                        <span class="mr-2 text-md">
                            {{ nameLa }}
                        </span>
                        <button
                            class="text-white px-1 py-1 rounded-full hover:bg-blue-400 mr-4"
                            @click="toggleDropdown"
                        >
                            <Icon icon="bi:person-circle" class="h-7 w-7" />
                        </button>
                    </div>
                    <div
                        v-if="showDropdownDialog"
                        class="absolute right-1 mt-2 w-40 bg-white shadow-lg rounded-md overflow-hidden z-10"
                    >
                        <ul>
                            <li
                                class="flex items-center justify-start px-4 py-2 hover:bg-gray-200 cursor-pointer text-gray-700"
                                @click="onShowUserInfoDialog"
                            >
                                <Icon
                                    icon="bi:person-circle"
                                    class="h-5 w-5 text-gray-400 mr-2"
                                />
                                <span>ຂໍ້ມູນຜູ້ໃຊ້</span>
                            </li>
                            <li
                                class="flex items-center justify-start px-4 py-2 hover:bg-gray-200 cursor-pointer text-gray-700"
                                @click="onShowLogoutDialog"
                            >
                                <Icon
                                    icon="ri:logout-circle-r-line"
                                    class="h-5 w-5 text-red-400 mr-2"
                                />
                                ອອກຈາກລະບົບ
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </header>
        <div
            v-if="showUserInfoDialog"
            class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        >
            <div class="bg-white rounded-lg p-0 w-96 shadow-lg">
                <div class="flex justify-between items-start mb-2">
                    <div class="flex justify-start items-center mt-4 mb-2">
                        <Icon
                            icon="bi:person-circle"
                            class="h-7 w-7 text-gray-400 ml-5"
                        />
                        <h2 class="text-xl font-black text-gray-800 ml-2">
                            ຂໍ້ມູນຜູ້ໃຊ້
                        </h2>
                    </div>
                    <button @click="showUserInfoDialog = false">
                        <Icon
                            icon="bi:x-circle"
                            class="h-6 w-6 text-red-400 hover:text-red-600 m-2"
                        />
                    </button>
                </div>
                <div class="px-6 py-2">
                    <p class="mb-6">
                        <span class="text-gray-400">ເລກເທລເລີ: </span
                        ><span class="text-gray-800">{{ userId }}</span>
                    </p>
                    <p class="mb-6">
                        <span class="text-gray-400">ຊື່ພາສາລາວ: </span
                        ><span class="text-gray-800">{{ nameLa }}</span>
                    </p>
                    <p class="mb-6">
                        <span class="text-gray-400">ຊື່ພາອັງກິດ: </span
                        ><span class="text-gray-800">{{ nameEn }}</span>
                    </p>
                    <p class="mb-6">
                        <span class="text-gray-400">ສາຂາ: </span
                        ><span class="text-gray-800">{{ branchCode }}</span>
                    </p>
                </div>
            </div>
        </div>
        <div
            v-if="showLogoutDialog"
            class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        >
            <div class="bg-white rounded-lg p-6 w-96 shadow-lg">
                <h2
                    class="text-xl font-black text-gray-800 mb-6 flex justify-center"
                >
                    ອອກຈາກລະບົບ
                </h2>
                <p class="mb-10 text-red-500 flex justify-center">
                    ທ່ານຕ້ອງການອອກຈາກລະບົບບໍ?
                </p>
                <div class="flex justify-end space-x-6">
                    <button
                        class="w-14 h-8 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
                        @click="showLogoutDialog = false"
                    >
                        ຍົກເລີກ
                    </button>
                    <button
                        class="w-14 h-8 bg-red-400 text-gray-100 text-sm rounded hover:bg-red-500"
                        @click="onLogout"
                    >
                        ຕົກລົງ
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { Icon } from "@iconify/vue";

const token = useCookie<String>("token");
const userId = useCookie<String>("userId");
const nameLa = useCookie<String>("nameLa");
const nameEn = useCookie<String>("nameEn");
const branchCode = useCookie("branchCode");
const itemsPerPage = useCookie("itemsPerPage");
const currentPage = useCookie("currentPage");
const showDropdownDialog = ref(false);
const showUserInfoDialog = ref(false);
const showLogoutDialog = ref(false);
const dropdownRef = ref(null);

const toggleDropdown = () => {
    showDropdownDialog.value = !showDropdownDialog.value;
};

const onShowUserInfoDialog = () => {
    showDropdownDialog.value = false;
    showUserInfoDialog.value = true;
};

const onShowLogoutDialog = () => {
    showDropdownDialog.value = false;
    showLogoutDialog.value = true;
};

const onLogout = () => {
    token.value = null;
    userId.value = null;
    itemsPerPage.value = null;
    currentPage.value = null;
    navigateTo("/login");
};

// Click Outside Function
const handleClickOutside = (event: MouseEvent) => {
    if (
        dropdownRef.value &&
        !(dropdownRef.value as HTMLElement).contains(event.target as Node)
    ) {
        showDropdownDialog.value = false;
    }
};

onMounted(() => {
    document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
/* Add additional styles here if needed */
</style>
