// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2024-11-01",
    devtools: { enabled: true },
    css: [
        "@/assets/css/tailwind.css",
        "vue-toast-notification/dist/theme-default.css",
    ],
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },
    app: {
        head: {
            htmlAttrs: {
                lang: "en",
            },
            charset: "utf-16",
            viewport: "width=device-width, initial-scale=1",
            title: "APB Fixed Assets",
            link: [{ rel: "icon", type: "image/png", href: "/logo.png" }],
        },
    },
    devServer: {
        host: "0.0.0.0", // Accept connections from any device in your network
        port: 8000,
    },
    runtimeConfig: {
        API_URL: process.env.API_URL,
        API_KEY: process.env.API_KEY,
        public: {
          IMAGE_URL: process.env.CDN,
          CDN: process.env.CDN,
        },
    },
    modules: [
        "@nuxtjs/tailwindcss",
        "@nuxt/icon",
        // https://github.com/nuxt-modules/eslint
        // "@nuxtjs/eslint-module",
        [
            "@pinia/nuxt",
            {
                autoImports: ["defineStore", "acceptHMRUpdate", "storeToRefs"],
            },
        ],
    ],
    imports: {
        dirs: ["./stores"],
    },
    sourcemap: false,
    webpack: {
        loaders: {
            vue: {
                hotReload: true,
            },
        },
    },
    vite: {
        build: {
            sourcemap: false, // Disable source maps during the build
        },
    },
    // routeRules: {
    //   '/**': { appMiddleware: 'global-auth' }, // Apply to all routes
    // },
    ssr: true,
});
