import { Dialog } from "@headlessui/react";
import { CameraIcon, TruckIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useState } from "react";
import Modal from ".";
import { createMorningReport } from "../../lib/service/morningReports";
import { Label } from "../Misc/Fields";

export default function CreateMorningReportModal({ open, onClose, addAlert }) {
    const [photo, setPhoto] = useState(null);

    return (<Modal open={open} onClose={onClose}>
        <div>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-theme-50">
                <TruckIcon className="h-6 w-6 text-theme-600" aria-hidden="true" />
            </div>
            <div className="mt-3 sm:mt-5">
                <Dialog.Title as="h3" className="text-lg text-center font-medium leading-6 text-gray-900">
                    Nouveau Rapport du Matin
                </Dialog.Title>
                <div className="mt-2">
                    <form
                        onSubmit={e => handleSubmit(e, addAlert, onClose)}
                        className="mt-10 grid grid-cols-1 gap-y-8 gap-x-6"
                    >
                        <div>
                            <Label variant="theme">Photo des Colis Chargés</Label>
                            <label className={clsx("h-auto py-2 px-3 transition-colors h-full border hover:border-theme-300 text-sm hover:text-theme-700 border-theme-200 rounded-md bg-gray-50 text-theme-600 flex gap-2 items-center flex-1 cursor-pointer", photo ? "" : "justify-center")} htmlFor="photo">
                                {!photo ? <><CameraIcon className="w-5" />Caméra</> :
                                    <><img className="h-10" src={photo.image} alt={photo.name} /><p className="text-ellipsis overflow-hidden pr-1 whitespace-nowrap">{photo.name}</p></>}
                                <input onChange={e => setPhoto({ name: e.target.files[0].name, image: URL.createObjectURL(e.target.files[0]) })} id="photo" className='w-0 opacity-0 absolute bottom-0' type="file" accept=".png,.jpeg,.jpg,.tiff" capture="environment" required />
                            </label>
                        </div>
                        <div className="col-span-full">
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

    const photo = e.target.photo.files[0];

    const form = new FormData();
    form.append("photo", photo);

    try {
        const report = await createMorningReport(form);
        addAlert({ type: "success", title: "Le rapport a bien été créé et envoyé.", ephemeral: true });
        onClose(report);
    } catch (error) {
        addAlert({ type: "error", title: error.message || "Une erreur est survenue.", ephemeral: true });
        elements.forEach(el => el.disabled = false);
    }
}