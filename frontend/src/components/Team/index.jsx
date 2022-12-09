import Footer from "../Layout/Footer";
import Header from "../Layout/Header";

import Amine from "../../images/avatars/Amine.webp";
import Ayoub from "../../images/avatars/Ayoub.webp";
import M_G from "../../images/avatars/M_G.webp";

export default function Team(props) {
    return (<>
        <Header {...props} />
        <div className="pt-[4.5rem] text-white pb-12 px-6">
            <h1 className="text-center text-4xl font-medium my-20">Notre équipe</h1>
            <div className="px-6 mx-auto flex-wrap flex gap-12 justify-around max-w-5xl">
                <Member avatar={Amine} name="Amine" role="Livreur" />
                <Member avatar={Ayoub} name="Ayoub" role="Responsable du Dépôt" />
                <Member avatar={M_G} name="M.G" role="Livreur" />
            </div>
        </div>
        <Footer />
    </>);
}

function Member({ avatar, name, role }) {
    return (<div className="text-center">
        <img
            src={avatar}
            className="rounded-full w-44 lg:w-52 mb-6"
            alt={name} />
        <p className="font-medium text-lg mb-3">{name}</p>
        <p className="text-lg">{role}</p>
    </div>);
}