import { api } from ".";

export function fetchUser(id = "@me") {
    return api("/profile/" + id, "get")
}

export function pacthUser(profile = "@me", data) {
    return api("/profile/" + profile, "patch", data);
}

export function fetchUsers() {
    return api("/profiles", "get");
}

export function deleteUser(id) {
    return api("/profile/" + id, "delete");
}