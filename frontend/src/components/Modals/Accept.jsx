import { Dialog } from "@headlessui/react";
import { ArrowTopRightOnSquareIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import Modal from ".";

export default function AcceptModal({ open, toAccept, onAccept, addAlert }) {

    function onSubmit(e) {
        e.preventDefault();

        const checked = Array.from(e.target.querySelectorAll("input[type=checkbox]").values()).every(checkbox => checkbox.checked);
        if (!checked) return addAlert({ type: "error", title: "Vous devez tout accepter pour continuer", ephemeral: true });

        onAccept();
    }

    return (
        <Modal open={open} onClose={() => { }}>
            <form onSubmit={onSubmit}>
                <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                        <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                            Les conditions d'utilisation
                        </Dialog.Title>
                        <div className="mt-2">
                            <ul>
                                {toAccept.map((item, index) => (
                                    <li className="flex gap-2" key={index}>
                                        <input className="focus:outline-none" id={"accept-" + index} type="checkbox" name={"accept-" + index} />
                                        <label htmlFor={"accept-" + index}>J'ai lu et j'accepte <Link className="focus:outline-none inline-flex gap-1 text-indigo-600 underline" to={item.href} target="_blank"><span>{item.name}</span><ArrowTopRightOnSquareIcon className="w-4" /></Link>.</label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex justify-center">
                    <button
                        type="submit"
                        name="submit"
                        className="px-4 rounded-md focus:outline-none bg-theme-500 text-white py-1.5 hover:bg-theme-600 transition-colors"
                    >
                        Continuer
                    </button>
                </div>
            </form>
        </Modal>
    )
}