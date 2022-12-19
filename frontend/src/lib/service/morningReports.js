import { api } from ".";

export function fetchMorningReport(id) {
    return api(`/morning-report/${id}`, "GET");
}

export function fetchMorningReports(profile = "@me") {
    return api(`/profile/${profile}/morning-reports`, "GET");
}

export function fetchMorningReportsQuery(params) {
    return api("/morning-reports?" + Object.keys(params).map(key => key + '=' + params[key]).join('&'), "GET");
}

export function createMorningReport(data) {
    return api("/morning-report", "POST", data, { "Content-Type": "multipart/form-data" });
}