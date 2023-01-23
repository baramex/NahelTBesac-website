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

export function formatDate(date) {
    return date.getFullYear().toString().padStart(4, "0") + "-" + (date.getMonth() + 1).toString().padStart(2, "0") + "-" + date.getDate().toString().padStart(2, "0");
}