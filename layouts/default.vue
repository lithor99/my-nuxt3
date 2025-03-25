<template>
    <div class="flex h-screen">
        <!-- Left Side Nav -->
        <NavBar :is-nav-open="isNavOpen" :menu-items="menuItems" @toggle-nav="toggleNav" />

        <!-- Right Section (App Bar + Page Content) -->
        <div class="flex flex-col flex-1">
            <AppBar />

            <!-- Main Content Area -->
            <main class="flex-1 bg-gray-50 p-4 overflow-auto">
                <NuxtPage />
            </main>
        </div>
    </div>
</template>

<script setup lang="ts">

const isNavOpen = ref(true);
const branchCode = useCookie("branchCode");
const role = useCookie("role");

const menuItems = ref<any>([]);

onMounted(() => {
    if (
        role.value?.toString() === "ADMIN" &&
        branchCode.value?.toString() === "400100"
    ) {
        menuItems.value = [
            { icon: "proicons:home-2", label: "ໜ້າຫຼັກ", route: "/fixed-asset" },
            {
                icon: "mingcute:group-3-line",
                label: "ຂໍ້ມູນຜູ້ໃຊ້",
                route: "/user",
            },
            {
                icon: "fluent:document-print-28-regular",
                label: "ປະຫວັດການພີມ QR",
                route: "/print-history",
            },
            {
                icon: "mdi:clipboard-text-history-outline",
                label: "ປະຫວັດການກວດສອບ",
                route: "/check-history",
            },
        ];
    }
    if (role.value.toString() === "BRANCH") {
        menuItems.value = [
            { icon: "proicons:home-2", label: "ໜ້າຫຼັກ", route: "/fixed-asset" },
            {
                icon: "mingcute:group-3-line",
                label: "ຂໍ້ມູນຜູ້ໃຊ້",
                route: "/user",
            },
            {
                icon: "mdi:clipboard-text-history-outline",
                label: "ປະຫວັດການກວດສອບ",
                route: "/check-history",
            },
        ];
    }
    if (role.value?.toString() === "CHECKER") {
        menuItems.value = [
            { icon: "proicons:home-2", label: "ໜ້າຫຼັກ", route: "/fixed-asset" },
            {
                icon: "mdi:clipboard-text-history-outline",
                label: "ປະຫວັດການກວດສອບ",
                route: "/check-history",
            },
        ];
    }
    if (role.value?.toString() === "USER") {
        menuItems.value = [
            { icon: "proicons:home-2", label: "ໜ້າຫຼັກ", route: "/fixed-asset" },
        ];
    }
});


function toggleNav() {
    isNavOpen.value = !isNavOpen.value;
}
</script>
