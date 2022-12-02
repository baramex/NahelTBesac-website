import { api } from ".";

export function fetchUser() {
    return api("/profile/@me", "get")
}

export function pacthUser(body) {
    return api("/profile/@me", "patch", body);
}