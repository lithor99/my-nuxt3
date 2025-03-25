<template>
    <div class="min-h-screen bg-gray-100 flex items-center justify-center">
        <!-- Login Card -->
        <div class="bg-white shadow-lg rounded-lg p-10 w-full max-w-lg">
            <div>
                <img src="/logo.png" alt="imahe" class="shadow-xs mx-auto mb-4" />
            </div>
            <h1 class="text-2xl font-bold text-gray-800 text-center mb-8">
                ລະບົບຕິດຕາມຊັບສົມບັດ ທສກ
            </h1>
            <form @submit.prevent="handleLogin">
                <!-- Username Input -->
                <div class="mb-4">
                    <label for="username" class="block text-gray-700 font-medium mb-2">
                        ເລກເທລເລີ
                    </label>
                    <input id="username" v-model="username" type="text" placeholder="ປ້ອນເລກເທລເລີ"
                        class="w-full border-gray-300 rounded-md shadow-md focus:ring-blue-100 focus:border-blue-500 p-2"
                        ref="usernameInput" />
                    <span v-if="isRequireUsername" class="text-red-500 text-sm">ກະລຸນາປ້ອນເລກເທລເລີ</span>
                </div>

                <!-- Password Input -->
                <div class="mb-4">
                    <label for="password" class="block text-gray-700 font-medium mb-2">
                        ລະຫັດຜ່ານ
                    </label>
                    <input id="password" v-model="password" type="password" placeholder="ປ້ອນລະຫັດຜ່ານ"
                        class="w-full border-gray-300 rounded-md shadow-md focus:ring-blue-500 focus:border-blue-500 p-2"
                        ref="passwordInput" />
                    <span v-if="isRequirePassword" class="text-red-500 text-sm">ກະລຸນາປ້ອນລະຫັດຜ່ານ</span>
                </div>

                <!-- Remember Me -->
                <div class="flex items-center space-x-2 mb-4">
                    <input id="checkbox1" v-model="isChecked" type="checkbox"
                        class="w-4 h-4 cursor-pointer text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        @change="handleChange" />
                    <label for="checkbox1" class="text-gray-700">
                        ຈື່ເລກເທລເລີໄວ້
                    </label>
                </div>

                <!-- Login Button -->
                <button type="submit"
                    class="w-full bg-blue-500 text-white py-2 mt-2 px-4 shadow-md rounded-lg hover:bg-blue-600 transition">
                    ເຂົ້າສູ່ລະບົບ
                </button>
            </form>

            <!-- Links -->
            <div class="mt-6 text-center">
                <p class="text-xs text-gray-400">Version 1.0</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

definePageMeta({
    layout: "blank",
});

const { $toast } = useNuxtApp();
const username = ref("");
const password = ref("");
const loading = ref(false);
const isChecked = ref(false);
const isRequireUsername = ref(false);
const isRequirePassword = ref(false);

// Create a ref for the password input element.
const passwordInput = ref(null);
const usernameInput = ref(null);

onMounted(() => {
    const isRememberMe = useCookie("isRememberMe");
    if (isRememberMe ?? false) {
        isChecked.value = isRememberMe.value ?? false;
        username.value = useCookie("username").value ?? "";
    }
});

const handleChange = (event) => {
    isChecked.value = event.target.checked;
};

// Focus on the password field when Enter is pressed on the username field.
// const focusPassword = () => {
//     if (passwordInput.value) {
//         passwordInput.value.focus();
//     }
// };

const handleLogin = async () => {
    if (!username.value) {
        isRequireUsername.value = true;
        return;
    }
    isRequireUsername.value = false;

    if (!password.value) {
        passwordInput.value.focus();
        isRequirePassword.value = true;
        return;
    }
    isRequirePassword.value = false;

    loading.value = true;

    const data = await useServer("/user/login", {
        method: "POST",
        body: JSON.parse(
            JSON.stringify({
                username: username.value,
                password: password.value,
            }),
        ),
    });

    loading.value = false;

    const response = data?.data?.value;
    if (response?.success) {
        $toast.success("Login successful!");
        if (isChecked.value) {
            const rememberMeCookie = useCookie("isRememberMe");
            rememberMeCookie.value = true;
            const usernameCookie = useCookie("username");
            usernameCookie.value = username.value;
        } else {
            const rememberMeCookie = useCookie("isRememberMe");
            rememberMeCookie.value = false;
            const usernameCookie = useCookie("username");
            usernameCookie.value = null;
        }
        window.location.replace("/fixed-asset");
    } else {
        window.location.replace("/login");
    }
};
</script>
