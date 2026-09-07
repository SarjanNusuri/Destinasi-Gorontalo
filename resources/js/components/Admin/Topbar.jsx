import { useEffect, useRef, useState } from "react";
import { ChevronLeft, LogOut, SquareChevronRight, UserPen } from "lucide-react";
import { Link, router, usePage } from "@inertiajs/react";

const TITLES = {
    "/admin": "Dashboard",
    "/admin/data-zakat": "Data Zakat Warga",
    "/admin/zakat/create": "Tambah Data Zakat",
    "/admin/penduduk": "Data Penduduk",
    "/admin/penduduk/create": "Tambah Penduduk",
    "/admin/aparat": "Kelola Aparat Desa",
    "/admin/aparat/create": "Tambah Aparat",
    "/admin/berita": "Kelola Berita",
    "/admin/berita/create": "Tambah Berita",
    "/admin/galeri": "Kelola Galeri",
    "/admin/galeri/create": "Tambah Galeri",
};

const SUBTITLES = {
    "/admin": "Ringkasan kegiatan Desa Tolomato",
    "/admin/data-zakat": "Pencatatan zakat fitrah, maal, dan infaq",
    "/admin/zakat/create": "Lengkapi formulir di bawah ini",
    "/admin/penduduk": "Data kependudukan desa",
    "/admin/penduduk/create": "Lengkapi formulir di bawah ini",
    "/admin/aparat": "Susunan perangkat desa sesuai SOTK",
    "/admin/aparat/create": "Lengkapi formulir di bawah ini",
    "/admin/berita": "Kelola berita desa",
    "/admin/berita/create": "Lengkapi formulir di bawah ini",
    "/admin/galeri": "Kelola galeri foto desa",
    "/admin/galeri/create": "Lengkapi formulir di bawah ini",
};

export default function Topbar({ mobileOpen = false, onToggleMobile }) {
    const { url, props } = usePage();
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef(null);

    const path = url.split("?")[0].replace(/\/$/, "") || "/admin";

    const title =
        TITLES[path] ??
        (/^\/admin\/zakat\/[^/]+\/edit$/.test(path)
            ? "Edit Data Zakat"
            : undefined) ??
        (/^\/admin\/penduduk\/[^/]+\/edit$/.test(path)
            ? "Edit Penduduk"
            : undefined) ??
        (/^\/admin\/aparat\/[^/]+\/edit$/.test(path)
            ? "Edit Aparat"
            : undefined) ??
        (/^\/admin\/berita\/[^/]+\/edit$/.test(path)
            ? "Edit Berita"
            : undefined) ??
        (/^\/admin\/galeri\/[^/]+\/edit$/.test(path)
            ? "Edit Galeri"
            : undefined) ??
        (/^\/admin\/profil\/edit\/[^/]+$/.test(path)
            ? "Edit Profil"
            : undefined) ??
        "Dashboard";

    const subtitle =
        SUBTITLES[path] ??
        (title.startsWith("Edit")
            ? "Perbarui data pada formulir di bawah ini"
            : SUBTITLES["/admin"]);

    const user = props.auth?.user;
    const userName = user?.name || "Admin";
    const userEmail = user?.email || "";
    const userRole = user?.role || "admin";
    const profileId = user?.profile_id || "";

    const initials = userName
        .trim()
        .split(/\s+/)
        .map((w) => w.charAt(0).toUpperCase())
        .slice(0, 2)
        .join("");

    useEffect(() => {
        const handleClick = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const handleLogout = () => {
        router.post("/logout");
    };

    return (
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-sand bg-white px-6 py-4">
            <div className="flex items-center gap-4">
                <button
                    type="button"
                    className="lg:hidden"
                    onClick={onToggleMobile}
                >
                    {mobileOpen ? (
                        <ChevronLeft className="h-5 w-5 text-primary-dark" />
                    ) : (
                        <SquareChevronRight className="h-5 w-5 text-primary-dark" />
                    )}
                </button>

                <div>
                    <h1 className="text-base font-semibold text-primary-dark">
                        {title}
                    </h1>

                    <p className="text-xs text-forest-muted">{subtitle}</p>
                </div>
            </div>

            <div ref={wrapperRef} className="relative">
                <button
                    type="button"
                    onClick={() => setOpen(!open)}
                    className="flex items-center gap-2 rounded-lg p-1 transition-colors hover:bg-cream"
                >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-mint text-sm font-medium text-primary">
                        {initials}
                    </div>

                    <div className="hidden sm:block">
                        <p className="text-sm font-medium leading-tight text-primary-dark">
                            {userName}
                        </p>

                        <p className="text-xs leading-tight text-forest-muted capitalize">
                            {userRole}
                        </p>
                    </div>
                </button>

                {open && (
                    <div className="absolute right-0 z-50 mt-2 w-56 rounded-xl border border-sand bg-white py-1 shadow-lg">
                        <div className="border-b border-sand px-4 py-3">
                            <p className="text-sm font-medium text-primary-dark">
                                {userName}
                            </p>
                            <p className="text-xs text-forest-muted">
                                {userEmail}
                            </p>
                        </div>

                        <div className="py-1">
                            <Link
                                href={`/admin/profil/edit/${encodeURIComponent(profileId)}`}
                                onClick={() => setOpen(false)}
                                className="flex items-center gap-2 px-4 py-2.5 text-sm text-primary-dark transition-colors hover:bg-cream"
                            >
                                <UserPen className="h-4 w-4 text-forest-muted" />
                                Edit Profil
                            </Link>
                        </div>

                        <div className="border-t border-sand py-1">
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50"
                            >
                                <LogOut className="h-4 w-4" />
                                Keluar
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
