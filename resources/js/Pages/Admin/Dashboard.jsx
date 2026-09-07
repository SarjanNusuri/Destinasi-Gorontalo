import { Head, Link } from "@inertiajs/react";
import Layout from "@/components/Admin/Layout";
import { MapPin, BedDouble, Star, Globe } from "lucide-react";

const stats = [
    { label: "Total Destinasi", value: "4", icon: MapPin, color: "text-goro-gold" },
    { label: "Total Hotel", value: "12", icon: BedDouble, color: "text-green-400" },
    { label: "Rata-rata Rating", value: "4.6", icon: Star, color: "text-yellow-400" },
    { label: "Kategori", value: "6", icon: Globe, color: "text-blue-400" },
];

const recentDestinations = [
    { id: 1, name: "Danau Limboto", tag: "ALAM", status: "Aktif" },
    { id: 2, name: "Pantai Olele", tag: "PANTAI", status: "Aktif" },
    { id: 3, name: "Benteng Otanaha", tag: "SEJARAH", status: "Aktif" },
    { id: 4, name: "Air Terjun Tapadaa", tag: "PETUALANGAN", status: "Aktif" },
];

export default function Dashboard() {
    return (
        <Layout>
            <Head title="Dashboard — Admin GO360" />

            <div className="mb-8">
                <h1 className="text-2xl font-display font-light text-primary-dark">
                    Dashboard
                </h1>
                <p className="text-sm text-forest-muted mt-1">
                    Selamat datang di panel admin Gorontalo Living Heritage.
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={stat.label}
                            className="rounded-2xl border border-sand bg-white p-5 shadow-sm"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs text-forest-muted">
                                    {stat.label}
                                </span>
                                <Icon className={`w-4 h-4 ${stat.color}`} />
                            </div>
                            <p className="text-2xl font-display font-light text-primary-dark">
                                {stat.value}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* Quick actions */}
            <div className="mb-8">
                <h2 className="text-sm font-semibold text-primary-dark mb-4">
                    Aksi Cepat
                </h2>
                <div className="flex gap-3">
                    <Link
                        href="/admin/destinations/create"
                        className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-light transition-colors"
                    >
                        + Tambah Destinasi
                    </Link>
                    <Link
                        href="/admin/destinations"
                        className="inline-flex items-center gap-2 border border-sand bg-white px-5 py-2.5 rounded-xl text-sm font-medium text-primary-dark hover:bg-cream transition-colors"
                    >
                        Lihat Semua Destinasi
                    </Link>
                </div>
            </div>

            {/* Recent destinations */}
            <div className="rounded-2xl border border-sand bg-white shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-sand">
                    <h2 className="text-sm font-semibold text-primary-dark">
                        Destinasi Terbaru
                    </h2>
                </div>
                <div className="divide-y divide-sand">
                    {recentDestinations.map((dest) => (
                        <div
                            key={dest.id}
                            className="flex items-center justify-between px-5 py-3 hover:bg-cream/50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-goro-gold/10 border border-goro-gold/20 flex items-center justify-center">
                                    <MapPin className="w-4 h-4 text-goro-gold" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-primary-dark">
                                        {dest.name}
                                    </p>
                                    <span className="font-mono text-[0.55rem] tracking-wider text-goro-gold uppercase">
                                        {dest.tag}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                    {dest.status}
                                </span>
                                <Link
                                    href={`/admin/destinations/${dest.id}/edit`}
                                    className="text-xs text-primary hover:text-primary-light transition-colors"
                                >
                                    Edit
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
}
