import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import { AlertContainer } from './components/Alerts';
import Home from './components/Home';
import Login from './components/Login';
import Rules from './components/Rules';
import Team from './components/Team';
import ToDoList from './components/ToDoList';
import { fetchData } from './lib/service';
import { isLogged } from './lib/service/authentification';
import { fetchUser } from './lib/service/profile';
import "./styles/main.css";
import "./styles/tailwind.css";

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
                if (user) setUser(null);
                if (suser) sessionStorage.removeItem('user');
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
                </Router>
            }
        </>
    );
}