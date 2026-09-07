import { Head, Link, router, usePage } from "@inertiajs/react";
import Layout from "@/components/Admin/Layout";
import { Plus, Pencil, Trash2, Landmark } from "lucide-react";

export default function BudayaIndex() {
    const { budaya } = usePage().props;

    const handleDelete = (id, title) => {
        if (!confirm(`Hapus budaya "${title}"?`)) return;
        router.delete(`/admin/budaya/${id}`);
    };

    return (
        <Layout>
            <Head title="Budaya — Admin GO360" />

            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-display font-light text-primary-dark">
                        Budaya & Warisan
                    </h1>
                    <p className="text-sm text-forest-muted mt-1">
                        Kelola budaya tradisional dan warisan Gorontalo.
                    </p>
                </div>
                <Link
                    href="/admin/budaya/create"
                    className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-light transition-colors"
                >
                    <Plus className="w-4 h-4" /> Tambah Budaya
                </Link>
            </div>

            {budaya.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-sand p-16 text-center">
                    <Landmark className="w-10 h-10 text-forest-muted/30 mx-auto mb-3" />
                    <p className="text-sm text-forest-muted/60">Belum ada data budaya.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {budaya.map((item) => (
                        <div
                            key={item.id}
                            className="rounded-2xl border border-sand bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                        >
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-44 object-cover"
                            />
                            <div className="p-5">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-7 h-7 rounded-lg bg-goro-gold/10 flex items-center justify-center">
                                        <Landmark className="w-3.5 h-3.5 text-goro-gold" />
                                    </div>
                                    <span className="font-mono text-[0.55rem] tracking-wider text-goro-gold uppercase">
                                        {item.subtitle}
                                    </span>
                                </div>
                                <h3 className="font-display text-lg font-medium text-primary-dark mb-2">
                                    {item.title}
                                </h3>
                                <p className="text-xs text-forest-muted leading-relaxed mb-4 line-clamp-2">
                                    {item.description}
                                </p>
                                <div className="flex items-center gap-2">
                                    <Link
                                        href={`/admin/budaya/${item.id}/edit`}
                                        className="flex-1 inline-flex items-center justify-center gap-1.5 border border-sand rounded-lg px-3 py-2 text-xs font-medium text-primary-dark hover:bg-cream transition-colors"
                                    >
                                        <Pencil className="w-3 h-3" /> Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(item.id, item.title)}
                                        className="flex-1 inline-flex items-center justify-center gap-1.5 border border-red-200 rounded-lg px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-50 hover:border-red-300 transition-colors"
                                    >
                                        <Trash2 className="w-3 h-3" /> Hapus
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Layout>
    );
}
