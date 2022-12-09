import { PencilSquareIcon, PlusIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { FuelGauge, Triangle } from "../Icons";
import Footer from "../Layout/Footer";
import Header from "../Layout/Header";

export default function Account(props) {
    const [reports] = useState([{ round: 0, opinion: 5, mileage: 75000, petrol: 80, date: new Date().getTime(), packetNotDelivered: [] }]);

    return (<>
        <Header {...props} />
        <div className="pt-[4.5rem] text-white pb-12 px-6 max-w-7xl mx-auto">
            <h1 className="text-center text-4xl font-medium my-20">Mon compte</h1>
            <div className="mt-10 divide-y divide-gray-300">
                <div className="space-y-1">
                    <h3 className="text-xl font-semibold leading-6 text-white">Profil</h3>
                    <p className="max-w-2xl text-sm text-gray-200">
                        En cas de problème, merci de contacter votre responsable.
                    </p>
                </div>
                <div className="mt-6">
                    <dl className="divide-y divide-gray-300">
                        <Field
                            label="Nom prénom"
                            value={props.user.name.lastname + " " + props.user.name.firstname}
                        />
                        <Field
                            label="Fonction"
                            value={props.user.role.name}
                        />
                        <Field
                            label="Email"
                            value={props.user.email}
                            canUpdate={true}
                        />
                    </dl>
                </div>
            </div>

            <div className="mt-10">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-xl font-semibold leading-6 text-white">Rapports du Soir</h1>
                        <p className="mt-1 text-sm text-gray-200">
                            Vous pouvez remplir un rapport par jour.
                        </p>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                        <button
                            type="button"
                            className="transition-colors flex items-center rounded-md border border-theme-50 px-3 py-1.5 text-sm font-medium text-theme-50 shadow-sm hover:border-theme-200 hover:text-theme-100 focus:outline-none sm:w-auto"
                        >
                            <PlusIcon className="w-5 mr-1" /><span>Nouveau</span>
                        </button>
                    </div>
                </div>
                <div className="mt-8 flex flex-col">
                    <div className="overflow-x-auto">
                        <div className="inline-block min-w-full py-2 align-middle">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead>
                                    <tr>
                                        <th scope="col" className="py-3.5 pr-3 text-left text-sm font-semibold text-white">
                                            Tournée
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                                            Avis
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                                            Colis Retours
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                                            Kilométrage
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                                            Essence
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                                            Date
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {reports.map((report) => (
                                        <tr key={report._id}>
                                            <td className="whitespace-nowrap py-4 pr-3 text-sm font-medium text-white">
                                                {report.round}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-100">
                                                <div className="flex items-center">
                                                    {report.opinion} <StarIcon className="ml-1 w-5 text-yellow-400" />
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-100">
                                                <div className="items-center flex">
                                                    {report.packetNotDelivered.length} <Triangle className="w-3 ml-2 stroke-gray-100" />
                                                </div></td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-100">{report.mileage} km</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-100"><FuelGauge className="text-gray-100 w-20" percentage={report.petrol} /></td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-100">{new Date(report.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "2-digit" })}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Footer {...props} />
    </>)
}

function Field({ label, value, canUpdate }) {
    return (<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
        <dt className="text-sm font-medium text-white">{label}</dt>
        <dd className="mt-1 flex text-sm text-gray-100 sm:col-span-2 sm:mt-0">
            <span className="flex-grow">{value}</span>
            {canUpdate &&
                <span className="ml-4 flex-shrink-0">
                    <button
                        type="button"
                        className="transition-colors font-medium text-white hover:text-gray-100 focus:outline-none flex items-center"
                    >
                        <PencilSquareIcon className="w-4 mr-1" /><span>Modifier</span>
                    </button>
                </span>
            }
        </dd>
    </div>);
}