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

const sampleBudaya = {
    id: 1,
    title: "Tari Saronde",
    subtitle: "Tari Tradisional",
    description:
        "Tari penyambutan pengantin pria dalam upacara adat Gorontalo. Gerakan lemah gemulai mencerminkan keanggunan budaya Hulondalo.",
    image: "https://images.unsplash.com/photo-1542897643-cfccd88c7127?w=800&h=600&fit=crop&auto=format",
};

export default function BudayaEdit() {
    const [form, setForm] = useState({
        title: sampleBudaya.title,
        subtitle: sampleBudaya.subtitle,
        description: sampleBudaya.description,
        image: sampleBudaya.image,
    });

    const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Budaya berhasil diupdate (dummy)!");
        router.visit("/admin/budaya");
    };

    return (
        <Layout>
            <Head title={`Edit ${form.title} — Admin GO360`} />

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
                        Mengedit <strong className="text-primary-dark">{form.title}</strong>
                    </p>
                </div>
                <button
                    type="submit"
                    form="budaya-edit-form"
                    className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-light transition-colors shadow-sm"
                >
                    <Save className="w-4 h-4" /> Update
                </button>
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
                                <h2 className="text-sm font-semibold text-primary-dark">
                                    Gambar
                                </h2>
                            </div>
                            <input
                                type="url"
                                value={form.image}
                                onChange={(e) => update("image", e.target.value)}
                                className="w-full border border-sand rounded-xl px-4 py-3 text-sm text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all mb-4"
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
