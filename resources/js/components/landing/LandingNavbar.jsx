import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";
import { usePage } from "@inertiajs/react";

const landingLinks = [
    { label: "Explore", href: "#explore" },
    { label: "Heritage", href: "#heritage" },
    { label: "Map", href: "#map" },
    { label: "Trip Planner", href: "#trip" },
];

const detailLinks = [
    { label: "3D View", href: "#diorama" },
    { label: "Tentang", href: "#tentang" },
    { label: "Peta", href: "#peta" },
    { label: "Penginapan", href: "#penginapan" },
];

export default function LandingNavbar() {
    const [open, setOpen] = useState(false);
    const { component, url } = usePage();

    const isDetail = component === "DestinationDetail";
    const navLinks = isDetail ? detailLinks : landingLinks;
    const brandLabel = isDetail ? "GO360" : "GLH";
    const brandName = isDetail ? "GO360 Gorontalo" : "Gorontalo Living Heritage";
    const ctaLabel = "Login";
    const ctaHref = "/login";

    useEffect(() => {
        setOpen(false);
    }, [url]);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-goro-dark/90 backdrop-blur-md border-b border-white/5">
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
                {/* Logo */}
                <motion.div
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                >
                    <a href={isDetail ? "/" : ctaHref} className="flex items-center gap-3 group shrink-0 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-goro-gold flex items-center justify-center transition-transform group-hover:scale-110">
                            <span className="text-goro-dark font-bold text-xs font-mono">
                                {brandLabel}
                            </span>
                        </div>
                        <span className="font-display font-medium text-goro-cream text-sm tracking-wide">
                            {brandName}
                        </span>
                    </a>
                </motion.div>

                {/* Desktop links */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
                    className="hidden md:flex items-center gap-7"
                >
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="text-xs font-mono tracking-widest uppercase text-goro-cream/60 hover:text-goro-gold transition-colors relative group"
                        >
                            {link.label}
                            <span className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-goro-gold scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                        </a>
                    ))}
                </motion.div>

                {/* Desktop CTA */}
                <motion.div
                    initial={{ x: 30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
                    className="hidden md:flex items-center gap-3"
                >
                    <a
                        href={ctaHref}
                        className="bg-goro-gold text-goro-dark font-mono text-[0.65rem] tracking-widest uppercase px-5 py-2.5 rounded-full font-semibold hover:bg-goro-gold-light transition-all hover:shadow-lg hover:shadow-goro-gold/20"
                    >
                        {ctaLabel}
                    </a>
                </motion.div>

                {/* Mobile hamburger */}
                <motion.button
                    initial={{ x: 30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
                    className="md:hidden flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-goro-cream transition-colors hover:bg-white/5"
                    onClick={() => setOpen(!open)}
                    aria-label={open ? "Tutup menu" : "Buka menu"}
                >
                    <AnimatePresence mode="wait" initial={false}>
                        {open ? (
                            <motion.span
                                key="x"
                                initial={{ rotate: -90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: 90, opacity: 0 }}
                                transition={{ duration: 0.15 }}
                            >
                                <X className="h-5 w-5" />
                            </motion.span>
                        ) : (
                            <motion.span
                                key="menu"
                                initial={{ rotate: 90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: -90, opacity: 0 }}
                                transition={{ duration: 0.15 }}
                            >
                                <Menu className="h-5 w-5" />
                            </motion.span>
                        )}
                    </AnimatePresence>
                </motion.button>
            </div>

            {/* Mobile slide-down menu */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="md:hidden overflow-hidden bg-goro-dark/95 border-t border-white/5"
                    >
                        <div className="px-6 py-4 flex flex-col gap-1">
                            {navLinks.map((link, i) => (
                                <motion.a
                                    key={link.href}
                                    href={link.href}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: i * 0.05 + 0.1 }}
                                    onClick={() => setOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-goro-cream/70 hover:text-goro-gold hover:bg-white/5 transition-all text-sm font-medium"
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-goro-gold/40" />
                                    {link.label}
                                </motion.a>
                            ))}

                            <div className="mt-2 pt-3 border-t border-white/5">
                                <motion.a
                                    href={ctaHref}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: navLinks.length * 0.05 + 0.1 }}
                                    onClick={() => setOpen(false)}
                                    className="block text-center bg-goro-gold text-goro-dark font-mono text-[0.65rem] tracking-widest uppercase px-5 py-3 rounded-full font-semibold"
                                >
                                    {ctaLabel}
                                </motion.a>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
