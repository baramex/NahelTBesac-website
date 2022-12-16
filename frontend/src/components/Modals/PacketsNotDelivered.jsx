import { Dialog } from "@headlessui/react";
import { useEffect, useState } from "react";
import Modal from ".";
import { REASONS } from "../../lib/utils/reports";
import { Label } from "../Misc/Fields";

export default function PacketsNotDeliveredModal({ onClose, open, report: _report }) {
    const [report, setReport] = useState(_report);

    useEffect(() => {
        if(_report) setReport(_report);
    }, [_report]);

    return (<Modal onClose={onClose} open={open}>
        <div>
            <Dialog.Title as="h3" className="text-center text-lg font-medium leading-6 text-gray-900">
                Colis Retours
            </Dialog.Title>
            <div className="mt-7">
                {
                    report?.packetsNotDelivered?.length > 0
                        ? report.packetsNotDelivered.map((a, index) => <PacketNotDelivered key={index} index={index} id={report._id} packetNotDelivered={a} />)
                        : <p className="text-gray-600 text-center">Aucun colis retours.</p>
                }
            </div>
            <div className="mt-5 flex justify-center">
                <button
                    type="button"
                    className="px-5 rounded-md focus:outline-none bg-theme-500 text-white py-1.5 hover:bg-theme-600 transition-colors"
                    onClick={() => onClose(false)}
                >
                    Fermer
                </button>
            </div>
        </div>
    </Modal>);
}

function PacketNotDelivered({ index, id, packetNotDelivered }) {
    return (<div className="flex md:flex-row flex-col gap-5 border border-theme-200 rounded-md bg-theme-50 p-3 relative">
        <div className="flex flex-col gap-5 w-2/5">
            <div>
                <Label variant="theme">Numéro (id)</Label>
                <p className="text-theme-700 text-sm">{index} ({packetNotDelivered._id})</p>
            </div>
            <div>
                <Label variant="theme">Raison</Label>
                <p className="text-theme-700 text-sm">{REASONS[packetNotDelivered.reason]}</p>
            </div>
            <div>
                <Label variant="theme">Commentaire</Label>
                <p className="text-theme-700 text-sm break-words">{packetNotDelivered.comment || "Aucun commentaire."}</p>
            </div>
        </div>
        <div className="row-span-2 flex-1">
            <Label showRequired={true} variant="theme">Photo</Label>
            <img className="max-w-full max-h-64 md:max-h-80 object-cover" src={`/api/report/${id}/packetNotDelivered/${packetNotDelivered._id}/photo`} alt="paquet non livré" />
        </div>
    </div>);
}