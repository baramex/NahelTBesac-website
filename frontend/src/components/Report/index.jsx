import { useEffect, useState } from "react";
import { fetchData } from "../../lib/service";
import { fetchReport } from "../../lib/service/report";
import { Link, useParams } from "react-router-dom";
import { ArrowLeftIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import Loading from "../Misc/Loading";
import Header from "../Layout/Header";
import Footer from "../Layout/Footer";
import Table from "../Misc/Tables";
import { FuelGauge, Triangle } from "../Images/Icons";
import { thousandsSeparator } from "../../lib/utils/numbers";
import { StarIcon } from "@heroicons/react/24/solid";
import { Label } from "../Misc/Fields";
import { REASONS } from "../../lib/utils/reports";

export default function Report(props) {
    const { id } = useParams();
    const [report, setReport] = useState(null);

    useEffect(() => {
        if (report && report._id !== id) setReport(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    useEffect(() => {
        if (!report && report !== 0) fetchData(() => setReport(0), setReport, fetchReport, true, id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [report]);

    return (<>
        <Header {...props} />
        <div className="pt-[4.5rem] text-white pb-12 px-6 max-w-7xl mx-auto pb-16">
            {!report ? report === 0 ? <p className="text-center mt-8 font-medium"><ExclamationTriangleIcon className="w-6 inline mr-2" />Rapport non trouvé</p> : <div className="mt-8 flex justify-center"><Loading /></div> : null}
            {report && report !== 0 ? <>
                <Link to="/user/@me" className="absolute mt-4 transition-colors flex items-center text-theme-50 hover:text-theme-100 hover:underline">
                    <ArrowLeftIcon className="w-5 mr-2" /> Retour à mon compte
                </Link>
                <h1 className="text-center text-4xl font-medium my-20">Rapport</h1>
                <Table
                    head={["Livreur", "Tournée", "Avis", "Colis Retours", "Kilométrage", "Essence", "Date"]}
                    rows={[[report._id, <div className="items-center flex gap-2">{report.profile.name.firstname} {report.profile.name.lastname}<Link to={`/user/${report.profile._id}`}><Triangle className="w-3 stroke-gray-100" /></Link></div>, report.round, <div className="flex items-center">{report.opinion} <StarIcon className="ml-1 w-5 text-yellow-400" /></div>, report.packetsNotDelivered.length, thousandsSeparator(report.mileage) + " km", <FuelGauge className="text-gray-100 w-20" percentage={report.fuel} showPer={true} />, new Date(report.date).toLocaleString("fr-FR", { timeStyle: "short", dateStyle: "short" })]]}
                />
                <h2 className="text-lg font-medium mt-10">
                    Colis Retours ({report.packetsNotDelivered.length})
                </h2>
                <div className="mt-5 flex flex-col-2">
                    {
                        report.packetsNotDelivered?.length > 0
                            ? report.packetsNotDelivered.map((a, index) => <PacketNotDelivered key={index} index={index} id={report._id} packetNotDelivered={a} />)
                            : <p className="text-theme-100">Aucun colis retours.</p>
                    }
                </div>
            </> : null}
        </div>
        <Footer />
    </>);
}

function PacketNotDelivered({ index, id, packetNotDelivered }) {
    return (<div className="flex gap-5 border border-theme-500 rounded-md bg-theme-600 p-3 relative">
        <div className="flex flex-col gap-5 w-2/5">
            <div>
                <Label>Numéro (id)</Label>
                <p className="text-theme-50 text-sm">{index} ({packetNotDelivered._id})</p>
            </div>
            <div>
                <Label>Raison</Label>
                <p className="text-theme-50 text-sm">{REASONS[packetNotDelivered.reason]}</p>
            </div>
            <div>
                <Label>Commentaire</Label>
                <p className="text-theme-50 text-sm break-words">{packetNotDelivered.comment || "Aucun commentaire."}</p>
            </div>
        </div>
        <div className="row-span-2 flex-1">
            <Label showRequired={true}>Photo</Label>
            <img className="max-w-full max-h-80 object-cover" src={`/api/report/${id}/packetNotDelivered/${packetNotDelivered._id}/photo`} alt="paquet non livré" />
        </div>
    </div>);
}