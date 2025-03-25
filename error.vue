<!-- app/error.vue -->
<template>
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
        <h1 class="text-5xl font-bold text-red-600">
            🙈 {{ error.statusCode || 404 }} 🙈
        </h1>
        <p class="mt-4 text-2xl text-gray-800">
            {{ error.message || 'An unexpected error occurred.' }}
        </p>
        <button class="bg-blue-500 text-white px-4 py-2 mt-6 rounded-lg hover:bg-blue-600"
            @click="navigateTo('/fixed-asset')">Go back home</button>
        <!-- <NuxtLink to="/fixed-asset" class="mt-6 text-blue-500 underline">
            Go back home
        </NuxtLink> -->
    </div>
</template>

<script setup>
const error = useError()
</script>