import Footer from "../Layout/Footer";
import Header from "../Layout/Header";
import Carousel from "../Misc/Carousel";

import wheel from "../../images/carousel/wheel.jpg";
import trucks from "../../images/carousel/trucks.jpg";
import packet_scan from "../../images/carousel/packet_scan.jpg";
import trucks1 from "../../images/carousel/trucks1.jpeg";
import delivering from "../../images/carousel/delivering.jpg";
import delivering1 from "../../images/carousel/delivering1.jpg";
import packets from "../../images/carousel/packets.jpg";
import store from "../../images/carousel/store.jpg";
import logo from "../../images/logo.webp";

const images = [{ src: wheel, alt: "wheel" }, { src: trucks, alt: "trucks" }, { src: packet_scan, alt: "packet_scan" }, { src: trucks1, alt: "trucks1" }, { src: delivering, alt: "delivering" }, { src: delivering1, alt: "delivering1" }, { src: packets, alt: "packets" }, { src: store, alt: "store" }];

export default function Home(props) {
    return (<>
        <Header {...props} />
        <div className="flex flex-col items-center w-full bg-[url('../images/background.gif')] pb-12 bg-cover bg-fixed bg-no-repeat pt-[4.5rem]">
            <div className="w-full md:w-3/5 max-w-5xl bg-theme-700 text-center text-white pt-16 pb-8 px-4">
                <img className="mx-auto mb-8 rounded-3xl" src={logo} alt="Nahel Transport" />
                <h1 className="text-6xl italic mb-4 font-[serif]">Nahel Transport</h1>
                <p className="text-lg">Un service d'exception</p>
            </div>
            <Carousel>
                {images.map(image => <img key={image.alt} className="w-screen md:w-auto md:h-[565px]" src={image.src} alt={image.alt} />)}
            </Carousel>
        </div>
        <Footer {...props} />
    </>)
}