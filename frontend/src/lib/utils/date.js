export function formatDuration(date) {
    const duration = new Date().getTime() - new Date(date).getTime();
    const seconds = Math.floor(duration / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    return years > 0 ? years + " ans" : months > 0 ? months + " mois" : days > 0 ? days + " jours" : hours > 0 ? hours + " heures" : minutes > 0 ? minutes + " minutes" : seconds + " secondes";
}

function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}

export function formatDate(date) {
    if (!date) return null;
    return [
        padTo2Digits(date.getMonth() + 1),
        padTo2Digits(date.getDate()),
        date.getFullYear(),
    ].join('-');
}