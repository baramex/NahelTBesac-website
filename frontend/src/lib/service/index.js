import axios from 'axios';

export function api(endpoint, method, data = undefined, customHeader = undefined, responseType = undefined) {
    return new Promise((res, rej) => {
        // -> axios clear data
        const copyData = data ? { ...data } : undefined;
        const copyHeader = customHeader ? { ...customHeader } : undefined;

        axios({
            method,
            url: "http://localhost:5000" + endpoint,
            data,
            headers: customHeader,
            responseType,
            withCredentials: true
        }).then(response => {
            res(response.data);
        }).catch(err => {
            const response = err.response;
            if (!response) return rej(new Error());
            const status = response.status;
            const time = err.response.headers["retry-after"];
            if (status === 429 && time && time * 1000 < 10000) {
                setTimeout(() => {
                    api(endpoint, method, copyData, copyHeader).then(res).catch(rej);
                }, time * 1000);
            }
            else if (status === 401) {
                if (response.data === "refresh") document.location.reload();
                rej(new Error(response.data));
            }
            else {
                const message = response.data;
                rej(new Error(message));
            }
        });
    });
}

export function fetchData(addAlert, setter, func, softRej = true, ...params) {
    return new Promise((res, rej) => {
        func(...params).then(data => {
            setter(data);
            res(data);
        }).catch(err => {
            addAlert({ type: "error", title: "Erreur récupération API: " + (err.message || "Une erreur est survenue."), ephemeral: true });
            if (softRej) res(undefined);
            else rej(err)
        });
    });
}

export function dataSetter(setData, prop) {
    return function (value) {
        setData(prev => ({ ...prev, [prop]: value }));
    };
}