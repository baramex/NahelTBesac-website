import { UserCircleIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { login } from "../../lib/service/authentification";
import Footer from "../Layout/Footer";
import Header from "../Layout/Header";
import { Button } from "../Misc/Buttons";
import { TextField } from "../Misc/Fields";
import AcceptModal from "../Modals/Accept";

export default function Login(props) {
    const history = useHistory();

    const _red = new URLSearchParams(window.location.search).get("redirect");
    const redirect = _red && !_red.includes("http") && _red.startsWith("/") ? _red : null;

    const [firstLog, setFirstLog] = useState(false);

    useEffect(() => {
        if (props.user) history.push(redirect || "/user/@me");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (props.user && !firstLog) return null;

    return (<>
        <Header {...props} />

        <AcceptModal addAlert={props.addAlert} onAccept={() => history.push(redirect || "/user/@me")} open={firstLog} toAccept={[{ name: "le règlement", href: "/rules" }, { name: "la To Do List", href: "/to-do-list" }]} />

        <div className="pt-[4.5rem] text-white pb-20 px-6">
            <UserCircleIcon className="text-gray-100 mx-auto w-16 mt-11 mb-8" />
            <h1 className="text-center text-4xl font-medium mb-14">Espace Employé - Connexion</h1>
            <div className="md:px-6 max-w-xl mx-auto">
                <form onSubmit={e => handleLogin(e, props.addAlert, props.setUser, setFirstLog, history, redirect)} className="flex flex-col gap-6">
                    <TextField
                        id="email"
                        label="Adresse Email"
                        type="email"
                        autoComplete="email"
                        placeholder="exemple@domaine.xyz"
                        required />
                    <TextField
                        id="password"
                        label="Mot de Passe"
                        type="password"
                        autoComplete="current-password"
                        placeholder="•••••••••"
                        required />
                    <Button className="mx-auto w-full py-3 md:py-2 md:w-1/3 mt-3">
                        Se connecter
                    </Button>
                </form>
            </div>
        </div>
        <Footer {...props} />
    </>)
}

async function handleLogin(e, addAlert, setUser, setFirstLog, history, redirect) {
    e.preventDefault();

    const elements = e.target.querySelectorAll("input, button");
    elements.forEach(el => el.disabled = true);

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
        let user = await login(email, password);
        if (user.firstlog) {
            setFirstLog(true);
            user = { ...user, firstlog: undefined };
            setUser(user);
        }
        else {
            user = { ...user, firstlog: undefined };
            setUser(user);
            history.push(redirect || "/user/@me");
        }
    } catch (error) {
        addAlert({ type: "error", title: error.message || "Une erreur est survenue.", ephemeral: true });
        elements.forEach(el => el.disabled = false);
    }
}