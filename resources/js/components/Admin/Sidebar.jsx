import { useState } from "react";
import {
    ChevronDown,
    ChevronRight,
    ChevronLeft,
    House,
    LayoutDashboard,
    LogOut,
    MapPin,
    Landmark,
    Globe,
    BedDouble,
} from "lucide-react";
import { Link, usePage } from "@inertiajs/react";

export default function Sidebar({
    mobile = false,
    collapsed = false,
    onNavigate,
    onToggleDesktop,
    onExpand,
}) {
    const { url } = usePage();
    const path = url.split("?")[0].replace(/\/$/, "");

    const navItems = [
        { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
        { label: "Destinasi", icon: MapPin, href: "/admin/destinations" },
        { label: "Hotel", icon: BedDouble, href: "/admin/hotels" },
        { label: "Budaya", icon: Landmark, href: "/admin/budaya" },
    ];

    const isActive = (href) => {
        if (href === "/admin") {
            return path === "/admin";
        }
        return path === href || path.startsWith(href + "/");
    };

    const asideClass = mobile
        ? "fixed inset-y-0 left-0 z-50 flex h-full w-72 max-w-full flex-col bg-primary-dark shadow-xl"
        : collapsed
          ? "sticky top-0 flex h-screen w-[4.5rem] shrink-0 flex-col bg-primary-dark"
          : "sticky top-0 flex h-screen w-60 shrink-0 flex-col bg-primary-dark";

    const linkClass = (active) =>
        `flex w-full items-center rounded-xl py-2.5 text-left text-sm transition-all ${
            active
                ? "bg-white/15 font-medium text-white"
                : "text-white/60 hover:bg-white/8 hover:text-white"
        } ${collapsed ? "justify-center gap-0 px-0" : "gap-3 px-3"}`;

    return (
        <aside className={`${asideClass} relative`}>
            {!mobile && onToggleDesktop && (
                <button
                    onClick={onToggleDesktop}
                    title={collapsed ? "Buka sidebar" : "Tutup sidebar"}
                    className="absolute -right-3.5 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-sand bg-white text-forest-muted shadow-md transition-colors hover:text-primary-dark"
                >
                    {collapsed ? (
                        <ChevronRight className="h-4 w-4" />
                    ) : (
                        <ChevronLeft className="h-4 w-4" />
                    )}
                </button>
            )}

            {mobile && onNavigate && (
                <button
                    onClick={onNavigate}
                    className="absolute -right-3.5 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-sand bg-white text-forest-muted shadow-md hover:text-primary-dark"
                >
                    <ChevronLeft className="h-5 w-5" />
                </button>
            )}

            <div
                className={`border-b border-white/10 ${collapsed ? "p-4" : "p-6"}`}
            >
                <div
                    className={`flex items-center ${collapsed ? "justify-center" : "gap-3"}`}
                >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-goro-gold">
                        <span className="text-goro-dark font-bold text-xs font-mono">
                            GLH
                        </span>
                    </div>

                    <div
                        className={`whitespace-nowrap overflow-hidden transition-all duration-200 ${
                            collapsed ? "w-0" : "w-auto"
                        }`}
                    >
                        <p className="text-xs text-white/50">Admin Panel</p>
                        <p className="text-sm font-semibold text-white">
                            GO360 Gorontalo
                        </p>
                    </div>
                </div>
            </div>

            <nav
                className={`flex-1 space-y-1 overflow-y-auto ${collapsed ? "p-2" : "p-4"}`}
            >
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => onNavigate?.()}
                            className={linkClass(isActive(item.href))}
                            title={item.label}
                        >
                            <Icon className="h-4 w-4 shrink-0" />
                            {!collapsed && item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="border-t border-white/10 p-4">
                <Link
                    href="/"
                    className={`flex w-full items-center rounded-xl py-2.5 text-left text-sm text-white/60 transition-all hover:bg-white/8 hover:text-white ${
                        collapsed ? "justify-center gap-0 px-0" : "gap-3 px-3"
                    }`}
                >
                    <Globe className="h-4 w-4 shrink-0" />
                    {!collapsed && "Lihat Website"}
                </Link>
                <Link
                    href="/logout"
                    method="post"
                    as="button"
                    onClick={() => onNavigate?.()}
                    title="Keluar"
                    className={`flex w-full items-center rounded-xl py-2.5 text-left text-sm text-white/60 transition-all hover:bg-red-400/10 hover:text-red-400 ${
                        collapsed ? "justify-center gap-0 px-0" : "gap-3 px-3"
                    }`}
                >
                    <LogOut className="h-4 w-4 shrink-0" />
                    {!collapsed && "Keluar"}
                </Link>
            </div>
        </aside>
    );
}
