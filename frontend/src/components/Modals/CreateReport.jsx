import { Dialog } from "@headlessui/react";
import { TruckIcon } from "@heroicons/react/24/outline";
import Modal from ".";
import { FuelGaugeField, StarRatingField, TextField } from "../Misc/Fields";

export default function CreateReportModal({ open, onClose, addAlert }) {
    return (<Modal open={open} onClose={onClose}>
        <div>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-theme-50">
                <TruckIcon className="h-6 w-6 text-theme-600" aria-hidden="true" />
            </div>
            <div className="mt-3 sm:mt-5">
                <Dialog.Title as="h3" className="text-lg text-center font-medium leading-6 text-gray-900">
                    Novueau Rapport du Soir
                </Dialog.Title>
                <div className="mt-2">
                    <form
                        onSubmit={e => handleSubmit(e, addAlert, onClose)}
                        className="mt-10 grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-2"
                    >
                        <TextField
                            label="Tournée"
                            showRequired={true}
                            placeholder="0"
                            id="round"
                            name="round"
                            type="number"
                            autoComplete="off"
                            variant="theme"
                            required
                        />
                        <StarRatingField
                            label="Avis sur la tournée"
                            showRequired={true}
                            variant="theme"
                            required
                        />
                        <TextField
                            label="Kilométrage"
                            showRequired={true}
                            id="mileage"
                            name="mileage"
                            type="number"
                            autoComplete="off"
                            variant="theme"
                            unit="km"
                            inputClassName="pr-9 appearance-none"
                            required
                        />
                        <FuelGaugeField
                            label="Essence restante"
                            variant="theme"
                            showRequired={true}
                            required
                        />
                        <div className="col-span-full">
                            <p className="text-xs text-theme-900">(<span className="text-red-600">*</span>) Champs obligatoire</p>
                            <div className="mt-3 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-6">
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

function handleSubmit(e, addAlert, onClose) {

}