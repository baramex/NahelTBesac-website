import { api } from ".";
import { getCookie } from "../utils/cookie";

export function login(username, password) {
    return api("/login", "post", { username, password });
}

export async function register(data) {
    return await api("/profile", "post", data);
}

export function logout() {
    return api("/disconnect", "post");
}

export function isLogged() {
    return !!getCookie("token");
}