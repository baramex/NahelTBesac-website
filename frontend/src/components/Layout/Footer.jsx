export default function Footer() {
    return (<div className="absolute bottom-0 w-full flex items-center gap-3 flex-col text-sm text-white pt-4 pb-3 bg-[#393d32]">
        <p className="text-white/70 hidden md:block md:absolute md:right-3 text-xs"><a className="mr-5" href="/mentions légales.pdf" download>Mentions Légales</a><a href="/rgpd.pdf" download>RGPD</a></p>
        <p className="text-gray-200">© 2023 NahelTBesac, Tous droits réservés.</p>
    </div>);
}