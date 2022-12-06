import { Check } from "../Icons";
import Footer from "../Layout/Footer";
import Header from "../Layout/Header";

export default function ToDoList(props) {
    return (<>
        <Header {...props} />
        <div className="pt-[4.5rem] bg-theme-700 text-white pb-12 px-6">
            <Check className="text-gray-100 mx-auto w-14 mt-12 mb-8" />
            <h1 className="text-center text-4xl font-medium mb-10">Les Choses à Faire le Matin et le Soir</h1>
            <div className="px-6 flex lg:items-stretch lg:justify-center gap-x-24 gap-y-10 flex-col lg:flex-row">
                <div>
                    <h2 className="text-lg font-medium mb-4">Matin</h2>
                    <ul className="list-disc ml-5 [&>*]:my-1">
                        <li>Dispatch des Retours</li>
                        <li>Reprendre ses Instances</li>
                        <li>Dispatch des Backs ( Aucune Pause tant que les Camions ne sont pas chargés. )</li>
                        <li>Ranger son Bac à Sa place</li>
                        <li>Faire les Cartons ( Selon le Planning )</li>
                        <li>Prendre en photo son nombre de colis sur le PDA</li>
                        <li>Mise à Jour / Optimisation</li>
                        <li>Numéroter les Colis</li>
                        <li>Charger Sac / Camions</li>
                        <li>Départ</li>
                    </ul>
                </div>
                <div>
                    <h2 className="text-lg font-medium mb-4">Soir</h2>
                    <ul className="list-disc ml-5 [&>*]:my-1">
                        <li>S'assurer que chaque colis est statué , 100% sur le PDA</li>
                        <li>Remplir Formulaire du Soir avec ses Retours / Demande Essence</li>
                    </ul>
                </div>
            </div>
        </div>
        <Footer />
    </>);
}