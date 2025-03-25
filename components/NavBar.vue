<template>
    <aside :class="[
        'bg-gray-100 border-r border-gray-300 transition-all duration-300',
        isNavOpen ? 'w-50' : 'w-16',
    ]">
        <!-- Optional Drawer Header -->
        <div class="h-14 flex items-center justify-start px-4 border-b border-gray-300">
            <!-- Menu Icon (Emits toggle event) -->
            <button class="focus:outline-none" @click="emit('toggle-nav')">
                <Icon icon="line-md:menu" width="24" height="24" />
            </button>
        </div>
        <nav class="mt-2">
            <ul>
                <li v-for="(item, index) in menuItems" :key="index" :class="[
                    'cursor-pointer flex items-center whitespace-nowrap bg-gray-100 hover:bg-gray-200 px-4 py-2',
                    currentRoute.includes(item.route) ? 'text-blue-600' : 'text-gray-700',]"
                    @click="onClick(item.route)">
                    <Icon :icon="item.icon" width="24" height="24" />
                    <div class="ml-2 transition-all duration-3000">
                        {{ isNavOpen ? item.label : "" }}
                    </div>
                </li>
            </ul>
        </nav>
    </aside>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import { Icon } from "@iconify/vue";

interface MenuItem {
    icon: string;
    label: string;
    route: string;
}

// Define component props with proper typing.
const props = defineProps({
    isNavOpen: {
        type: Boolean,
        default: true,
    },
    menuItems: {
        type: Array as PropType<MenuItem[]>,
        default: () => [],
    },
});

// Define emits to use in the template.
const emit = defineEmits<{ (event: "toggle-nav"): void }>();

const router = useRouter();
const route = useRoute();

const currentRoute = computed(() => route.path);


const onClick = (path: string) => {
    const itemsPerPageCookie = useCookie<number>("itemsPerPage");
    const currentPageCookie = useCookie<number>("currentPage");
    itemsPerPageCookie.value = 10;
    currentPageCookie.value = 1;
    router.push(path);
};

// const onClick = (route: string) => {
//     currentRoute.value = route;
//     router.push(route);
// };
</script>
