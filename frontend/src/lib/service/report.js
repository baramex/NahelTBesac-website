import { api } from ".";

export function fetchReports(profile = "@me") {
    return api(`/profile/${profile}/reports`, "GET");
}

export function fetchReportsQuery(params) {
    return api("/reports?" + Object.keys(params).map(key => key + '=' + params[key]).join('&'), "GET");
}

export function createReport(data) {
    return api("/report", "POST", data);
}