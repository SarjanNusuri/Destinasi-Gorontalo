import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, totalPages, onChange }) {
    if (totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <nav className="flex flex-wrap items-center justify-center gap-2">
            <button
                onClick={() => onChange(page - 1)}
                disabled={page === 1}
                aria-label="Halaman sebelumnya"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-sand bg-white text-forest-muted transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
            >
                <ChevronLeft className="h-4 w-4" />
            </button>

            {pages.map((p) => (
                <button
                    key={p}
                    onClick={() => onChange(p)}
                    className={`h-9 w-9 rounded-lg text-sm font-medium transition-colors ${
                        p === page
                            ? "bg-primary text-white"
                            : "border border-sand bg-white text-forest-muted hover:border-primary hover:text-primary"
                    }`}
                >
                    {p}
                </button>
            ))}

            <button
                onClick={() => onChange(page + 1)}
                disabled={page === totalPages}
                aria-label="Halaman berikutnya"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-sand bg-white text-forest-muted transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
            >
                <ChevronRight className="h-4 w-4" />
            </button>
        </nav>
    );
}
