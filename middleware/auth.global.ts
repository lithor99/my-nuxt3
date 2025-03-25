import { jwtDecode } from "jwt-decode"; // Ensure you have jwt-decode installed: npm install jwt-decode

export default defineNuxtRouteMiddleware((to, _) => {
    let isLogin = true;
    const token = useCookie<string>("token");
    const itemsPerPage = useCookie("itemsPerPage");
    const currentPage = useCookie("currentPage");

    // Check if token exists and is valid
    if (!token.value || token.value === "null" || token.value === "undefined") {
        isLogin = false;
    } else {
        try {
            const decodedToken = jwtDecode<{ exp: number }>(token.value);
            const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

            if (decodedToken.exp < currentTime) {
                console.warn("Token expired, redirecting to login.");
                isLogin = false;
            }
        } catch (error) {
            console.error("Invalid token:", error);
            isLogin = false;
        }
    }

    console.log("is login:", isLogin);
    console.log("path:", to.path);

    // Redirect to login if token is missing or expired
    if (to.path !== "/login" && !isLogin) {
        itemsPerPage.value = null;
        currentPage.value = null;
        return navigateTo("/login");
    }

    // Redirect to home if already logged in and trying to access login page
    if (to.path === "/login" && isLogin) {
        return navigateTo("/fixed-asset");
    }
});
