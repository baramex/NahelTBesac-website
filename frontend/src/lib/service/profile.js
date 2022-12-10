import { api } from ".";

export function fetchUser(id = "@me") {
    return api("/profile/" + id, "get")
}

export function pacthUser(data) {
    return api("/profile/@me", "patch", data);
}

export function fetchUsers() {
    return api("/profiles", "get");
}