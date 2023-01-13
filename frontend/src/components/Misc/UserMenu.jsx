import { Menu, Transition } from "@headlessui/react";
import { ArchiveBoxArrowDownIcon, ArchiveBoxIcon, ArrowLeftOnRectangleIcon, BuildingOffice2Icon, UserGroupIcon, UserIcon } from "@heroicons/react/24/outline";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import { Fragment } from "react";
import { Link, useHistory } from "react-router-dom";
import { logout } from "../../lib/service/authentification";
import { hasPermission, PERMISSIONS } from "../../lib/utils/permissions";

const userNavigation = [
    [{ Icon: UserIcon, name: 'Mon compte', href: '/user/@me' }],
    [
        { Icon: ArchiveBoxArrowDownIcon, show: (user) => hasPermission(user, PERMISSIONS.CREATE_REPORT), name: 'Rapport du Matin', href: '/user/@me?newMorningReport' },
        { Icon: BuildingOffice2Icon, show: (user) => hasPermission(user, PERMISSIONS.CREATE_REPORT), name: 'Adresse Imprécise', href: '/user/@me?newImpreciseAddressReport' },
        { Icon: ArchiveBoxIcon, show: (user) => hasPermission(user, PERMISSIONS.CREATE_REPORT), name: 'Rapport du Soir', href: '/user/@me?newReport' },

        { Icon: ArchiveBoxArrowDownIcon, show: (user) => hasPermission(user, PERMISSIONS.VIEW_REPORTS), name: 'Rapports du Matin', href: '/admin/reports/m' },
        { Icon: BuildingOffice2Icon, show: (user) => hasPermission(user, PERMISSIONS.VIEW_REPORTS), name: 'Adresses Imprécises', href: '/admin/reports/a' },
        { Icon: ArchiveBoxIcon, show: (user) => hasPermission(user, PERMISSIONS.VIEW_REPORTS), name: 'Rapports du Soir', href: '/admin/reports/e' },
        { Icon: UserGroupIcon, show: (user) => hasPermission(user, PERMISSIONS.VIEW_PROFILES), name: 'Personnel', href: '/admin/staff' }
    ],
    [{ Icon: ArrowLeftOnRectangleIcon, name: 'Se déconnecter', onClick: handleLogout, color: "text-red-600", iconColor: "text-red-600", colorHover: "hover:text-red-700", iconColorHover: "group-hover:text-red-700" }],
];

export default function UserMenu({ user, setUser, addAlert }) {
    return (<Menu as="div" className="relative">
        <div>
            <Menu.Button className="flex max-w-xs items-center rounded-full text-sm focus:outline-none">
                <span className="sr-only">Ouvrir le menu utilisateur</span>
                <UserCircleIcon className="fill-gray-100 h-12 object-cover aspect-square rounded-full" />
            </Menu.Button>
        </div>
        <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
        >
            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                {UserMenuTab({ user, setUser, addAlert, Element: Menu.Item, navigate: userNavigation })}
            </Menu.Items>
        </Transition>
    </Menu>);
}

export function UserMenuTab({ user, setUser, addAlert, Element = "div", navigate = userNavigation }) {
    const history = useHistory();

    return (<>
        <div className={clsx(Element === "div" ? "px-3 py-2" : "p-3")}>
            <p className={clsx("truncate font-medium text-theme-900", Element === "div" ? "text-md" : "text-sm")}>{user.name.firstname} {user.name.lastname}</p>
            <p className={clsx("text-theme-700/75", Element === "div" ? "text-md" : "text-sm")}>{user.role.name}</p>
        </div>
        {navigate.map((items, i) => (
            <div className='py-1' key={i}>
                {items.map(item => (
                    (item.show ? item.show(user) : true) ?
                        <Element key={item.name}>
                            {Element === "div" ?
                                item.href ?
                                    <Link
                                        to={item.href}
                                        className={clsx(
                                            'group flex items-center px-3 py-1 text-md', item.color || 'text-theme-700', item.colorHover || "hover:text-theme-800",
                                            item.className
                                        )}
                                    >
                                        {<item.Icon className={clsx("mr-3 h-5 w-5", item.iconColor || "text-theme-700", item.iconColorHover || "group-hover:text-theme-800")} aria-hidden="true" />}
                                        {item.name}
                                    </Link> :
                                    <button
                                        onClick={e => item.onClick(e, setUser, addAlert, history)}
                                        className={clsx(
                                            'group flex items-center px-3 py-1 text-md w-full focus:outline-none', item.color || 'text-theme-700', item.colorHover || "hover:text-theme-800",
                                            item.className
                                        )}
                                    >
                                        {item.name}
                                    </button>
                                : (({ active }) => (
                                    item.href ?
                                        <Link
                                            to={item.href}
                                            className={clsx(
                                                active ? 'bg-gray-100' : item.color || 'text-gray-700',
                                                active ? item.colorHover || "text-gray-800" : "",
                                                'group flex items-center px-4 py-2 text-sm',
                                                item.className
                                            )}
                                        >
                                            {<item.Icon className={clsx("mr-3 h-5 w-5", item.iconColor || "text-gray-600", item.iconColorHover || "group-hover:text-gray-700")} aria-hidden="true" />}
                                            {item.name}
                                        </Link> :
                                        <button
                                            onClick={e => item.onClick(e, setUser, addAlert, history)}
                                            className={clsx(
                                                active ? 'bg-gray-100' : item.color || 'text-gray-700',
                                                active ? item.colorHover || "text-gray-800" : "",
                                                'group flex items-center px-4 py-2 text-sm w-full focus:outline-none',
                                                item.className
                                            )}
                                        >
                                            {<item.Icon className={clsx("mr-3 h-5 w-5", item.iconColor || "text-gray-600", item.iconColorHover || "group-hover:text-gray-700")} aria-hidden="true" />}
                                            {item.name}
                                        </button>
                                ))
                            }
                        </Element> : null
                ))}
            </div>
        ))}
    </>);
}

async function handleLogout(e, setUser, addAlert, history) {
    try {
        await logout();
        setUser(null);
        addAlert({ type: "success", title: "Déconnecté.", ephemeral: true });
        if (document.location.pathname.startsWith("/user") || document.location.pathname.startsWith("/report") || document.location.pathname.startsWith("/admin")) history.push("/");
    } catch (error) {
        addAlert({ type: "error", title: "Erreur lors de la déconnexion: " + (error.message || "Une erreur est survenue."), ephemeral: true });
    }
}