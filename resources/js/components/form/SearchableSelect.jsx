import { useEffect, useRef, useState } from "react";
import { CircleUser, X } from "lucide-react";

export default function SearchableSelect({
    options,
    value,
    onChange,
    placeholder = "Cari...",
    error,
}) {
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);
    const [highlight, setHighlight] = useState(-1);
    const wrapperRef = useRef(null);
    const inputRef = useRef(null);

    const selected = options.find((o) => String(o.id) === String(value));

    useEffect(() => {
        setQuery(selected ? selected.label : "");
    }, [selected]);

    useEffect(() => {
        const handleClick = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpen(false);
                setQuery(selected ? selected.label : "");
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [selected]);

    const filtered = options.filter((o) =>
        o.label.toLowerCase().includes(query.toLowerCase()),
    );

    useEffect(() => {
        setHighlight(-1);
    }, [query]);

    const select = (opt) => {
        onChange(opt.id);
        setQuery(opt.label);
        setOpen(false);
        inputRef.current?.blur();
    };

    const clear = (e) => {
        e.stopPropagation();
        onChange("");
        setQuery("");
        setHighlight(-1);
        inputRef.current?.focus();
    };

    const handleKeyDown = (e) => {
        if (!open) {
            if (e.key === "ArrowDown" || e.key === "Enter") {
                e.preventDefault();
                setOpen(true);
            }
            return;
        }
        if (e.key === "ArrowDown") {
            e.preventDefault();
            if (filtered.length > 0)
                setHighlight((h) => (h + 1) % filtered.length);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            if (filtered.length > 0)
                setHighlight(
                    (h) => (h - 1 + filtered.length) % filtered.length,
                );
        } else if (e.key === "Enter" && highlight >= 0) {
            e.preventDefault();
            select(filtered[highlight]);
        } else if (e.key === "Escape") {
            setOpen(false);
            setQuery(selected ? selected.label : "");
            inputRef.current?.blur();
        }
    };

    return (
        <div ref={wrapperRef} className="relative">
            <div
                className={`flex items-center rounded-xl border transition-all focus-within:ring-2 ${
                    error
                        ? "border-red-500 focus-within:border-red-500 focus-within:ring-red-500/10"
                        : "border-sand focus-within:border-primary focus-within:ring-primary/10"
                }`}
            >
                <CircleUser className="pointer-events-none ml-3 h-4 w-4 shrink-0 text-forest-muted" />
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setOpen(true);
                        if (!e.target.value) onChange("");
                    }}
                    onFocus={() => setOpen(true)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="w-full bg-transparent px-3 py-2.5 text-sm outline-none"
                    autoComplete="off"
                />
                {value && (
                    <button
                        type="button"
                        onClick={clear}
                        className="mr-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-forest-muted transition-colors hover:bg-cream hover:text-primary"
                    >
                        <X className="h-3.5 w-3.5" />
                    </button>
                )}
            </div>

            {open && filtered.length > 0 && (
                <ul className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-sand bg-white py-1 shadow-lg">
                    {filtered.map((opt, i) => (
                        <li
                            key={opt.id}
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => select(opt)}
                            onMouseEnter={() => setHighlight(i)}
                            className={`cursor-pointer px-4 py-2.5 text-sm transition-colors ${
                                i === highlight
                                    ? "bg-mint text-primary-dark"
                                    : "hover:bg-cream"
                            }`}
                        >
                            <span className="font-medium">{opt.label}</span>
                            {opt.sub && (
                                <span className="ml-2 text-xs text-forest-muted">
                                    {opt.sub}
                                </span>
                            )}
                        </li>
                    ))}
                </ul>
            )}

            {open && query && filtered.length === 0 && (
                <ul className="absolute z-50 mt-1 w-full rounded-xl border border-sand bg-white py-6 text-center shadow-lg">
                    <li className="text-sm text-forest-muted">
                        Tidak ditemukan
                    </li>
                </ul>
            )}
        </div>
    );
}
