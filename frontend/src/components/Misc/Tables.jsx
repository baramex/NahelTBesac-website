import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import { useState } from "react";
import { Link } from "react-router-dom";
import { thousandsSeparator } from "../../lib/utils/numbers";
import { hasPermission, PERMISSIONS } from "../../lib/utils/permissions";
import { FuelGauge, Triangle } from "../Images/Icons";
import Loading from "./Loading";

export function Table({ className, onClick, name, description, addButton, head, rows, maxPerPage, links, disabled }) {
    const [page, setPage] = useState(1);
    const maxPage = Math.ceil(rows?.length / maxPerPage);

    return (<div className={className}>
        {(name || addButton) &&
            <div className={clsx("sm:flex sm:items-center", name ? "" : "justify-center")}>
                {name &&
                    <div className="sm:flex-auto">
                        <h1 className="text-xl font-semibold leading-6 text-white">{name}</h1>
                        {description &&
                            <p className="mt-1 text-sm text-gray-200">
                                {description}
                            </p>
                        }
                    </div>
                }
                {addButton &&
                    <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none flex gap-2 flex-col items-end">
                        <button
                            type="button"
                            className="transition-colors disabled:cursor-not-allowed disabled:border-theme-300 disabled:text-theme-200 disabled:bg-theme-600 flex items-center rounded-md border border-theme-50 px-3 py-1.5 text-sm font-medium text-theme-50 shadow-sm hover:border-theme-200 hover:text-theme-100 focus:outline-none sm:w-auto"
                            onClick={() => onClick(true)}
                            disabled={disabled}
                        >
                            <PlusIcon className="w-5 mr-1" /><span>{addButton}</span>
                        </button>
                        {disabled && <p className="text-xs text-theme-50">{disabled}</p>}
                    </div>
                }
            </div>
        }
        <div className="mt-8 flex flex-col">
            <div className="overflow-x-auto">
                <div className="inline-block min-w-full py-2 align-middle">
                    <table className="min-w-full divide-y divide-theme-50">
                        <thead>
                            <tr>
                                {head.map((a, i) =>
                                    <th key={i} scope="col" className={clsx(i === 0 ? "py-3.5 pr-3" : "px-3 py-3.5", "text-left text-sm font-semibold text-white")}>
                                        {a}
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-theme-500">
                            {rows?.length > 0 ? (maxPerPage ? rows.slice(maxPerPage * (page - 1), maxPerPage * page) : rows).map((row) => (
                                <tr key={row[0]}>
                                    {row.slice(1, row.length).map((a, i) =>
                                        <td key={i} className={clsx(i === 0 ? "py-4 pr-3 pl-2 font-medium text-white" : "px-3 py-4 text-gray-100", "text-sm whitespace-nowrap")}>
                                            {a}
                                        </td>
                                    )}
                                    {links && links.length > 0 ?
                                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                            {links.map((link, i) => link.href ? !link.href(row[0]) ? null : <Link className="text-white transition-colors hover:text-theme-100" key={i} to={link.href(row[0])}>{link.name}</Link> : <button className="text-white transition-colors hover:text-theme-100" key={i} onClick={() => link.onClick(row[0])}>{link.name}</button>)}
                                        </td> : null
                                    }
                                </tr>
                            )) : <tr><td colSpan={head.length} className="py-4 px-3 text-center text-gray-100 text-sm">{!rows ? <div className="flex justify-center"><Loading /></div> : "Aucune donnée."}</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
            {maxPerPage && rows?.length > 0 &&
                <div className="flex flex-1 items-center justify-between border-t border-theme-400 pt-3">
                    <div>
                        <p className="text-sm text-theme-50">
                            Résultats <span className="font-medium">{maxPerPage * (page - 1) + 1}</span> à <span className="font-medium">{Math.min(maxPerPage * page, rows?.length || 0)}</span> sur{' '}
                            <span className="font-medium">{rows?.length || 0}</span>
                        </p>
                    </div>
                    <div>
                        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                            <button
                                onClick={() => page > 1 && setPage(e => e - 1)}
                                className="focus:outline-none transition-colors relative inline-flex items-center rounded-l-md border border-theme-50 px-2 py-2 text-sm font-medium text-theme-50 hover:bg-theme-600"
                            >
                                <span className="sr-only">Précédent</span>
                                <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                            </button>
                            {(maxPage && maxPage > 0) ? Array(maxPage).fill(0).map((_, i) =>
                                <button key={i} onClick={() => setPage(i + 1)} aria-current={i === page - 1 ? "page" : undefined} className={clsx("focus:outline-none inline-flex items-center border px-4 py-2 text-sm font-medium relative border-theme-50", i === page - 1 ? "bg-theme-200 text-theme-800" : "text-theme-50 hover:bg-theme-600")}>
                                    {i + 1}
                                </button>
                            ) : null}
                            <button
                                onClick={() => page < maxPage && setPage(e => e + 1)}
                                className="focus:outline-none transition-colors relative inline-flex items-center rounded-r-md border border-theme-50 px-2 py-2 text-sm font-medium text-theme-50 hover:bg-theme-600"
                            >
                                <span className="sr-only">Suivant</span>
                                <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                            </button>
                        </nav>
                    </div>
                </div>
            }
        </div>
    </div >)
}

export function ImpreciseAddressReportsTable({ setCreateImpreciseAddressReport, ...props }) {
    return (
        <ReportTable
            name="Rapports d'Adresse Imprécise"
            head={["N° de Colis", "Commentaire", "Date"]}
            description="Tous les rapports d'adresse imprécise remplis depuis ce matin."
            createDescription="Vous pouvez remplir autant de rapport que vous voulez."
            generateFields={a => [a.packageNumber, a.note || "Aucun", new Date(a.date).toLocaleString("fr-FR", { timeStyle: "short", dateStyle: "short" })]}
            link="/imprecise-address-report/"
            setCreateReport={setCreateImpreciseAddressReport}
            {...props}
        />
    );
}

export function MorningReportsTable({ setCreateMorningReport, setMorningReport, ...props }) {
    return (
        <ReportTable
            name="Rapports du matin"
            head={["Photo", "Date"]}
            description="Tous les rapports du matin remplis depuis ce matin."
            createDescription="Vous ne pouvez remplir qu'un rapport par jour."
            generateFields={a => [<button onClick={() => setMorningReport(a._id)}>Voir photo <Triangle className="inline ml-1 w-3 stroke-gray-100" /></button>, new Date(a.date).toLocaleString("fr-FR", { timeStyle: "short", dateStyle: "short" })]}
            link="/morning-report/"
            setCreateReport={setCreateMorningReport}
            {...props}
        />
    );
}

export function ReportsTable({ setCreateReport, setPacketsNotDelivered, ...props }) {
    return (
        <ReportTable
            name="Rapports du soir"
            head={["Tournée", "N° de PDA", "Immatriculation", "Avis", "Colis Retours", "Kilométrage", "Essence", "Date"]}
            description="Tous les rapports du soir remplis depuis ce soir."
            createDescription="Vous ne pouvez remplir qu'un rapport par jour."
            generateFields={a => [a.round, a.PDANumber, a.licensePlate, <div className="flex items-center">{a.opinion} <StarIcon className="ml-1 w-5 text-yellow-400" /></div>, <div className="items-center gap-2 flex">{a.packetsNotDelivered.length}<button onClick={() => setPacketsNotDelivered(a)} ><Triangle className="w-3 stroke-gray-100" /></button></div>, thousandsSeparator(a.mileage) + " km", <FuelGauge className="text-gray-100 w-20" percentage={a.fuel} showPer={true} />, new Date(a.date).toLocaleString("fr-FR", { timeStyle: "short", dateStyle: "short" })]}
            link="/report/"
            setCreateReport={setCreateReport}
            {...props}
        />
    );
}

export function StaffTable({ setNewAccount, staff, userId, reports, showDescription = true, showName = true, ...props }) {
    return (<Table
        maxPerPage={10}
        name={showName && "Personnel"}
        addButton="Ajouter"
        onClick={() => setNewAccount(true)}
        head={["Nom/prénom", "Fonction", "Email", "Dernier Rapport du Soir"]}
        description={showDescription && "Ajouter, modifier et supprimer des comptes."}
        rows={staff && staff.map(a => [a._id, <>{a.name.lastname} {a.name.firstname} {a._id === userId && <span className="text-xs font-normal text-gray-200">(vous)</span>}</>, a.role.name, a.email, hasPermission(a, PERMISSIONS.CREATE_REPORT) ? reports && reports.find(b => b.profile._id === a._id) ? <div className="items-center gap-2 flex">{new Date(reports.find(b => b.profile._id === a._id)?.date).toLocaleString("fr-FR", { timeStyle: "short", dateStyle: "short" })}<Link to={`/report/${reports.find(b => b.profile._id === a._id)._id}`}><Triangle className="w-3 stroke-gray-100" /></Link></div> || "--" : "--" : "--"])}
        links={[{ name: "Gérer", href: id => id === userId ? null : "/user/" + id }]}
        {...props}
    />);
}

function ReportTable({ name, daily, createDescription, showDescription, showName, description, canCreate, showEmployee, reports, setCreateReport, generateFields, head, link, ...props }) {
    return (<Table
        maxPerPage={10}
        name={showName ? (name + (daily ? " du jour" : "")) : ""}
        head={(showEmployee ? ["Livreur"] : []).concat(head)}
        description={showDescription ? canCreate ? createDescription : description : ""}
        rows={reports && reports.map(a => (showEmployee ? [a._id, <div className="items-center flex gap-2">{a.profile.name.firstname} {a.profile.name.lastname}<Link to={`/user/${a.profile._id}`}><Triangle className="w-3 stroke-gray-100" /></Link></div>] : [a._id]).concat(generateFields(a)))}
        links={[{ name: "Voir", href: id => link + id }]}
        addButton={canCreate && "Nouveau"}
        onClick={canCreate ? setCreateReport : null}
        {...props}
    />);
}