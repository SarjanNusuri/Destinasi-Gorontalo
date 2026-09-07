import { useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
    { label: "Explore", href: "#explore" },
    { label: "Heritage", href: "#heritage" },
    { label: "Map", href: "#map" },
    { label: "Trip Planner", href: "#trip" },
];

export default function LandingNavbar() {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-5 bg-gradient-to-b from-goro-dark/90 to-transparent backdrop-blur-sm">
                <a href="#" className="flex items-center gap-3 group">
                    <div className="w-8 h-8 rounded-full bg-goro-gold flex items-center justify-center transition-transform group-hover:scale-110">
                        <span className="text-goro-dark font-bold text-xs font-mono">
                            GLH
                        </span>
                    </div>
                    <span className="font-display font-medium text-goro-cream text-sm tracking-wide">
                        Gorontalo Living Heritage
                    </span>
                </a>

                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="text-xs font-mono tracking-widest uppercase text-goro-cream/60 hover:text-goro-gold transition-colors"
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                <a
                    href="#explore"
                    className="hidden md:block bg-goro-gold text-goro-dark font-mono text-[0.65rem] tracking-widest uppercase px-5 py-2.5 rounded-full font-semibold hover:bg-goro-gold-light transition-all hover:shadow-lg hover:shadow-goro-gold/20"
                >
                    Mulai Jelajah
                </a>

                <button
                    className="md:hidden text-goro-cream/70 hover:text-goro-cream transition-colors"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
                >
                    {mobileOpen ? (
                        <X className="w-5 h-5" />
                    ) : (
                        <Menu className="w-5 h-5" />
                    )}
                </button>
            </nav>

            {/* Mobile overlay */}
            <div
                className={`fixed inset-0 z-40 bg-goro-dark/98 flex flex-col items-center justify-center gap-8 transition-all duration-300 ${
                    mobileOpen
                        ? "opacity-100 pointer-events-auto"
                        : "opacity-0 pointer-events-none"
                }`}
            >
                {navLinks.map((item, i) => (
                    <a
                        key={item.href}
                        href={item.href}
                        className="font-display text-3xl text-goro-cream/80 hover:text-goro-gold transition-colors"
                        onClick={() => setMobileOpen(false)}
                        style={{ animationDelay: `${i * 80}ms` }}
                    >
                        {item.label}
                    </a>
                ))}
            </div>
        </>
    );
}
