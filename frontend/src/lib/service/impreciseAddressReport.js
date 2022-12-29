import { api } from ".";

export function fetchImpreciseAddressReport(id) {
    return api(`/imprecise-address-report/${id}`, "GET");
}

export function fetchImpreciseAddressReports(profile = "@me") {
    return api(`/profile/${profile}/imprecise-address-reports`, "GET");
}

export function fetchImpreciseAddressReportsQuery(params) {
    return api("/imprecise-address-reports?" + Object.keys(params).map(key => key + '=' + params[key]).join('&'), "GET");
}

export function createImpreciseAddressReport(packageNumber, note) {
    return api("/imprecise-address-report", "POST", { packageNumber, note });
}