<template>
    <div class="flex h-screen">
        <!-- Left Side Nav -->
        <nav-bar
            :isNavOpen="isNavOpen"
            :menuItems="menuItems"
            @toggle-nav="toggleNav"
        />

        <!-- Right Section (App Bar + Page Content) -->
        <div class="flex flex-col flex-1">
            <app-bar />

            <!-- Main Content Area -->
            <main class="flex-1 bg-gray-50 p-4 overflow-auto">
                <NuxtPage />
            </main>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
// import { AppBar } from "~/components/AppBar.vue";
// import NavBar from "~/components/NavBar.vue";

// Controls whether the nav is expanded or collapsed
const isNavOpen = ref(true);

// Example menu items
const menuItems = [
    { icon: "proicons:home-2", label: "ໜ້າຫຼັກ", route: "/" },
    {
        icon: "mdi:clipboard-text-history-outline",
        label: "ປະຫວັດພີມ QR",
        route: "/menu2",
    },
];

// Toggle the nav when the event is received from AppBar
function toggleNav() {
    isNavOpen.value = !isNavOpen.value;
}
</script>
