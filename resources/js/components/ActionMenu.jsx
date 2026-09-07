import { useState, useRef, useEffect } from "react";
import { Link } from "@inertiajs/react";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";

export default function ActionMenu({
    editHref,
    onDelete,
    editLabel = "Edit",
    deleteLabel = "Hapus",
}) {
    const [open, setOpen] = useState(false);
    const [pos, setPos] = useState({ top: 0, left: 0 });
    const btnRef = useRef(null);
    const menuRef = useRef(null);

    const openMenu = () => {
        if (open) {
            setOpen(false);
            return;
        }
        if (!btnRef.current) return;
        const r = btnRef.current.getBoundingClientRect();
        const menuH = 110;
        const spaceBelow = window.innerHeight - r.bottom;
        const openUp = spaceBelow < menuH + 8;

        setPos({
            top: openUp ? r.top - menuH - 4 : r.bottom + 4,
            left: r.right - 144,
        });
        setOpen(true);
    };

    useEffect(() => {
        const handleClose = (e) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target) &&
                btnRef.current &&
                !btnRef.current.contains(e.target)
            ) {
                setOpen(false);
            }
        };

        if (open) {
            document.addEventListener("mousedown", handleClose);
            window.addEventListener("scroll", handleClose, true);
        }
        return () => {
            document.removeEventListener("mousedown", handleClose);
            window.removeEventListener("scroll", handleClose, true);
        };
    }, [open]);

    return (
        <>
            <button
                ref={btnRef}
                onClick={openMenu}
                className="rounded-lg border border-sand p-2 text-forest-muted transition-colors hover:border-primary hover:bg-mint hover:text-primary-dark"
                title="Aksi"
            >
                <MoreVertical className="h-4 w-4" />
            </button>

            {open && (
                <div
                    ref={menuRef}
                    className="fixed z-[9999] w-36 rounded-xl border border-sand bg-white shadow-lg"
                    style={{ top: pos.top, left: pos.left }}
                >
                    <Link
                        href={editHref}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-primary-dark transition-colors hover:bg-mint"
                        onClick={() => setOpen(false)}
                    >
                        <Pencil className="h-3.5 w-3.5" />
                        {editLabel}
                    </Link>
                    <button
                        onClick={() => {
                            setOpen(false);
                            onDelete();
                        }}
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                        {deleteLabel}
                    </button>
                </div>
            )}
        </>
    );
}
