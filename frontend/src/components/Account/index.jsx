import { ArrowLeftIcon, CheckIcon, ExclamationTriangleIcon, EyeIcon, EyeSlashIcon, PencilSquareIcon, PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { fetchData } from "../../lib/service";
import { fetchRoles } from "../../lib/service/misc";
import { deleteUser, fetchUser, fetchUsers, pacthUser } from "../../lib/service/profile";
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
import ConfirmModal from "../Modals/Confirm";
import CreateAccountModal from "../Modals/CreateAccount";
import CreateReportModal from "../Modals/CreateReport";

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

    const params = new URLSearchParams(document.location.search);
    const [newAccount, setNewAccount] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [createReport, setCreateReport] = useState(false);

    useEffect(() => {
        if (params.has("newReport")) {
            setCreateReport(true);
            history.replace("/user/@me");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params]);

    useEffect(() => {
        if (isMe && ((user && user._id !== props.user._id) || !user)) setUser(props.user);
        if (!isMe && user && user._id !== id) setUser(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    useEffect(() => {
        if (isMe) props.setUser(user);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    useEffect(() => {
        if (props.user) {
            if (!user && user !== 0 && canViewProfiles) fetchData(() => setUser(0), setUser, fetchUser, true, id);
            if ((!reports || (reports[0]?.profile?._id !== id && user?._id === id)) && canCreateReport) fetchData(props.addAlert, setReports, fetchReports, true, id);

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
    }, [user, id]);

    return (<>
        <CreateAccountModal roles={roles} addAlert={props.addAlert} onClose={e => {
            if (e) {
                setStaff(a => a.push(e) && a);
            }
            setNewAccount(false);
        }} open={newAccount} />
        <ConfirmModal open={confirmDelete} message="Êtes-vous sûr de vouloir supprimer ce compte ?" onClose={setConfirmDelete} onConfirm={() => handleDelete(id, props.addAlert, history, setStaff, setConfirmDelete, setUser)} title="Suppression de Compte" />
        <CreateReportModal addAlert={props.addAlert} open={createReport} onClose={e => {
            if (e) {
                setReports(a => a.push(e) && a.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
            }
            setCreateReport(false)
        }} />

        <Header {...props} />
        <div className="pt-[4.5rem] text-white pb-12 px-6 max-w-7xl mx-auto pb-16">
            {(!user || (!isMe && user._id !== id) || (isMe && user._id !== props.user._id)) ? (user === 0 || !canViewProfiles) ? <p className="text-center mt-8 font-medium"><ExclamationTriangleIcon className="w-6 inline mr-2" />{canViewProfiles ? "Utilisateur introuvable" : "Non autorisé"}</p> : <div className="mt-8 flex justify-center"><Loading /></div> : <>
                {!isMe &&
                    <Link to="/user/@me" className="absolute mt-4 transition-colors flex items-center text-theme-50 hover:text-theme-100 hover:underline">
                        <ArrowLeftIcon className="w-5 mr-2" /> Retour à mon compte
                    </Link>}
                <h1 className="text-center text-4xl font-medium my-20">{isMe ? "Mon compte" : "Compte de " + user?.name.firstname}</h1>
                <div className="mt-10 divide-y divide-theme-100">
                    <div className="space-y-1">
                        <h3 className="text-xl font-semibold leading-6 text-white">Profil</h3>
                        {isMe && <p className="max-w-2xl text-sm text-gray-200">
                            En cas de problème, merci de contacter votre responsable.
                        </p>}
                    </div>
                    <div className="mt-6">
                        <dl className="grid divide-y divide-theme-100">
                            <EditableField
                                label="Nom prénom"
                                value={user ? user.name.lastname + " " + user.name.firstname : <Loading />}
                                addAlert={props.addAlert}
                                setUser={setUser}
                                isMe={isMe}

                                canUpdate={canEditProfiles}
                                profile={id}
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
                                setUser={setUser}
                                isMe={isMe}

                                canUpdate={canEditProfiles}
                                Element="select"
                                profile={id}
                                formatProperty={v => ({ role: roles?.find(role => role.name === v)?._id })}
                            >
                                {roles?.map(role => <option key={role._id}>{role.name}</option>)}
                            </EditableField>
                            <EditableField
                                label="Email"
                                value={user ? user.email : <Loading />}
                                addAlert={props.addAlert}
                                setUser={setUser}
                                isMe={isMe}

                                canUpdate={isMe ? true : canEditProfiles}
                                profile={id}
                                type="email"
                                Element="input"
                                placeholder="exemple@domaine.xyz"
                                formatProperty={v => ({ email: v })}
                            />
                            <EditableField
                                label="Mot de Passe"
                                addAlert={props.addAlert}
                                setUser={setUser}
                                isMe={isMe}

                                canUpdate={isMe ? true : canEditProfiles}
                                profile={id}
                                type="password"
                                Element="input"
                                placeholder="•••••••••"
                                formatProperty={v => ({ password: v })}
                            />
                        </dl>
                    </div>
                </div>
                {!isMe && canEditProfiles && <button onClick={() => setConfirmDelete(true)} className="transition-colors focus:outline-none border border-red-400 py-1 px-2 rounded-md text-sm text-red-400 mt-2 hover:text-red-500 hover:border-red-500">Supprimer le Compte</button>}

                {canCreateReport &&
                    <Table
                        className="mt-10"
                        name="Rapports du Soir"
                        description="Vous pouvez remplir un rapport par jour."
                        addButton={isMe && "Nouveau"}
                        onClick={() => setCreateReport(true)}
                        head={["Tournée", "Avis", "Colis Retours", "Kilométrage", "Essence", "Date"]}
                        rows={reports && reports.map(a => [a._id, a.round, <div className="flex items-center">{a.opinion} <StarIcon className="ml-1 w-5 text-yellow-400" /></div>, <div className="items-center flex">{a.packetsNotDelivered.length}<Triangle className="w-3 ml-2 stroke-gray-100" /></div>, a.mileage + " km", <FuelGauge className="text-gray-100 w-20" percentage={a.fuel} />, new Date(a.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "2-digit" })])}
                    />
                }

                {canViewReports && isMe &&
                    <Table
                        className="mt-10"
                        name="Rapports depuis Hier"
                        description="Tous les rapports remplis depuis hier matin."
                        head={["Livreur", "Tournée", "Avis", "Colis Retours", "Kilométrage", "Essence", "Date"]}
                        rows={dayBeforeReports && dayBeforeReports.map(a => [a._id, <div className="items-center flex">{a.profile.name.firstname} {a.profile.name.lastname}<Link to={`/user/${a.profile._id}`}><Triangle className="w-3 ml-2 stroke-gray-100" /></Link></div>, a.round, <div className="flex items-center">{a.opinion} <StarIcon className="ml-1 w-5 text-yellow-400" /></div>, <div className="items-center flex">{a.packetsNotDelivered.length}<Triangle className="w-3 ml-2 stroke-gray-100" /></div>, a.mileage + " km", <FuelGauge className="text-gray-100 w-20" percentage={a.fuel} />, new Date(a.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "2-digit" })])}
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
                        rows={staff && staff.map(a => [a._id, <>{a.name.lastname} {a.name.firstname} {a._id === props.user._id && <span className="text-xs font-normal text-gray-200">(vous)</span>}</>, a.role.name, a.email, hasPermission(a, PERMISSIONS.CREATE_REPORT) ? dayBeforeReports ? formatDate(dayBeforeReports.find(b => b.profile._id === a._id)?.date) || "--" : "--" : "--", a._id !== props.user._id && `/user/${a._id}`])}
                    />
                }
            </>
            }
        </div>
        <Footer {...props} />
    </>)
}

function EditableField({ label, profile, value, canUpdate, setUser, addAlert, isMe, children, formatProperty, type, ...props }) {
    const [edit, setEdit] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const input = useRef();
    const [id] = useState(Math.round(Math.random() * 10000));

    return (<form className="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-3 flex items-center h-14">
        <dt className="text-sm font-medium text-white">{label}</dt>
        <dd className="mt-1 flex text-sm text-gray-100 sm:col-span-2 sm:mt-0 items-center">
            {edit ? <span className="flex-grow">{
                type === "password" && props.Element === "input" ? <div className='w-1/2 relative overflow-hidden group'>
                    <Field autoComplete="off" forwardRef={input} Element="input" className="!py-1 !border-theme-500 !text-gray-100 !bg-theme-700 peer pr-10" type={showPassword ? "text" : "password"} {...props} />
                    <input id={"show-" + id} name='show' checked={showPassword} onChange={e => setShowPassword(e.target.checked)} className='hidden' type="checkbox" />
                    <label htmlFor={"show-" + id} className={clsx('transition-transform absolute flex items-center mr-3 right-0 top-0 h-full peer-hover:translate-y-0 peer-focus:translate-y-0 hover:translate-y-0 cursor-pointer', showPassword ? "translate-y-0" : "-translate-y-full")}>
                        <EyeIcon className={clsx('stroke-theme-300 stroke-1 hover:stroke-theme-400', showPassword ? "hidden" : "")} width="22" />
                        <EyeSlashIcon className={clsx('stroke-1 stroke-theme-300 hover:stroke-theme-400', !showPassword ? "hidden" : "")} width="22" />
                    </label>
                </div> : <Field autoComplete="off" type={type} forwardRef={input} className="!w-1/2 !py-1 !border-theme-500 !text-gray-100 !bg-theme-700" defaultValue={value} {...props}>{children}</Field>
            }</span> : value ? <span className="flex-grow">{value}</span> : null}
            {canUpdate &&
                <span className="flex-shrink-0 flex gap-5">
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
                        onClick={() => edit ? handleSave(profile, formatProperty(input.current?.value), setUser, addAlert, setEdit, "La valeur a bien été modifiée.") : setEdit(!edit)}
                    >
                        {edit ? <CheckIcon className="w-4 mr-1" /> : value ? <PencilSquareIcon className="w-4 mr-1" /> : <PlusIcon className="w-4 mr-1" />}<span>{edit ? "Enregistrer" : value ? "Modifier" : "Nouveau"}</span>
                    </button>
                </span>
            }
        </dd>
    </form>);
}

async function handleSave(profile, data, setUser, addAlert, setEdit, message) {
    try {
        const user = await pacthUser(profile, data);
        setUser(user);
        addAlert({ type: "success", title: message, ephemeral: true });
        setEdit(false);
    } catch (error) {
        addAlert({ type: "error", title: error.message || "Une erreur est survenue.", ephemeral: true });
    }
}

async function handleDelete(id, addAlert, history, setStaff, setConfirmDelete, setUser) {
    try {
        await deleteUser(id);
        addAlert({ type: "success", title: "Le compte a bien été supprimé.", ephemeral: true });
        history.replace("/user/@me");
        setUser(null);
        setConfirmDelete(false);
        setStaff(a => a.filter(b => b._id !== id));
    } catch (error) {
        addAlert({ type: "error", title: error.message || "Une erreur est survenue.", ephemeral: true });
    }
}