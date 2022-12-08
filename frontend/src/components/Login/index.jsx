import { UserCircleIcon } from "@heroicons/react/24/solid";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { login } from "../../lib/service/authentification";
import Footer from "../Layout/Footer";
import Header from "../Layout/Header";
import { Button } from "../Misc/Buttons";
import { TextField } from "../Misc/Fields";

export default function Login(props) {
    const history = useHistory();

    useEffect(() => {
        if (props.user) history.push("/account");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (props.user) return null;

    return (<>
        <Header {...props} />
        <div className="pt-[4.5rem] bg-theme-700 text-white pb-12 px-6">
            <UserCircleIcon className="text-gray-100 mx-auto w-16 mt-11 mb-8" />
            <h1 className="text-center text-4xl font-medium mb-14">Espace Employé - Connexion</h1>
            <div className="px-6 max-w-xl mx-auto">
                <form onSubmit={e => handleLogin(e, props.addAlert, props.setUser, history)} className="flex flex-col gap-6">
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
                        autoComplete="password"
                        placeholder="•••••••••"
                        required />
                    <Button className="mx-auto w-full md:w-1/3 mt-3">
                        Se connecter
                    </Button>
                </form>
            </div>
        </div>
        <Footer {...props} />
    </>)
}

async function handleLogin(e, addAlert, setUser, history) {
    e.preventDefault();

    const elements = e.target.querySelectorAll("input, button");
    elements.forEach(el => el.disabled = true);

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
        const user = await login(email, password);
        setUser(user);

        history.push("/account");
    } catch (error) {
        addAlert({ type: "error", title: error.message || "Une erreur est survenue.", ephemeral: true });
        elements.forEach(el => el.disabled = false);
    }
}