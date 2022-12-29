import { Dialog } from "@headlessui/react";
import { useEffect, useState } from "react";
import Modal from ".";

export default function MorningReportModal({ onClose, id: _id, open }) {
    const [id, setId] = useState(_id);

    useEffect(() => {
        if (_id) setId(_id);
    }, [_id]);

    return (<Modal onClose={onClose} open={open}>
        <div>
            <Dialog.Title as="h3" className="text-center text-lg font-medium leading-6 text-gray-900">
                Rapport du Matin
            </Dialog.Title>
            <div className="mt-7">
                <img className="w-full" src={`/api/morning-report/${id}/photo`} alt="Colis Chargés" />
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