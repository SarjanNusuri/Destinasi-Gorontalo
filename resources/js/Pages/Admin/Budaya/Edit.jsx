import { Head, Link, router, usePage } from "@inertiajs/react";
import { useState, useRef } from "react";
import Layout from "@/components/Admin/Layout";
import {
    ArrowLeft,
    Save,
    Trash2,
    Image,
    Landmark,
    Link as LinkIcon,
    Upload,
    X,
} from "lucide-react";

const SUBTITLE_OPTIONS = [
    "Tari Tradisional",
    "Tradisi & Ritual",
    "Seni Sulam",
    "Kesenian",
    "Kuliner Tradisional",
    "Arsitektur",
    "Busana Adat",
    "Musik Tradisional",
];

export default function BudayaEdit() {
    const { budaya } = usePage().props;

    const [form, setForm] = useState({
        title: budaya.title || "",
        subtitle: budaya.subtitle || "",
        description: budaya.description || "",
        image: budaya.image || "",
    });

    const [imageMode, setImageMode] = useState("url");
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);

    const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
            setForm((prev) => ({ ...prev, image: "" }));
        }
    };

    const removeFile = () => {
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (imageFile) {
            const formData = new FormData();
            formData.append("_method", "PUT");
            Object.entries(form).forEach(([key, value]) => {
                if (value !== "" && value !== null && value !== undefined) {
                    formData.append(key, value);
                }
            });
            formData.append("image_file", imageFile);
            router.post(`/admin/budaya/${budaya.id}`, formData, { forceFormData: true });
        } else {
            router.put(`/admin/budaya/${budaya.id}`, form);
        }
    };

    const handleDelete = () => {
        if (!confirm(`Hapus budaya "${budaya.title}"?`)) return;
        router.delete(`/admin/budaya/${budaya.id}`);
    };

    return (
        <Layout>
            <Head title={`Edit ${budaya.title} — Admin GO360`} />

            <div className="flex items-center justify-between mb-8">
                <div>
                    <Link
                        href="/admin/budaya"
                        className="inline-flex items-center gap-2 text-sm text-forest-muted hover:text-primary-dark transition-colors mb-2"
                    >
                        <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar
                    </Link>
                    <h1 className="text-2xl font-display font-light text-primary-dark">
                        Edit Budaya
                    </h1>
                    <p className="text-xs text-forest-muted mt-1">
                        Mengedit <strong className="text-primary-dark">{budaya.title}</strong>
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleDelete}
                        className="inline-flex items-center gap-2 border border-red-200 text-red-500 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-red-50 hover:border-red-300 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" /> Hapus
                    </button>
                    <button
                        type="submit"
                        form="budaya-edit-form"
                        className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-light transition-colors shadow-sm"
                    >
                        <Save className="w-4 h-4" /> Update
                    </button>
                </div>
            </div>

            <form id="budaya-edit-form" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Left */}
                    <div className="xl:col-span-2 space-y-6">
                        <div className="rounded-2xl border border-sand bg-white p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-5">
                                <div className="w-8 h-8 rounded-lg bg-goro-gold/10 flex items-center justify-center">
                                    <Landmark className="w-4 h-4 text-goro-gold" />
                                </div>
                                <h2 className="text-sm font-semibold text-primary-dark">
                                    Informasi Budaya
                                </h2>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs text-forest-muted block mb-1.5">
                                        Judul
                                    </label>
                                    <input
                                        type="text"
                                        value={form.title}
                                        onChange={(e) => update("title", e.target.value)}
                                        className="w-full border border-sand rounded-xl px-4 py-3 text-sm text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-forest-muted block mb-1.5">
                                        Kategori
                                    </label>
                                    <select
                                        value={form.subtitle}
                                        onChange={(e) => update("subtitle", e.target.value)}
                                        className="w-full border border-sand rounded-xl px-4 py-3 text-sm text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all bg-white"
                                    >
                                        <option value="">Pilih kategori...</option>
                                        {SUBTITLE_OPTIONS.map((opt) => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs text-forest-muted block mb-1.5">
                                        Deskripsi
                                    </label>
                                    <textarea
                                        rows={5}
                                        value={form.description}
                                        onChange={(e) => update("description", e.target.value)}
                                        className="w-full border border-sand rounded-xl px-4 py-3 text-sm text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all resize-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right */}
                    <div className="space-y-6">
                        <div className="rounded-2xl border border-sand bg-white p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-5">
                                <div className="w-8 h-8 rounded-lg bg-goro-gold/10 flex items-center justify-center">
                                    <Image className="w-4 h-4 text-goro-gold" />
                                </div>
                                <h2 className="text-sm font-semibold text-primary-dark">Gambar</h2>
                            </div>

                            <div className="flex gap-2 mb-4">
                                <button type="button" onClick={() => { setImageMode("url"); removeFile(); }} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${imageMode === "url" ? "bg-primary text-white" : "bg-cream text-forest-muted hover:bg-sand"}`}>
                                    <LinkIcon className="w-3 h-3" /> URL
                                </button>
                                <button type="button" onClick={() => { setImageMode("file"); update("image", ""); }} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${imageMode === "file" ? "bg-primary text-white" : "bg-cream text-forest-muted hover:bg-sand"}`}>
                                    <Upload className="w-3 h-3" /> Upload File
                                </button>
                            </div>

                            {imageMode === "url" ? (
                                <>
                                    <input
                                        type="url"
                                        value={form.image}
                                        onChange={(e) => update("image", e.target.value)}
                                        className="w-full border border-sand rounded-xl px-4 py-3 text-sm text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all mb-4"
                                    />
                                    {form.image ? (
                                        <img src={form.image} alt="Preview" className="w-full h-48 rounded-xl object-cover border border-sand" />
                                    ) : (
                                        <div className="w-full h-48 rounded-xl border-2 border-dashed border-sand flex flex-col items-center justify-center text-forest-muted/40">
                                            <Image className="w-8 h-8 mb-2" />
                                            <span className="text-xs">Preview gambar</span>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <>
                                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" id="budaya-image-upload" />
                                    {imageFile ? (
                                        <div className="relative w-full h-48 rounded-xl overflow-hidden border border-sand group">
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                                                <p className="text-xs text-white font-medium truncate">{imageFile.name}</p>
                                                <p className="text-[0.6rem] text-white/70">{(imageFile.size / 1024).toFixed(1)} KB</p>
                                            </div>
                                            <button type="button" onClick={removeFile} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500/80 flex items-center justify-center text-white hover:bg-red-500 transition-colors">
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ) : (
                                        <label htmlFor="budaya-image-upload" className="flex flex-col items-center justify-center w-full h-48 rounded-xl border-2 border-dashed border-sand hover:border-primary/40 cursor-pointer transition-colors">
                                            <Upload className="w-8 h-8 text-forest-muted/40 mb-2" />
                                            <span className="text-xs text-forest-muted/60">Klik untuk pilih gambar</span>
                                            <span className="text-[0.6rem] text-forest-muted/40 mt-1">JPG, PNG, max 2MB</span>
                                        </label>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </form>
        </Layout>
    );
}
