import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchData } from "../../lib/service";
import { fetchUser } from "../../lib/service/profile";
import { fetchReports, fetchReportsQuery } from "../../lib/service/report";
import { formatDate } from "../../lib/utils/date";
import { hasPermission, PERMISSIONS } from "../../lib/utils/permissions";
import { FuelGauge, Triangle } from "../Images/Icons";
import Footer from "../Layout/Footer";
import Header from "../Layout/Header";
import Table from "../Misc/Tables";

export default function Account(props) {
    const { id } = useParams();
    const [user, setUser] = useState((id === "@me" || id === props.user._id) && props.user);

    const [reports, setReports] = useState(null);
    const [dayBeforeReports, setDayBefireReports] = useState(null);
    const [staff, setStaff] = useState(null);

    const canViewReports = hasPermission(props.user, PERMISSIONS.VIEW_REPORTS);
    const canViewProfiles = hasPermission(props.user, PERMISSIONS.VIEW_PROFILES);
    const canCreateReport = hasPermission(props.user, PERMISSIONS.CREATE_REPORT);

    useEffect(() => {
        if (!user) fetchData(props.addAlert, setUser, fetchUser, false, id).catch(() => props.addAlert({ type: "error", title: "Utilisateur introuvable" }));
        if (!reports && canCreateReport) fetchData(props.addAlert, setReports, fetchReports);
        if (!dayBeforeReports && canViewReports) {
            const dayBefore = new Date();
            dayBefore.setDate(dayBefore.getDate() - 1);
            dayBefore.setHours(0, 0, 0, 0);

            fetchData(props.addAlert, setDayBefireReports, fetchReportsQuery, true, { startDate: formatDate(dayBefore) });
        }
        if (!staff && canViewProfiles) fetchData(props.addAlert, setStaff, fetchUser);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);


    return (<>
        <Header {...props} />
        {user &&
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
                                value={user.name.lastname + " " + user.name.firstname}
                            />
                            <Field
                                label="Fonction"
                                value={user.role.name}
                            />
                            <Field
                                label="Email"
                                value={user.email}
                                canUpdate={true}
                            />
                        </dl>
                    </div>
                </div>

                {canCreateReport &&
                    <Table
                        className="mt-10"
                        name="Rapports du Soir"
                        description="Vous pouvez remplir un rapport par jour."
                        addButton="Nouveau"
                        head={["Tournée", "Avis", "Colis Retours", "Kilométrage", "Essence", "Date"]}
                        rows={reports && reports.map(a => [a.round, <div className="flex items-center">{a.opinion} <StarIcon className="ml-1 w-5 text-yellow-400" /></div>, <div className="items-center flex">{a.packetNotDelivered.length}<Triangle className="w-3 ml-2 stroke-gray-100" /></div>, a.mileage + " km", <FuelGauge className="text-gray-100 w-20" percentage={a.petrol} />, new Date(a.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "2-digit" })])}
                    />
                }

                {canViewReports &&
                    <Table
                        className="mt-10"
                        name="Rapports depuis Hier"
                        head={["Livreur", "Tournée", "Avis", "Colis Retours", "Kilométrage", "Essence", "Date"]}
                        rows={dayBeforeReports && dayBeforeReports.map(a => [<div className="items-center flex">{a.profile.name.firstname} {a.profile.name.lastname}<Link to={`/account/${a.profile._id}`}><Triangle className="w-3 ml-2 stroke-gray-100" /></Link></div>, a.round, <div className="flex items-center">{a.opinion} <StarIcon className="ml-1 w-5 text-yellow-400" /></div>, <div className="items-center flex">{a.packetNotDelivered.length}<Triangle className="w-3 ml-2 stroke-gray-100" /></div>, a.mileage + " km", <FuelGauge className="text-gray-100 w-20" percentage={a.petrol} />, new Date(a.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "2-digit" })])}
                    />
                }
            </div>
        }
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