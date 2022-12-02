import logo from "../../images/logo.webp";

import { Popover, Transition } from '@headlessui/react'
import { Link } from "react-router-dom";
import clsx from 'clsx';
import { Fragment } from "react";
import UserMenu from "../User/UserMenu";

function MobileNavLink({ href, children }) {
    return (
        <Popover.Button as={Link} to={href} className="transition-colors py-1 px-2 text-sm text-white hover:text-red-200">
            {children}
        </Popover.Button>
    )
}

function MobileNavIcon({ open }) {
    return (
        <svg
            aria-hidden="true"
            className="h-3.5 w-3.5 overflow-visible stroke-gray-700"
            fill="none"
            strokeWidth={2}
            strokeLinecap="round"
        >
            <path
                d="M0 1H14M0 7H14M0 13H14"
                className={clsx(
                    'origin-center transition',
                    open && 'scale-90 opacity-0'
                )}
            />
            <path
                d="M2 2L12 12M12 2L2 12"
                className={clsx(
                    'origin-center transition',
                    !open && 'scale-90 opacity-0'
                )}
            />
        </svg>
    )
}

function MobileNavigation() {
    return (
        <Popover>
            <Popover.Button
                className="relative z-10 flex h-8 w-8 items-center justify-center [&:not(:focus-visible)]:focus:outline-none"
                aria-label="Toggle Navigation"
            >
                {({ open }) => <MobileNavIcon open={open} />}
            </Popover.Button>
            <Transition.Root>
                <Transition.Child
                    as={Fragment}
                    enter="duration-150 ease-out"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="duration-150 ease-in"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <Popover.Overlay className="fixed inset-0 bg-gray-300/50" />
                </Transition.Child>
                <Transition.Child
                    as={Fragment}
                    enter="duration-150 ease-out"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="duration-100 ease-in"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                >
                    <Popover.Panel
                        as="div"
                        className="absolute inset-x-0 top-full mt-4 flex origin-top flex-col rounded-2xl bg-white p-4 text-lg tracking-tight text-gray-900 shadow-xl ring-1 ring-gray-900/5"
                    >
                        <MobileNavLink href="/">Accueil</MobileNavLink>
                        <MobileNavLink href="/to-do-list">To Do List</MobileNavLink>
                        <MobileNavLink href="/rules">Règlement</MobileNavLink>
                        <MobileNavLink href="/team">L'équipe</MobileNavLink>
                        <hr className="m-2 border-gray-300/40" />
                        <MobileNavLink href="/login">Se connecter</MobileNavLink>
                    </Popover.Panel>
                </Transition.Child>
            </Transition.Root>
        </Popover>
    )
}

export default function Header({ user, setUser, addAlert }) {
    return (
        <header className="py-3 px-5">
            <div className="relative flex items-center min-h-[3rem]">
                <Link className="absolute left-0" to="/">
                    <img
                        src={logo}
                        alt="Nahel Transport"
                        className="h-12 rounded-full" />
                </Link>
                <nav className="w-full flex justify-center">
                    <div className="flex items-center md:gap-x-6">
                        <NavLink href="/">Accueil</NavLink>
                        <NavLink href="/to-do-list">To Do List</NavLink>
                        <NavLink href="/rules">Règlement</NavLink>
                        <NavLink href="/team">L'équipe</NavLink>
                    </div>
                    <div className="absolute right-0 flex items-center gap-x-5 md:gap-x-8">
                        {
                            user ?
                                <UserMenu user={user} setUser={setUser} addAlert={addAlert} />
                                :
                                <div className="hidden md:block">
                                    <NavLink href="/login">Se connecter</NavLink>
                                </div>
                        }
                        <div className="-mr-1 md:hidden">
                            <MobileNavigation />
                        </div>
                    </div>
                </nav>
            </div>
        </header>
    );
}

function NavLink({ href, children }) {
    return (
        <Link to={href} className={clsx("transition-colors py-1 px-2 text-sm hover:text-red-200", window.location.pathname === href ? "text-red-200" : "text-white")}>
            {children}
        </Link>
    )
}