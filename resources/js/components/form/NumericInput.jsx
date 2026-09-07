import { useState } from "react";

export default function NumericInput({
    label,
    name,
    value,
    onChange,
    error,
    required,
    placeholder = "0",
    prefix,
    suffix,
    className = "",
}) {
    const [localError, setLocalError] = useState("");

    const hasError = error || localError;

    const handleChange = (e) => {
        const raw = e.target.value;

        if (raw === "") {
            setLocalError("");
            onChange("");
            return;
        }

        const isValid = /^\d*$/.test(raw);

        if (!isValid) {
            setLocalError("hanya bisa memasukan angka");
            return;
        }

        setLocalError("");
        onChange(raw);
    };

    const handleKeyDown = (e) => {
        if (
            e.key.length === 1 &&
            !e.ctrlKey &&
            !e.metaKey &&
            !/^\d$/.test(e.key)
        ) {
            e.preventDefault();
            setLocalError("hanya bisa memasukan angka");
        }
    };

    const inputId = name || label?.toLowerCase().replace(/\s+/g, "-");

    return (
        <div className={className}>
            {label && (
                <label
                    htmlFor={inputId}
                    className="mb-1.5 block text-xs font-medium text-primary-dark"
                >
                    {label}{" "}
                    {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <div className="relative">
                {prefix && (
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm">
                        {prefix}
                    </span>
                )}
                <input
                    id={inputId}
                    name={name}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={value}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    autoComplete="off"
                    className={`w-full rounded-xl border px-4 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 ${
                        prefix ? "pl-11" : ""
                    } ${suffix ? "pr-11" : ""} ${
                        hasError
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                            : "border-sand focus:border-primary focus:ring-primary/10"
                    } font-mono`}
                />
                {suffix && (
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm">
                        {suffix}
                    </span>
                )}
            </div>
            {hasError && (
                <p className="mt-1 text-xs text-red-600">
                    {error || localError}
                </p>
            )}
        </div>
    );
}
