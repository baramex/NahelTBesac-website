import Footer from "../Layout/Footer";
import Header from "../Layout/Header";
import { TextField } from "../Misc/Fields";

export default function Login(props) {
    return (<>
        <Header {...props} />
        <div className="pt-[4.5rem] bg-[#58536a] text-white pb-12 px-6">
            <h1 className="text-center text-4xl font-medium my-20">Espace Employé - Connexion</h1>
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
                </form>
            </div>
        </div>
        <Footer {...props} />
    </>)
}