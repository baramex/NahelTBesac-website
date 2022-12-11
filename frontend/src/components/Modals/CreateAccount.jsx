import { Dialog } from "@headlessui/react";
import { ArrowPathIcon, UserIcon } from "@heroicons/react/24/outline";
import Modal from "."
import { Field, Label, TextField } from "../Misc/Fields";
import { firstnamePattern, getPasswordErrors, handleFirstameInput, handleLastnameInput, isValidPassword, lastnamePattern } from "../../lib/utils/regex"
import { useEffect, useRef, useState } from "react";
import { AlertError } from "../Misc/Alerts";

export default function CreateAccountModal({ open, roles, onClose }) {
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
                        onSubmit={e => handleSubmit(e, onClose)}
                        className="mt-10 grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-2"
                    >
                        <TextField
                            label="Prénom"
                            id="fistname"
                            name="fistname"
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
                            <Label>Fonction</Label>
                            <Field
                                Element="select"
                                placeholder="Fonction"
                                variant="theme"
                                className="required:invalid:text-gray-400"
                                defaultValue=""
                                required
                            >
                                <option value="" hidden disabled>Sélectionner la fonction</option>
                                {roles?.map(role => <option className="text-theme-800" key={role._id}>{role.name}</option>)}
                            </Field>
                        </div>
                        <div className="col-span-full">
                            <Label>Mot de Passe</Label>
                            <div className="grid grid-cols-3 gap-4">
                                <TextField
                                    className="col-span-2"
                                    placeholder="•••••••••"
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="off"
                                    variant="theme"
                                    forwardRef={passwordField}
                                    onInput={e => handlePasswordInput(e, setErrors)}
                                    required
                                />
                                <button onClick={() => generatePassword(passwordField)} type="button" className="transition-colors hover:border-theme-400 hover:text-theme-900 bg-theme-100 border border-theme-300 text-theme-800 rounded-md text-sm text-white flex items-center justify-center"><ArrowPathIcon className="w-4 mr-2" />Générer</button>
                            </div>
                        </div>
                        {errors && <AlertError className="col-span-full" title={errors[0]} list={errors.slice(1)} canClose={false} onClose={() => setErrors(null)} />}
                        <div className="col-span-full mt-3 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-6">
                            <button
                                type="button"
                                className="transition-colors w-full rounded-md border border-red-500 py-1.5 text-red-500 hover:bg-red-50 hover:border-red-600 hover:text-red-600"
                                onClick={onClose}
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                name="submit"
                                className="w-full rounded-md bg-theme-500 text-white py-1.5 hover:bg-theme-600 transition-colors"
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

function handleSubmit() {

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