const footerLinks = [
    {
        title: "Explore",
        links: ["Destinasi", "Peta Interaktif", "Living Heritage", "Penginapan"],
    },
    {
        title: "Plan",
        links: [
            "Trip Planner",
            "Rekomendasi",
            "Jarak & Rute",
            "Kalender Event",
        ],
    },
    {
        title: "About",
        links: ["Tentang Kami", "Kontak", "Kebijakan Privasi"],
    },
];

export default function Footer() {
    return (
        <footer className="border-t border-goro-card bg-goro-deep px-6 md:px-16 py-12">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start justify-between gap-10">
                <div className="max-w-xs">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-goro-gold flex items-center justify-center">
                            <span className="text-goro-dark font-bold text-xs font-mono">
                                GLH
                            </span>
                        </div>
                        <span className="font-display font-medium text-goro-cream text-sm">
                            Gorontalo Living Heritage
                        </span>
                    </div>
                    <p className="text-goro-cream/30 text-xs font-light leading-relaxed">
                        Platform digital interaktif untuk menjelajahi destinasi
                        wisata dan warisan budaya Gorontalo.
                    </p>
                </div>
                <div className="flex flex-wrap gap-12">
                    {footerLinks.map((col) => (
                        <div key={col.title}>
                            <p className="font-mono text-[0.6rem] tracking-widest text-goro-gold uppercase mb-4">
                                {col.title}
                            </p>
                            <ul className="space-y-2.5">
                                {col.links.map((link) => (
                                    <li key={link}>
                                        <a
                                            href="#"
                                            className="text-goro-cream/40 hover:text-goro-cream/70 text-xs font-light transition-colors"
                                        >
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
            <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-goro-card flex flex-col md:flex-row justify-between gap-2">
                <p className="text-goro-cream/20 text-xs font-mono">
                    © 2026 Gorontalo Living Heritage. All rights reserved.
                </p>
                <p className="text-goro-cream/20 text-xs font-mono">
                    Built with Laravel · React · Tailwind CSS
                </p>
            </div>
        </footer>
    );
}
