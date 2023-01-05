import { Dialog } from "@headlessui/react";
import { TruckIcon } from "@heroicons/react/24/outline";
import Modal from ".";
import { createImpreciseAddressReport } from "../../lib/service/impreciseAddressReport";
import { TextField } from "../Misc/Fields";

export default function CreateImpreciseAddressReportModal({ open, onClose, addAlert }) {
    return (<Modal open={open} onClose={onClose}>
        <div>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-theme-50">
                <TruckIcon className="h-6 w-6 text-theme-600" aria-hidden="true" />
            </div>
            <div className="mt-3 sm:mt-5">
                <Dialog.Title as="h3" className="text-lg text-center font-medium leading-6 text-gray-900">
                    Nouveau Rapport d'Adresse Imprécise
                </Dialog.Title>
                <div className="mt-2">
                    <form
                        onSubmit={e => handleSubmit(e, addAlert, onClose)}
                        className="mt-10 grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-5"
                    >
                        <TextField
                            label="N° de Colis"
                            showRequired={true}
                            placeholder="A00 000 000 000"
                            id="packageNumber"
                            name="packageNumber"
                            autoComplete="off"
                            variant="theme"
                            maxLength={20}
                            className="col-span-2"
                            required
                        />
                        <TextField
                            label="Commentaire"
                            id="note"
                            name="note"
                            placeholder="Ajoutez un renseignement..."
                            autoComplete="off"
                            variant="theme"
                            className="col-span-3"
                        />
                        <div className="col-span-full">
                            <p className="text-xs text-theme-900">(<span className="text-red-600">*</span>) Champs obligatoire</p>
                            <div className="mt-3 grid gap-3 md:grid-flow-row-dense md:grid-cols-2 md:gap-6">
                                <button
                                    type="button"
                                    className="transition-colors focus:outline-none w-full rounded-md border border-red-500 py-1.5 text-red-500 hover:bg-red-50 hover:border-red-600 hover:text-red-600"
                                    onClick={() => onClose(false)}
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    name="submit"
                                    className="w-full rounded-md focus:outline-none bg-theme-500 text-white py-1.5 hover:bg-theme-600 transition-colors"
                                >
                                    Envoyer
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div >
    </Modal >)
}

async function handleSubmit(e, addAlert, onClose) {
    e.preventDefault();

    const elements = e.target.querySelectorAll("input, button, select");
    elements.forEach(el => el.disabled = true);

    const packageNumber = e.target.packageNumber.value;
    const note = e.target.note.value;

    try {
        const report = await createImpreciseAddressReport(packageNumber, note);
        addAlert({ type: "success", title: "Le rapport a bien été créé et envoyé.", ephemeral: true });
        onClose(report);
    } catch (error) {
        addAlert({ type: "error", title: error.message || "Une erreur est survenue.", ephemeral: true });
        elements.forEach(el => el.disabled = false);
    }
}