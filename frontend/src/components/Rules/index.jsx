import { Check } from "../Images/Icons";
import Footer from "../Layout/Footer";
import Header from "../Layout/Header";

export default function Rules(props) {
    return (<>
        <Header {...props} />
        <div className="pt-[4.5rem] text-white pb-20 px-6">
            <Check className="text-gray-100 mx-auto w-14 mt-12 mb-8" />
            <h1 className="text-center text-4xl font-medium mb-10">Règlement Nahel Transport</h1>
            <div className="px-6 flex justify-center">
                <div className="max-w-5xl">
                    <p className="text-lg">Le règlement suivant constitue un contrat légal entre les Livreurs et Nahel Transport définissant les règles et le comportement acceptable à adopter au dépôt et en livraison.</p><br /><br />
                    <p>Bien évidemment pas besoin de détailler ce qu'est un comportement acceptable.</p><br /><br />
                    <p>Soyez Polis , Souriant et Courtois et tout devrait bien se passer.</p><br /><br />
                    <p>A côté de ça vous devez savoir que certaines primes sont accordées en fonction de ce que vous faites.<br />
                        Votre contrat ne spécifie pas une tournée en particulier , n'importe laquelle peut vous être attribuée.</p><br /><br />
                    <div>
                        <h2 className="text-lg font-medium mb-4">Vous pouvez facilement gagner votre prime en :</h2>
                        <ul className="list-disc ml-5 [&>*]:my-1">
                            <li>Etant à L'heure au dépôt : 8h</li>
                            <li>Envoyer les photos de vos colis le matin</li>
                            <li>Remplir le formulaire le soir</li>
                            <li>Avoir un Camion Propre</li>
                            <li>Conduire prudemment et éviter les accidents</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <Footer />
    </>);
}