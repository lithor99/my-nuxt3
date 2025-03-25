/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./components/**/*.{vue,js}",
        "./layouts/**/*.vue",
        "./pages/**/*.vue",
        "./plugins/**/*.{js,ts}",
        "./app.vue",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#009D91", // Dark blue
                    light: "#3B82F6", // Light blue
                    dark: "#1E40AF", // Even darker blue
                },
                secondary: {
                    DEFAULT: "#9333EA", // Purple
                    light: "#A855F7", // Light purple
                    dark: "#7E22CE", // Darker purple
                },
                neutral: {
                    DEFAULT: "#374151", // Gray
                    light: "#6B7280", // Light gray
                    dark: "#111827", // Darker gray
                },
            },
        },
    },
    plugins: [],
};
