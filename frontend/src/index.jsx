import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Route, BrowserRouter as Router, useHistory } from 'react-router-dom';
import Account from './components/Account';
import { AlertContainer } from './components/Misc/Alerts';
import Home from './components/Home';
import Login from './components/Login';
import Rules from './components/Rules';
import Team from './components/Team';
import ToDoList from './components/ToDoList';
import { fetchData } from './lib/service';
import { canRefresh, isLogged, refreshToken } from './lib/service/authentification';
import { fetchUser } from './lib/service/profile';
import "./styles/main.css";
import "./styles/tailwind.css";
import Report from './components/Report';
import MorningReport from './components/MorningReport';
import ImpreciseAddressReport from './components/ImpreciseAddressReport';
import Admin from './components/Admin';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <App />
);

function App() {
    const [user, setUser] = useState(null);
    const [data, setData] = useState({});
    const [alerts, setAlerts] = useState([]);

    function addAlert(alert) {
        setAlerts(a => [...a, { id: Date.now() + Math.round(Math.random() * 1000), ...alert }]);
    }

    useEffect(() => {
        (async () => {
            const suser = JSON.parse(sessionStorage.getItem('user'));
            const lastupdate = sessionStorage.getItem('lastupdate') || 0;
            if (isLogged()) {
                if (!user) {
                    if (suser && Date.now() - lastupdate < 1000 * 20) {
                        setUser(suser);
                        return;
                    }
                    else {
                        const tuser = await fetchData(addAlert, setUser, fetchUser);
                        if (tuser) sessionStorage.setItem("lastupdate", Date.now());
                        return;
                    }
                }

                sessionStorage.setItem('user', JSON.stringify(user));
            } else {
                try {
                    if (!canRefresh()) throw new Error();
                    const tuser = await refreshToken();
                    if (!tuser) throw new Error();
                    setUser(tuser);
                    sessionStorage.setItem("lastupdate", Date.now());
                    return;
                } catch (error) {
                    if (user) setUser(null);
                    if (suser) sessionStorage.removeItem('user');
                }
            }
        })();
    }, [user]);

    const props = { user, setUser, data, setData, addAlert };

    return (
        <>
            <AlertContainer alerts={alerts} setAlerts={setAlerts} />
            {
                (isLogged() ? user : true) &&
                <Router>
                    <Route exact path="/"><Home {...props} /></Route>
                    <Route exact path="/to-do-list"><ToDoList {...props} /></Route>
                    <Route exact path="/rules"><Rules {...props} /></Route>
                    <Route exact path="/team"><Team {...props} /></Route>
                    <Route exact path="/login"><Login {...props} /></Route>

                    <Route exact path="/user"><Redirect to={"/user/@me"} /></Route>
                    <Route exact path="/user/:id"><Account {...props} /></Route>

                    <Route exact path="/report/:id"><Report {...props} /></Route>
                    <Route exact path="/morning-report/:id"><MorningReport {...props} /></Route>
                    <Route exact path="/imprecise-address-report/:id"><ImpreciseAddressReport {...props} /></Route>

                    <Route exact path="/admin/reports/m"><Admin type="m" {...props} /></Route>
                    <Route exact path="/admin/reports/a"><Admin type="a" {...props} /></Route>
                    <Route exact path="/admin/reports/e"><Admin type="e" {...props} /></Route>
                    <Route exact path="/admin/staff"><Admin type="p" {...props} /></Route>
                </Router>
            }
        </>
    );
}

function Redirect({ to }) {
    const history = useHistory();

    useEffect(() => {
        history.replace(to);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
}