import { CheckIcon, ExclamationTriangleIcon, PencilSquareIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";
import { useEffect, useRef, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { fetchData } from "../../lib/service";
import { fetchRoles } from "../../lib/service/misc";
import { fetchUser, fetchUsers, pacthUser } from "../../lib/service/profile";
import { fetchReports, fetchReportsQuery } from "../../lib/service/report";
import { formatDate } from "../../lib/utils/date";
import { hasPermission, PERMISSIONS } from "../../lib/utils/permissions";
import { fullnamePattern, handleFullnameInput } from "../../lib/utils/regex";
import { FuelGauge, Triangle } from "../Images/Icons";
import Footer from "../Layout/Footer";
import Header from "../Layout/Header";
import { Field } from "../Misc/Fields";
import Loading from "../Misc/Loading";
import Table from "../Misc/Tables";
import CreateAccountModal from "../Modals/CreateAccount";

export default function Account(props) {
    const { id } = useParams();
    const isMe = (id === "@me" || id === props.user?._id) && id;
    const [user, setUser] = useState(isMe && props.user);

    const history = useHistory();

    const [reports, setReports] = useState(null);
    const [dayBeforeReports, setDayBefireReports] = useState(null);
    const [staff, setStaff] = useState(null);
    const [roles, setRoles] = useState(null);

    const canViewRoles = hasPermission(props.user, PERMISSIONS.VIEW_ROLES);
    const canViewReports = hasPermission(props.user, PERMISSIONS.VIEW_REPORTS);
    const canViewProfiles = hasPermission(props.user, PERMISSIONS.VIEW_PROFILES);
    const canEditProfiles = hasPermission(props.user, PERMISSIONS.EDIT_PROFILES);

    const canCreateReport = hasPermission(user, PERMISSIONS.CREATE_REPORT);

    const [newAccount, setNewAccount] = useState(false);

    useEffect(() => {
        if (isMe) setUser(props.user);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.user]);

    useEffect(() => {
        if (props.user) {
            if (!user && user !== 0 && canViewProfiles) fetchData(() => setUser(0), setUser, fetchUser, true, id);
            if (!reports && canCreateReport) fetchData(props.addAlert, setReports, fetchReports);
            if (!dayBeforeReports && canViewReports && isMe) {
                const dayBefore = new Date();
                dayBefore.setDate(dayBefore.getDate() - 1);
                dayBefore.setHours(0, 0, 0, 0);

                fetchData(props.addAlert, setDayBefireReports, fetchReportsQuery, true, { startDate: formatDate(dayBefore) });
            }
            if (!staff && canViewProfiles && isMe) fetchData(props.addAlert, setStaff, fetchUsers);
            if (!roles && canEditProfiles && canViewRoles) fetchData(props.addAlert, setRoles, fetchRoles);
        } else history.replace("/login");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    return (<>
        <CreateAccountModal roles={roles} onClose={() => setNewAccount(false)} open={newAccount} />

        <Header {...props} />
        <div className="pt-[4.5rem] text-white pb-12 px-6 max-w-7xl mx-auto pb-16">
            {!user ? (user === 0 || !canViewProfiles) ? <p className="text-center mt-8 font-medium"><ExclamationTriangleIcon className="w-6 inline mr-2" />{canViewProfiles ? "Utilisateur introuvable" : "Non autorisé"}</p> : <div className="mt-8 flex justify-center"><Loading /></div> : <>
                <h1 className="text-center text-4xl font-medium my-20">{isMe ? "Mon compte" : "Compte de " + user?.name.firstname}</h1>
                <div className="mt-10 divide-y divide-gray-300">
                    <div className="space-y-1">
                        <h3 className="text-xl font-semibold leading-6 text-white">Profil</h3>
                        {isMe && <p className="max-w-2xl text-sm text-gray-200">
                            En cas de problème, merci de contacter votre responsable.
                        </p>}
                    </div>
                    <div className="mt-6">
                        <dl className="grid divide-y divide-gray-300">
                            <EditableField
                                label="Nom prénom"
                                value={user ? user.name.lastname + " " + user.name.firstname : <Loading />}
                                addAlert={props.addAlert}
                                setUser={props.setUser}
                                isMe={isMe}

                                canUpdate={canEditProfiles}
                                type="text"
                                Element="input"
                                placeholder="NOM Prénom"
                                formatProperty={v => ({ name: { lastname: v.split(" ")[0], firstname: v.split(" ")[1] } })}
                                pattern={fullnamePattern}
                                onInput={handleFullnameInput}
                            />
                            <EditableField
                                label="Fonction"
                                value={user ? user.role.name : <Loading />}
                                addAlert={props.addAlert}
                                setUser={props.setUser}
                                isMe={isMe}

                                canUpdate={canEditProfiles}
                                Element="select"
                                formatProperty={v => ({ role: roles?.find(role => role.name === v)?._id })}
                            >
                                {roles?.map(role => <option key={role._id}>{role.name}</option>)}
                            </EditableField>
                            <EditableField
                                label="Email"
                                value={user ? user.email : <Loading />}
                                addAlert={props.addAlert}
                                setUser={props.setUser}
                                isMe={isMe}

                                canUpdate={true}
                                type="email"
                                Element="input"
                                placeholder="exemple@domaine.xyz"
                                formatProperty={v => ({ email: v })}
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

                {canViewReports && isMe &&
                    <Table
                        className="mt-10"
                        name="Rapports depuis Hier"
                        description="Tous les rapports remplis depuis hier matin."
                        head={["Livreur", "Tournée", "Avis", "Colis Retours", "Kilométrage", "Essence", "Date"]}
                        rows={dayBeforeReports && dayBeforeReports.map(a => [<div className="items-center flex">{a.profile.name.firstname} {a.profile.name.lastname}<Link to={`/user/${a.profile._id}`}><Triangle className="w-3 ml-2 stroke-gray-100" /></Link></div>, a.round, <div className="flex items-center">{a.opinion} <StarIcon className="ml-1 w-5 text-yellow-400" /></div>, <div className="items-center flex">{a.packetNotDelivered.length}<Triangle className="w-3 ml-2 stroke-gray-100" /></div>, a.mileage + " km", <FuelGauge className="text-gray-100 w-20" percentage={a.petrol} />, new Date(a.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "2-digit" })])}
                    />
                }

                {canViewProfiles && isMe &&
                    <Table
                        className="mt-10"
                        name="Personnel"
                        addButton="Ajouter"
                        onClick={() => setNewAccount(true)}
                        head={["Nom/prénom", "Fonction", "Email", "Dernier rapport"]}
                        description="Ajouter, modifier et supprimer des comptes."
                        clickable={true}
                        rows={staff && staff.map(a => [<>{a.name.lastname} {a.name.firstname} {isMe && <span className="text-xs font-normal text-gray-200">(vous)</span>}</>, a.role.name, a.email, hasPermission(a, PERMISSIONS.CREATE_REPORT) ? reports ? formatDate(reports.find(b => b.profile._id === a._id)?.date) || "--" : "--" : "--", !isMe && `/user/${a._id}`])}
                    />
                }
            </>
            }
        </div>
        <Footer {...props} />
    </>)
}

function EditableField({ label, value, canUpdate, setUser, addAlert, isMe, children, formatProperty, ...props }) {
    const [edit, setEdit] = useState(false);
    const input = useRef();

    return (<div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-3 flex items-center h-14">
        <dt className="text-sm font-medium text-white">{label}</dt>
        <dd className="mt-1 flex text-sm text-gray-100 sm:col-span-2 sm:mt-0 items-center">
            {edit ? <span className="flex-grow"><Field forwardRef={input} className="!w-1/2 !py-1 !border-theme-500 !text-gray-100 !bg-theme-700" defaultValue={value} {...props}>{children}</Field></span> : <span className="flex-grow">{value}</span>}
            {canUpdate &&
                <span className="ml-4 flex-shrink-0 flex gap-5">
                    {edit && <button
                        type="button"
                        className="transition-colors font-medium text-white hover:text-gray-100 focus:outline-none flex items-center"
                        onClick={() => setEdit(false)}
                    >
                        <XMarkIcon className="w-4 mr-1" /><span>Annuler</span>
                    </button>}
                    <button
                        type="button"
                        className="transition-colors font-medium text-white hover:text-gray-100 focus:outline-none flex items-center"
                        onClick={() => edit ? handleSave(formatProperty(input.current?.value), setUser, addAlert, setEdit, "La valeur a bien été modifiée.") : setEdit(!edit)}
                    >
                        {edit ? <CheckIcon className="w-4 mr-1" /> : <PencilSquareIcon className="w-4 mr-1" />}<span>{edit ? "Enregistrer" : "Modifier"}</span>
                    </button>
                </span>
            }
        </dd>
    </div>);
}

async function handleSave(data, setUser, addAlert, setEdit, message) {
    try {
        const user = await pacthUser(data);
        setUser(user);
        addAlert({ type: "success", title: message, ephemeral: true });
        setEdit(false);
    } catch (error) {
        addAlert({ type: "error", title: error.message || "Une erreur est survenue.", ephemeral: true });
    }
}