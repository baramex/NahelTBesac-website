import { api } from ".";
import { getCookie } from "../utils/cookie";

export function login(email, password) {
    return api("/login", "post", { email, password });
}

export async function register(data) {
    return await api("/profile", "post", data);
}

export function logout() {
    return api("/logout", "post");
}

export function refreshToken() {
    return api("/refresh", "post");
}

export function canRefresh() {
    return !isLogged() && getCookie("refreshToken");
}

export function isLogged() {
    return !!getCookie("token");
}