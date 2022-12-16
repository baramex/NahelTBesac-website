import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useState } from "react";
import { Link } from "react-router-dom";
import Loading from "./Loading";

export default function Table({ className, onClick, name, description, addButton, head, rows, maxPerPage, links, disabled }) {
    const [page, setPage] = useState(1);
    const maxPage = Math.ceil(rows?.length / maxPerPage);

    return (<div className={className}>
        {(name || addButton) &&
            <div className="sm:flex sm:items-center">
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
                            onClick={onClick}
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
                                            {links.map((link, i) => !link.href(row[0]) ? null : <Link className="text-white transition-colors hover:text-theme-100" key={i} to={link.href(row[0])}>{link.name}</Link>)}
                                        </td> : null
                                    }
                                </tr>
                            )) : <tr><td colSpan={head.length} className="py-4 px-3 text-center text-gray-100 text-sm">{!rows ? <div className="flex justify-center"><Loading /></div> : "Aucune donnée."}</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
            {maxPerPage && rows?.length > 0 &&
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between border-t border-theme-400 pt-3">
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