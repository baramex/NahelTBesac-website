import { ArchiveBoxArrowDownIcon, ArchiveBoxIcon, BuildingOffice2Icon, UserGroupIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { fetchData } from "../../lib/service";
import { fetchImpreciseAddressReportsQuery } from "../../lib/service/impreciseAddressReport";
import { fetchRoles } from "../../lib/service/misc";
import { fetchMorningReportsQuery } from "../../lib/service/morningReports";
import { fetchUsers } from "../../lib/service/profile";
import { fetchReportsQuery } from "../../lib/service/report";
import Footer from "../Layout/Footer";
import Header from "../Layout/Header";
import { ImpreciseAddressReportsTable, MorningReportsTable, ReportsTable, StaffTable } from "../Misc/Tables";
import CreateAccountModal from "../Modals/CreateAccount";
import MorningReportModal from "../Modals/MorningReport";
import PacketsNotDeliveredModal from "../Modals/PacketsNotDelivered";

export default function Admin({ type, ...props }) {
    const history = useHistory();

    const [todayReports, setTodayReports] = useState(null);
    const [todayMorningReports, setTodayMorningReports] = useState(null);
    const [todayImpreciseAddressReports, setTodayImpreciseAddressReports] = useState(null);
    const [staff, setStaff] = useState(null);
    const [roles, setRoles] = useState(null);

    const [morningReport, setMorningReport] = useState(false);
    const [packetsNotDelivered, setPacketsNotDelivered] = useState(false);

    const [newAccount, setNewAccount] = useState(false);

    useEffect(() => {
        if (props.user) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (!todayReports && type === "e") fetchData(props.addAlert, setTodayReports, fetchReportsQuery, true, { startDate: today.toISOString() });
            if (!todayMorningReports && type === "m") fetchData(props.addAlert, setTodayMorningReports, fetchMorningReportsQuery, true, { startDate: today.toISOString() });
            if (!todayImpreciseAddressReports && type === "a") fetchData(props.addAlert, setTodayImpreciseAddressReports, fetchImpreciseAddressReportsQuery, true, { startDate: today.toISOString() });
            if (!staff && type === "p") fetchData(props.addAlert, setStaff, fetchUsers, true);
            if (!roles && type === "p") fetchData(props.addAlert, setRoles, fetchRoles);
        } else history.replace("/login?redirect=" + history.location.pathname);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [type]);

    if (!props.user) return null;

    const dprops = { daily: true, canCreate: false, showEmployee: true, reports: { m: todayMorningReports, e: todayReports, a: todayImpreciseAddressReports }[type] };

    const Icon = { m: ArchiveBoxArrowDownIcon, e: ArchiveBoxIcon, a: BuildingOffice2Icon, p: UserGroupIcon }[type];

    return (<>
        <CreateAccountModal roles={roles} addAlert={props.addAlert} onClose={e => {
            if (e) {
                setStaff(a => a.push(e) && a);
            }
            setNewAccount(false);
        }} open={newAccount} />
        <PacketsNotDeliveredModal open={!!packetsNotDelivered} onClose={setPacketsNotDelivered} report={packetsNotDelivered} />
        <MorningReportModal open={!!morningReport} onClose={setMorningReport} id={morningReport} />

        <Header {...props} />
        <div className="pt-[4.5rem] text-white pb-20 px-6 max-w-7xl mx-auto">
            <div className="mx-auto flex h-10 w-10 p-2 mt-14 mb-5 items-center justify-center rounded-full bg-theme-50">
                <Icon className="text-theme-600" aria-hidden="true" />
            </div>
            <h1 className="text-center text-3xl font-medium mb-14">{{ m: "Rapports du Matin de la journée", e: "Rapports du Soir de la journée", a: "Rapports d'Adresse Imprécise de la journée", p: "Personnel" }[type]}</h1>
            {{
                m: <MorningReportsTable setMorningReport={setMorningReport} {...dprops} />,
                e: <ReportsTable setPacketsNotDelivered={setPacketsNotDelivered} {...dprops} />,
                a: <ImpreciseAddressReportsTable {...dprops} />,
                p: <StaffTable reports={todayReports} staff={staff} setNewAccount={setNewAccount} userId={props.user._id} />
            }[type]}
        </div>
        <Footer />
    </>);
}