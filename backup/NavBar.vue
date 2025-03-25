<template>
    <!-- Horizontal Navigation Bar -->
    <nav class="bg-white border-b border-gray-300 px-4">
        <ul class="flex space-x-4">
            <li
                v-for="(item, index) in navItems"
                :key="index"
                @click="handleNavClick(item)"
                class="py-2 cursor-pointer relative"
            >
                <!-- Active/Inactive States -->
                <span
                    :class="[
                        'font-medium px-2 py-1',
                        currentPath === item.to
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-600 hover:text-blue-600',
                    ]"
                >
                    {{ item.label }}
                </span>
            </li>
        </ul>
    </nav>
</template>

<script setup lang="ts">
import { ref, defineProps } from "vue";
import { useRouter } from "vue-router";

// Example navigation items. You can pass them in as props or fetch from a store.
const props = defineProps({
    navItems: {
        type: Array,
        default: () => [
            { label: "ព័ត៌មានផ្ទាល់ខ្លួន", to: "/" },
            { label: "ក្រមសិស្ស", to: "/student-code" },
            { label: "បណ្ណា៖អត្តចរឹក", to: "/profile" },
            { label: "លិខិតបញ្ជាក់អប់រំ", to: "/education-certificate" },
        ],
    },
});

const router = useRouter();
const currentPath = ref(router.currentRoute.value.path);

// Navigate to a route when clicked
function handleNavClick(item: any) {
    router.push(item.to);
    currentPath.value = item.to;
}
</script>
