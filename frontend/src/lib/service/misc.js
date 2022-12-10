import { api } from ".";

export function fetchRoles() {
    return api("/roles", "get");
}