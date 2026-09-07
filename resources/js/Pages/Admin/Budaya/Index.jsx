import { Head, Link } from "@inertiajs/react";
import Layout from "@/components/Admin/Layout";
import { Plus, Pencil, Trash2, Landmark } from "lucide-react";

const heritageItems = [
    {
        id: 1,
        title: "Tari Saronde",
        subtitle: "Tari Tradisional",
        description: "Tari penyambutan pengantin pria dalam upacara adat Gorontalo.",
        image: "https://images.unsplash.com/photo-1542897643-cfccd88c7127?w=120&h=80&fit=crop&auto=format",
    },
    {
        id: 2,
        title: "Upacara Adat Maulid",
        subtitle: "Tradisi & Ritual",
        description: "Perayaan Maulid Nabi dengan tradisi khas Gorontalo.",
        image: "https://images.unsplash.com/photo-1542897643-8158da5b4607?w=120&h=80&fit=crop&auto=format",
    },
    {
        id: 3,
        title: "Kerajinan Karawo",
        subtitle: "Seni Sulam",
        description: "Sulaman tangan khas Gorontalo yang dikerjakan dengan jarum halus.",
        image: "https://images.unsplash.com/photo-1524341661047-3a38ae8987f9?w=120&h=80&fit=crop&auto=format",
    },
];

export default function BudayaIndex() {
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {heritageItems.map((item) => (
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
                                <button className="flex-1 inline-flex items-center justify-center gap-1.5 border border-red-200 rounded-lg px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-50 hover:border-red-300 transition-colors">
                                    <Trash2 className="w-3 h-3" /> Hapus
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Layout>
    );
}
