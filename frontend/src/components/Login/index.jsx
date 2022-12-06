import { UserCircleIcon } from "@heroicons/react/24/solid";
import Footer from "../Layout/Footer";
import Header from "../Layout/Header";
import { Button } from "../Misc/Buttons";
import { TextField } from "../Misc/Fields";

export default function Login(props) {
    return (<>
        <Header {...props} />
        <div className="pt-[4.5rem] bg-theme-700 text-white pb-12 px-6">
            <UserCircleIcon className="text-gray-100 mx-auto w-16 mt-11 mb-8" />
            <h1 className="text-center text-4xl font-medium mb-14">Espace Employé - Connexion</h1>
            <div className="px-6 max-w-xl mx-auto">
                <form className="flex flex-col gap-6">
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
                    <Button className="mx-auto w-1/3 mt-3">
                        Se connecter
                    </Button>
                </form>
            </div>
        </div>
        <Footer {...props} />
    </>)
}