const passwordRegex = {
    total: /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,32}$)/,
    length: /^.{6,32}$/,
    chars: /((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9]))/
};

export const firstnamePattern = "^[A-ZÀ-ÿ][a-zà-ÿ]{1,31}$";
export const lastnamePattern = "^[A-Zà-ÿ]{2,32}$";
export const fullnamePattern = "^[A-Zà-ÿ]{2,32} [A-ZÀ-ÿ][a-zà-ÿ]{1,31}$";
export const passwordPattern = "^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9]))).{6,32}$";

export function handleFirstameInput(e) {
    if (!e.target.value) return;
    e.target.value = (e.target.value[0].toUpperCase() + e.target.value.slice(1).toLowerCase()).replace(/[^a-zA-ZÀ-ÿ]/g, "");
}

export function handleLastnameInput(e) {
    if (!e.target.value) return;
    e.target.value = e.target.value.toUpperCase().replace(/[^A-ZÀ-ÿ]/g, "");
}

export function handleFullnameInput(e) {
    if (!e.target.value) return;
    const firstpart = e.target.value.split(" ")[0];
    const secondpart = e.target.value.split(" ")[1];
    const lastchar = e.target.value.at(-1) === " " && !secondpart ? " " : "";
    e.target.value = (firstpart ? firstpart.toUpperCase().replace(/[^a-zA-ZÀ-ÿ]/g, "") : "") + lastchar + (secondpart ? " " + (secondpart[0].toUpperCase() + secondpart.slice(1).toLowerCase()).replace(/[^a-zA-ZÀ-ÿ]/g, "") : "");
}

export function getPasswordErrors(password) {
    const errors = [];
    if (!passwordRegex.length.test(password)) errors.push("Entre 6 et 32 caractères.");
    if (!passwordRegex.chars.test(password)) errors.push("Au moins deux des caractères: chiffre, lettre minuscule, lettre majuscule.");
    return errors;
}