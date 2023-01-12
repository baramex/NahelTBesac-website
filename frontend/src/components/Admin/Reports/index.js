import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import Footer from "../../Layout/Footer";
import Header from "../../Layout/Header";

export default function Reports({ type, ...props }) {
    const history = useHistory();

    useEffect(() => {
        if (!props.user) history.replace("/login?redirect=" + history.location.pathname);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!props.user) return null;

    return (<>
        <Header {...props} />
        <Footer />
    </>);
}