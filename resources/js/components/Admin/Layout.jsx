import { useEffect, useState } from "react";
import Sidebar from "@/components/Admin/Sidebar";
import Topbar from "@/components/Admin/Topbar";

export default function Layout({ children }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [desktopOpen, setDesktopOpen] = useState(
        () => sessionStorage.getItem("adminSidebarDesktop") !== "collapsed",
    );

    useEffect(() => {
        sessionStorage.setItem(
            "adminSidebarDesktop",
            desktopOpen ? "expanded" : "collapsed",
        );
    }, [desktopOpen]);

    useEffect(() => {
        document.body.style.overflow = mobileOpen ? "hidden" : "";

        return () => {
            document.body.style.overflow = "";
        };
    }, [mobileOpen]);

    const closeMobile = () => setMobileOpen(false);

    return (
        <div className="flex min-h-screen bg-cream font-body">
            {/* Sidebar (desktop) */}
            <div className="hidden lg:flex">
                <Sidebar
                    collapsed={!desktopOpen}
                    onToggleDesktop={() => setDesktopOpen(!desktopOpen)}
                    onExpand={() => setDesktopOpen(true)}
                />
            </div>

            {/* Main */}
            <div className="flex min-w-0 flex-1 flex-col">
                <Topbar
                    mobileOpen={mobileOpen}
                    onToggleMobile={() => setMobileOpen(!mobileOpen)}
                />

                {/* Sidebar (mobile) */}
                {mobileOpen && (
                    <div className="fixed inset-0 z-40 lg:hidden">
                        <Sidebar mobile onNavigate={closeMobile} />
                    </div>
                )}

                <main className="flex-1 overflow-y-auto p-6">{children}</main>
            </div>
        </div>
    );
}
