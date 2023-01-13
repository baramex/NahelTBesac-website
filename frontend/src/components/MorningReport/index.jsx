import { useEffect, useState } from "react";
import { fetchData } from "../../lib/service";
import { Link, useHistory, useParams } from "react-router-dom";
import { ArrowLeftIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import Loading from "../Misc/Loading";
import Header from "../Layout/Header";
import Footer from "../Layout/Footer";
import { Table } from "../Misc/Tables";
import { Triangle } from "../Images/Icons";
import { fetchMorningReport } from "../../lib/service/morningReports";

export default function MorningReport(props) {
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
        if (!report && report !== 0) fetchData(() => setReport(0), setReport, fetchMorningReport, true, id);
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
                <h1 className="text-center text-4xl font-medium my-20">Rapport du Matin</h1>
                <Table
                    head={["Livreur", "Photo", "Date"]}
                    rows={[[report._id, <div className="items-center flex gap-2">{report.profile.name.firstname} {report.profile.name.lastname}<Link to={`/user/${report.profile._id}`}><Triangle className="w-3 stroke-gray-100" /></Link></div>, "Photo ci-dessous", new Date(report.date).toLocaleString("fr-FR", { timeStyle: "short", dateStyle: "short" })]]}
                />
                <h2 className="text-lg font-medium mt-10">
                    Photo
                </h2>
                <div className="mt-5">
                    <img className="w-full max-w-xl" src={`/api/morning-report/${id}/photo`} alt="Colis Chargés" />
                </div>
            </> : null}
        </div>
        <Footer />
    </>);
}