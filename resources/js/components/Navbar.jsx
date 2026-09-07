import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, usePage } from "@inertiajs/react";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const { url } = usePage();

    const links = [
        { label: "Beranda", to: "/" },
        { label: "About", to: "/about" },
        { label: "Contact", to: "/contact" },
    ];

    const isActive = (to) => {
        const currentPath = url.split("?")[0].split("#")[0] || "/";

        return currentPath === to;
    };

    const linkClass = (to) =>
        `relative text-sm font-medium transition-colors ${
            isActive(to)
                ? "text-primary after:content-[''] after:absolute after:-bottom-1.5 after:left-0 after:right-0 after:h-0.5 after:rounded-full after:bg-accent"
                : "text-forest-muted hover:text-primary"
        }`;

    const mobileLinkClass = (to) =>
        `text-sm font-medium ${
            isActive(to)
                ? "border-l-2 border-accent pl-3 text-primary"
                : "border-l-2 border-transparent pl-3 text-forest-muted hover:text-primary"
        }`;

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-sand">
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                        >
                            <path
                                d="M8 1L1 6v9h5v-5h4v5h5V6L8 1z"
                                fill="#F8F6F1"
                            />
                        </svg>
                    </div>

                    <div>
                        <p className="text-xs text-forest-muted leading-none">
                            Desa
                        </p>

                        <p className="font-semibold text-primary-dark leading-none text-sm tracking-wide">
                            Tolomato
                        </p>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-7">
                    {links.map((link) => (
                        <Link
                            key={link.to}
                            href={link.to}
                            className={linkClass(link.to)}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Admin */}
                <div className="hidden md:flex items-center gap-3">
                    <Link
                        href="/login"
                        className="text-sm px-4 py-2 rounded-full border border-primary text-primary hover:bg-primary hover:text-white transition-all font-medium"
                    >
                        Admin
                    </Link>
                </div>

                {/* Mobile Button */}
                <button
                    className="md:hidden flex h-10 w-10 items-center justify-center rounded-full text-primary-dark transition-colors hover:bg-cream"
                    onClick={() => setOpen(!open)}
                    aria-label={open ? "Tutup menu" : "Buka menu"}
                >
                    {open ? (
                        <X className="h-5 w-5" />
                    ) : (
                        <Menu className="h-5 w-5" />
                    )}
                </button>
            </div>

            {/* Mobile Navigation */}
            {open && (
                <div className="md:hidden bg-white border-t border-sand px-6 py-4 flex flex-col gap-4">
                    {links.map((link) => (
                        <Link
                            key={link.to}
                            href={link.to}
                            onClick={() => setOpen(false)}
                            className={mobileLinkClass(link.to)}
                        >
                            {link.label}
                        </Link>
                    ))}

                    <Link
                        href="/login"
                        onClick={() => setOpen(false)}
                        className="text-sm px-4 py-2 rounded-full border border-primary text-primary font-medium w-fit"
                    >
                        Admin Login
                    </Link>
                </div>
            )}
        </nav>
    );
}
