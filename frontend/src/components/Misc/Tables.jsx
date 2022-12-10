import { PlusIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import Loading from "./Loading";

export default function Table({ className, name, description, addButton, head, rows }) {
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
                    <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                        <button
                            type="button"
                            className="transition-colors flex items-center rounded-md border border-theme-50 px-3 py-1.5 text-sm font-medium text-theme-50 shadow-sm hover:border-theme-200 hover:text-theme-100 focus:outline-none sm:w-auto"
                        >
                            <PlusIcon className="w-5 mr-1" /><span>{addButton}</span>
                        </button>
                    </div>
                }
            </div>
        }
        <div className="mt-8 flex flex-col">
            <div className="overflow-x-auto">
                <div className="inline-block min-w-full py-2 align-middle">
                    <table className="min-w-full divide-y divide-gray-300">
                        <thead>
                            <tr>
                                {head.map((a, i) =>
                                    <th key={i} scope="col" className={clsx(i === 0 ? "py-3.5 pr-3" : "px-3 py-3.5", "text-left text-sm font-semibold text-white")}>
                                        {a}
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {rows?.length > 0 ? rows.map((row) => (
                                <tr key={row[0]}>
                                    {row.map((a, i) =>
                                        <td key={i} className={clsx(i === 0 ? "py-4 pr-3 font-medium text-white" : "px-3 py-4 text-gray-100", "text-sm whitespace-nowrap")}>
                                            {a}
                                        </td>
                                    )}
                                </tr>
                            )) : <tr><td colSpan={head.length} className="py-4 px-3 text-center text-gray-100 text-sm">{!rows ? <div className="flex justify-center"><Loading /></div> : "Aucune donnée."}</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>)
}