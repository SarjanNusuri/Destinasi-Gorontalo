import { useEffect, useRef, useState } from "react";
import { RefreshCw, Trash2, Upload } from "lucide-react";

const MAX_SIZE = 3 * 1024 * 1024;

export default function ImageUploader({
    value,
    onChange,
    error = "",
    hint = "Klik untuk upload gambar",
    maxSize = MAX_SIZE,
    onError,
}) {
    const inputRef = useRef(null);
    const [preview, setPreview] = useState("");

    const maxMb = maxSize / (1024 * 1024);

    useEffect(() => {
        if (value instanceof File) {
            const url = URL.createObjectURL(value);

            setPreview(url);

            return () => {
                URL.revokeObjectURL(url);
            };
        }

        setPreview(value || "");
    }, [value]);

    const handleFile = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            onError?.("File harus berupa gambar.");
            e.target.value = "";
            return;
        }

        if (file.size > maxSize) {
            onError?.(`Ukuran gambar maksimal ${maxMb} MB.`);
            e.target.value = "";
            return;
        }

        onError?.("");
        onChange(file);

        // Supaya file yang sama bisa dipilih lagi
        e.target.value = "";
    };

    const handleRemove = () => {
        onChange("");
        onError?.("");
    };

    return (
        <div>
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFile}
            />

            {preview ? (
                <div
                    className={`group relative h-48 overflow-hidden rounded-xl border bg-cream ${
                        error
                            ? "border-red-500 ring-2 ring-red-500/10"
                            : "border-sand"
                    }`}
                >
                    <img
                        src={preview}
                        alt="Pratinjau"
                        className="h-full w-full object-cover"
                    />

                    <div className="absolute inset-x-0 bottom-0 flex justify-center gap-2 bg-gradient-to-t from-primary-dark/70 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-primary-dark transition-colors hover:bg-cream"
                        >
                            <RefreshCw className="h-3.5 w-3.5" />
                            Ganti
                        </button>

                        <button
                            type="button"
                            onClick={handleRemove}
                            className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-red-700"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                            Hapus
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className={`flex h-48 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed bg-cream/50 transition-colors ${
                        error
                            ? "border-red-500 bg-red-50/50 text-red-600"
                            : "border-sand text-forest-muted hover:border-primary hover:text-primary"
                    }`}
                >
                    <Upload className="h-7 w-7" />

                    <span className="text-sm font-medium">{hint}</span>

                    <span className="text-xs text-forest-muted/70">
                        JPEG, PNG, GIF, WEBP maks. {maxMb} MB
                    </span>
                </button>
            )}

            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
    );
}
