import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import Layout from "@/components/Admin/Layout";
import { ArrowLeft, Save, Image, Landmark } from "lucide-react";

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

export default function BudayaCreate() {
    const [form, setForm] = useState({
        title: "",
        subtitle: "",
        description: "",
        image: "",
    });

    const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Budaya berhasil ditambahkan (dummy)!");
        router.visit("/admin/budaya");
    };

    return (
        <Layout>
            <Head title="Tambah Budaya — Admin GO360" />

            <div className="flex items-center justify-between mb-8">
                <div>
                    <Link
                        href="/admin/budaya"
                        className="inline-flex items-center gap-2 text-sm text-forest-muted hover:text-primary-dark transition-colors mb-2"
                    >
                        <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar
                    </Link>
                    <h1 className="text-2xl font-display font-light text-primary-dark">
                        Tambah Budaya Baru
                    </h1>
                </div>
                <button
                    type="submit"
                    form="budaya-form"
                    className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-light transition-colors shadow-sm"
                >
                    <Save className="w-4 h-4" /> Simpan
                </button>
            </div>

            <form id="budaya-form" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Left — main info */}
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
                                        placeholder="Contoh: Tari Saronde"
                                        className="w-full border border-sand rounded-xl px-4 py-3 text-sm text-primary-dark placeholder:text-forest-muted/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
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
                                        placeholder="Deskripsi budaya atau warisan..."
                                        className="w-full border border-sand rounded-xl px-4 py-3 text-sm text-primary-dark placeholder:text-forest-muted/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all resize-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right — image */}
                    <div className="space-y-6">
                        <div className="rounded-2xl border border-sand bg-white p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-5">
                                <div className="w-8 h-8 rounded-lg bg-goro-gold/10 flex items-center justify-center">
                                    <Image className="w-4 h-4 text-goro-gold" />
                                </div>
                                <h2 className="text-sm font-semibold text-primary-dark">
                                    Gambar
                                </h2>
                            </div>
                            <input
                                type="url"
                                value={form.image}
                                onChange={(e) => update("image", e.target.value)}
                                placeholder="https://example.com/image.jpg"
                                className="w-full border border-sand rounded-xl px-4 py-3 text-sm text-primary-dark placeholder:text-forest-muted/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all mb-4"
                            />
                            {form.image ? (
                                <img
                                    src={form.image}
                                    alt="Preview"
                                    className="w-full h-48 rounded-xl object-cover border border-sand"
                                />
                            ) : (
                                <div className="w-full h-48 rounded-xl border-2 border-dashed border-sand flex flex-col items-center justify-center text-forest-muted/40">
                                    <Image className="w-8 h-8 mb-2" />
                                    <span className="text-xs">Preview gambar</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </form>
        </Layout>
    );
}
