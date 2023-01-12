import logo from "../../images/logo.webp";

import { Popover, Transition } from '@headlessui/react'
import { Link } from "react-router-dom";
import clsx from 'clsx';
import { Fragment } from "react";
import UserMenu, { UserMenuTab } from "../Misc/UserMenu";

function MobileNavLink({ href, children }) {
    return (
        <Popover.Button as={Link} to={href} className="transition-colors py-1 px-2 text-md text-theme-700 hover:text-theme-800">
            {children}
        </Popover.Button>
    )
}

function MobileNavIcon({ open }) {
    return (
        <svg
            aria-hidden="true"
            className="w-8 overflow-visible stroke-theme-50"
            fill="none"
            strokeWidth={2}
            strokeLinecap="round"
            viewBox="0 0 16 12"
        >
            <path
                d="M0 0H16M0 6H16M0 12H16"
                className={clsx(
                    'origin-center transition',
                    open ? 'scale-90 opacity-0' : "scale-100 opacity-1"
                )}
            />
            <path
                d="M2 0 14 12M14 0 2 12"
                className={clsx(
                    'origin-center transition',
                    !open ? 'scale-90 opacity-0' : "scale-100 opacity-1 "
                )}
            />
        </svg>
    )
}

function MobileNavigation({ user, ...props }) {
    return (
        <Popover>
            <Popover.Button
                className="relative z-20 flex items-center justify-center focus:outline-none"
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
                    <Popover.Overlay className="z-10 fixed inset-0 bg-gray-300/50" />
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
                        as="nav"
                        className="z-20 absolute w-3/4 right-0 top-full mt-4 flex origin-top flex-col rounded-2xl bg-theme-50 p-4 text-gray-900 shadow-xl"
                    >
                        <MobileNavLink href="/">Accueil</MobileNavLink>
                        <MobileNavLink href="/to-do-list">To Do List</MobileNavLink>
                        <MobileNavLink href="/rules">Règlement</MobileNavLink>
                        <MobileNavLink href="/team">L'équipe</MobileNavLink>
                        <hr className="m-2 border-gray-400/50" />
                        {!user && <MobileNavLink href="/login">Se connecter</MobileNavLink>}
                        {user && <UserMenuTab user={user} {...props} />}
                        <p className="text-gray-400 font-light text-xs text-center mt-2"><a className="mr-5" href="/mentions légales.pdf" download>Mentions Légales</a><a href="/rgpd.pdf" download>RGPD</a></p>
                    </Popover.Panel>
                </Transition.Child>
            </Transition.Root>
        </Popover>
    )
}

export default function Header({ user, setUser, addAlert }) {
    return (<>
        <header className="z-10 py-3 px-5 top-0 fixed w-full bg-[#393d32]">
            <div className="z-10 relative flex items-center min-h-[3.25rem] md:min-h-[3rem]">
                <Link className="absolute left-0" to="/">
                    <img
                        src={logo}
                        alt="Nahel Transport"
                        className="h-14 md:h-12 rounded-full" />
                </Link>
                <nav className="w-full flex justify-end md:justify-center">
                    <div className="flex items-center md:gap-x-6 hidden md:block">
                        <NavLink href="/">Accueil</NavLink>
                        <NavLink href="/to-do-list">To Do List</NavLink>
                        <NavLink href="/rules">Règlement</NavLink>
                        <NavLink href="/team">L'équipe</NavLink>
                    </div>
                    <div className="hidden md:flex absolute right-0 top-0 h-full items-center gap-x-5 md:gap-x-8">
                        {
                            user ?
                                <UserMenu user={user} setUser={setUser} addAlert={addAlert} />
                                :
                                <NavLink href="/login">Se connecter</NavLink>
                        }
                    </div>
                </nav>
                <div className="md:hidden mr-1">
                    <MobileNavigation user={user} setUser={setUser} addAlert={addAlert} />
                </div>
            </div>
        </header>
    </>);
}

function NavLink({ href, children }) {
    return (
        <Link to={href} className={clsx("transition-colors py-1 px-2 text-sm hover:text-red-200", window.location.pathname === href ? "text-red-200" : "text-white")}>
            {children}
        </Link>
    )
}