import { Dialog } from "@headlessui/react";
import { CameraIcon, TruckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import { useState } from "react";
import Modal from ".";
import { createReport } from "../../lib/service/report";
import { FuelGaugeField, Label, SelectMenuField, StarRatingField, TextField } from "../Misc/Fields";

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
                            id="star"
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
                            id="fuel"
                            label="Essence restante"
                            variant="theme"
                            showRequired={true}
                            required
                        />
                        <div className="col-span-full">
                            <Label variant="theme">Colis Retours</Label>
                            <PacketsNotDeliveredContainer />
                        </div>
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

async function handleSubmit(e, addAlert, onClose) {
    e.preventDefault();

    const elements = e.target.querySelectorAll("input, button, select");
    elements.forEach(el => el.disabled = true);

    const round = parseInt(e.target.round.value);
    const opinion = parseInt(e.target.star.value);
    const mileage = parseInt(e.target.mileage.value);
    const fuel = parseInt(e.target.fuel.value);

    const packetsNotDeliveredReasons = Array.from(e.target.querySelectorAll("[id^='reason-']").values()).map(e => ({ id: e.id.replace("reason-", ""), value: e.value }));
    const packetsNotDeliveredPhotos = Array.from(e.target.querySelectorAll("[id^='photo-']").values()).map(e => ({ id: e.id.replace("photo-", ""), value: e.files[0] }));
    const packetsNotDeliveredComments = Array.from(e.target.querySelectorAll("[id^='comment-']").values()).map(e => ({ id: e.id.replace("comment-", ""), value: e.value.trim() }));
    const packetsNotDelivered = packetsNotDeliveredReasons.map((r, i) => ({ id: r.id, reason: r.value, comment: packetsNotDeliveredComments.find(a => a.id === r.id)?.value }));

    const form = new FormData();
    form.append("round", round);
    form.append("opinion", opinion);
    form.append("mileage", mileage);
    form.append("fuel", fuel);
    form.append("packetsNotDelivered", JSON.stringify(packetsNotDelivered));
    packetsNotDeliveredPhotos.forEach(photo => {
        form.append("packetsNotDeliveredPhoto-" + photo.id, photo.value);
    });

    try {
        const report = await createReport(form);
        addAlert({ type: "success", title: "Le rapport a bien été créé et envoyé.", ephemeral: true });
        onClose(report);
    } catch (error) {
        addAlert({ type: "error", title: error.message || "Une erreur est survenue.", ephemeral: true });
        elements.forEach(el => el.disabled = false);
    }
}

function PacketsNotDeliveredContainer() {
    const [packets, setPackets] = useState([]);

    return (<div className="grid gap-3">
        {packets.map((p, i) => p && <PacketNotDelivered onRemove={() => setPackets(e => { e[i] = false; return [...e]; })} key={i} id={i} />)}
        <button onClick={() => setPackets(e => [...e, true])} type="button" className="w-fit flex gap-1 items-center px-3.5 rounded-md focus:outline-none bg-theme-400 text-white py-1.5 hover:bg-theme-600 transition-colors mt-3">
            <PlusIcon className="stroke-white w-4" />Ajouter
        </button>
    </div>);
}

function PacketNotDelivered({ id, onRemove }) {
    const [photo, setPhoto] = useState(null);

    // TODO: upload photo + format km (thousand separator) + add pct next to fuel gauge account + add overflow personnal & report
    return (<div className="grid grid-cols-4 gap-5 border border-theme-200 rounded-md bg-theme-50 p-3 relative">
        <button onClick={() => onRemove(id)} type="button" className="absolute top-2 right-2"><XMarkIcon className="w-5 stroke-2 text-theme-500" /></button>
        <SelectMenuField
            id={`reason-${id}`}
            showRequired={true}
            label="Raison"
            variant="theme"
            inputClassName="!bg-white required:invalid:text-gray-400"
            defaultValue=""
            required
        >
            <option value="" hidden disabled>Sélectionner la raison</option>
            <option value="0" className="text-theme-800">NPAI (mauvaise adresse/nom/etc)</option>
            <option value="1" className="text-theme-800">Problème d'Accès</option>
            <option value="2" className="text-theme-800">Non Tenté</option>
            <option value="3" className="text-theme-800">Autre</option>
        </SelectMenuField>
        <div className="flex flex-col relative">
            <Label showRequired={true} variant="theme">Photo</Label>
            <label className={clsx("transition-colors h-full border hover:border-theme-300 text-sm hover:text-theme-700 border-theme-200 rounded-md bg-gray-50 text-theme-600 flex gap-2 items-center flex-1 cursor-pointer", photo ? "" : "justify-center")} htmlFor={`photo-${id}`}>
                {!photo ? <><CameraIcon className="w-5" />Caméra</> :
                    <><img className="h-10" src={photo.image} alt={photo.name} /><p className="text-ellipsis overflow-hidden pr-1 whitespace-nowrap">{photo.name}</p></>}
                <input onChange={e => setPhoto({ name: e.target.files[0].name, image: URL.createObjectURL(e.target.files[0]) })} id={`photo-${id}`} className='w-0 opacity-0 absolute bottom-0' type="file" accept=".png,.jpeg,.jpg,.tiff" capture="environment" required />
            </label>
        </div>
        <TextField
            id={`comment-${id}`}
            label="Commentaire"
            variant="theme"
            type="text"
            className="col-span-2"
            inputClassName="!bg-white"
            placeholder="Ajouter un renseignement..."
        />
    </div>);
}