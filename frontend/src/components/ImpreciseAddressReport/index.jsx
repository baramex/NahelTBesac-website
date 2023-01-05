import { useEffect, useState } from "react";
import { fetchData } from "../../lib/service";
import { Link, useHistory, useParams } from "react-router-dom";
import { ArrowLeftIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import Loading from "../Misc/Loading";
import Header from "../Layout/Header";
import Footer from "../Layout/Footer";
import Table from "../Misc/Tables";
import { Triangle } from "../Images/Icons";
import { fetchImpreciseAddressReport } from "../../lib/service/impreciseAddressReport";

export default function ImpreciseAddressReport(props) {
    const { id } = useParams();
    const [report, setReport] = useState(null);
    const history = useHistory();

    useEffect(() => {
        if (!props.user) history.replace("/login?redirect=" + history.location.pathname);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (report && report._id !== id) setReport(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    useEffect(() => {
        if (!report && report !== 0) fetchData(() => setReport(0), setReport, fetchImpreciseAddressReport, true, id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [report]);

    if (!props.user) return null;

    return (<>
        <Header {...props} />
        <div className="pt-[4.5rem] text-white pb-20 px-6 max-w-7xl mx-auto">
            {!report ? report === 0 ? <p className="text-center mt-8 font-medium"><ExclamationTriangleIcon className="w-6 inline mr-2" />Rapport non trouvé</p> : <div className="mt-8 flex justify-center"><Loading /></div> : null}
            {report && report !== 0 ? <>
                <Link to="/user/@me" className="absolute mt-4 transition-colors flex items-center text-theme-50 hover:text-theme-100 hover:underline">
                    <ArrowLeftIcon className="w-5 mr-2" /> Retour à mon compte
                </Link>
                <h1 className="text-center text-4xl font-medium my-20">Rapport d'Adresse Imprécise</h1>
                <Table
                    head={["Livreur", "N° de Colis", "Commentaire", "Date"]}
                    rows={[[report._id, <div className="items-center flex gap-2">{report.profile.name.firstname} {report.profile.name.lastname}<Link to={`/user/${report.profile._id}`}><Triangle className="w-3 stroke-gray-100" /></Link></div>, report.packageNumber, report.note || "Aucun", new Date(report.date).toLocaleString("fr-FR", { timeStyle: "short", dateStyle: "short" })]]}
                />
            </> : null}
        </div>
        <Footer />
    </>);
}