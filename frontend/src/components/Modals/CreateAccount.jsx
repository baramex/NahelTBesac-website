import { Dialog } from "@headlessui/react";
import { ArrowPathIcon, UserIcon } from "@heroicons/react/24/outline";
import Modal from "."
import { Field, Label, TextField } from "../Misc/Fields";
import { firstnamePattern, getPasswordErrors, handleFirstameInput, handleLastnameInput, isValidPassword, lastnamePattern, passwordPattern } from "../../lib/utils/regex"
import { useEffect, useRef, useState } from "react";
import { AlertError } from "../Misc/Alerts";
import { register } from "../../lib/service/authentification";

export default function CreateAccountModal({ open, addAlert, roles, onClose }) {
    const passwordField = useRef();

    const [errors, setErrors] = useState(null);

    useEffect(() => {
        if (open && errors) setErrors(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    return (<Modal onClose={onClose} open={open}>
        <div>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-theme-50">
                <UserIcon className="h-6 w-6 text-theme-600" aria-hidden="true" />
            </div>
            <div className="mt-3 sm:mt-5">
                <Dialog.Title as="h3" className="text-lg text-center font-medium leading-6 text-gray-900">
                    Créer un compte
                </Dialog.Title>
                <div className="mt-2">
                    <form
                        onSubmit={e => handleSubmit(e, addAlert, onClose)}
                        className="mt-10 grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-2"
                    >
                        <TextField
                            label="Prénom"
                            id="firstname"
                            name="firstname"
                            placeholder="Prénom"
                            type="text"
                            maxLength="32"
                            minLength="2"
                            autoComplete="off"
                            variant="theme"
                            pattern={firstnamePattern}
                            onInput={handleFirstameInput}
                            required
                        />
                        <TextField
                            label="Nom"
                            id="lastname"
                            name="lastname"
                            placeholder="NOM"
                            type="text"
                            maxLength="32"
                            minLength="2"
                            autoComplete="off"
                            variant="theme"
                            pattern={lastnamePattern}
                            onInput={handleLastnameInput}
                            required
                        />
                        <TextField
                            className="col-span-full"
                            label="Adresse email"
                            placeholder="exemple@domaine.xyz"
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="off"
                            variant="theme"
                            required
                        />
                        <div className="col-span-full">
                            <Label variant="theme">Fonction</Label>
                            <Field
                                Element="select"
                                placeholder="Fonction"
                                variant="theme"
                                id="role"
                                name="role"
                                className="required:invalid:text-gray-400"
                                defaultValue=""
                                required
                            >
                                <option value="" hidden disabled>Sélectionner la fonction</option>
                                {roles?.map(role => <option value={role._id} className="text-theme-800" key={role._id}>{role.name}</option>)}
                            </Field>
                        </div>
                        <div className="col-span-full">
                            <Label variant="theme">Mot de Passe</Label>
                            <div className="grid grid-cols-3 gap-4">
                                <TextField
                                    className="col-span-2"
                                    placeholder="•••••••••"
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="off"
                                    variant="theme"
                                    pattern={passwordPattern}
                                    forwardRef={passwordField}
                                    onInput={e => handlePasswordInput(e, setErrors)}
                                    required
                                />
                                <button onClick={() => generatePassword(passwordField)} type="button" className="transition-colors hover:border-theme-400 hover:text-theme-900 bg-theme-100 focus:outline-none border border-theme-300 text-theme-800 rounded-md text-sm text-white flex items-center justify-center"><ArrowPathIcon className="w-4 mr-2" />Générer</button>
                            </div>
                        </div>
                        {errors && <AlertError className="col-span-full" title={errors[0]} list={errors.slice(1)} canClose={false} onClose={() => setErrors(null)} />}
                        <div className="col-span-full mt-3 md:grid md:grid-flow-row-dense md:grid-cols-2 md:gap-6">
                            <button
                                type="button"
                                className="mb-3 md:mb-0 transition-colors focus:outline-none w-full rounded-md border border-red-500 py-1.5 text-red-500 hover:bg-red-50 hover:border-red-600 hover:text-red-600"
                                onClick={() => onClose(false)}
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                name="submit"
                                className="w-full rounded-md focus:outline-none bg-theme-500 text-white py-1.5 hover:bg-theme-600 transition-colors"
                            >
                                Enregistrer
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div >
    </Modal >
    );
}

function handlePasswordInput(e, setErrors) {
    const errors = getPasswordErrors(e.target.value);

    if (errors.length === 0) return setErrors(null);
    setErrors(["Le mot de passe ne respecte pas ces critères", ...errors]);
}

async function handleSubmit(e, addAlert, onClose) {
    e.preventDefault();

    const elements = e.target.querySelectorAll("input, button, select");
    elements.forEach(el => el.disabled = true);

    const firstname = e.target.firstname.value.trim();
    const lastname = e.target.lastname.value.trim();
    const email = e.target.email.value.trim();
    const role = e.target.role.value.trim();
    const password = e.target.password.value.trim();

    try {
        const user = await register({ email, name: { firstname, lastname }, password, role });
        onClose(user);
        addAlert({ type: "success", title: "Le compte a bien été créé.", popup: true });
    } catch (error) {
        addAlert({ type: "error", title: error.message || "Une erreur est survenue.", ephemeral: true });
        elements.forEach(el => el.disabled = false);
    }
}

function generatePassword(ref) {
    if (!ref.current) return;

    const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const passwordLength = 12;
    let password = "";

    for (var i = 0; i <= passwordLength; i++) {
        var randomNumber = Math.floor(Math.random() * chars.length);
        password += chars.substring(randomNumber, randomNumber + 1);
    }

    if (!isValidPassword(password)) return generatePassword(ref);

    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
    nativeInputValueSetter.call(ref.current, password);

    const ev2 = new Event('input', { bubbles: true });
    ref.current.dispatchEvent(ev2);
}