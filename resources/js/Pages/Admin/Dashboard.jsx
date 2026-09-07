import { Head, Link, usePage } from "@inertiajs/react";
import Layout from "@/components/Admin/Layout";
import { MapPin, BedDouble, Star, Globe, ArrowRight } from "lucide-react";

const CATEGORY_LABELS = {
    nature: "Alam",
    beach: "Pantai",
    history: "Sejarah",
    adventure: "Petualangan",
    culture: "Budaya",
    culinary: "Kuliner",
};

export default function Dashboard() {
    const { stats, recentDestinations, categories } = usePage().props;

    const statCards = [
        { label: "Total Destinasi", value: stats.destinations, icon: MapPin, color: "text-goro-gold", href: "/admin/destinations" },
        { label: "Total Penginapan", value: stats.hotels, icon: BedDouble, color: "text-green-400", href: "/admin/destinations" },
        { label: "Rata-rata Rating", value: stats.avg_rating, icon: Star, color: "text-yellow-400", href: "/admin/destinations" },
        { label: "Kategori", value: stats.categories, icon: Globe, color: "text-blue-400", href: "/admin/destinations" },
    ];

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
                {statCards.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Link
                            key={stat.label}
                            href={stat.href}
                            className="rounded-2xl border border-sand bg-white p-5 shadow-sm hover:shadow-md transition-shadow group"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs text-forest-muted font-medium">{stat.label}</span>
                                <div className="w-8 h-8 rounded-lg bg-cream flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Icon className={`w-4 h-4 ${stat.color}`} />
                                </div>
                            </div>
                            <p className="text-2xl font-display font-light text-primary-dark">{stat.value}</p>
                        </Link>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Destinations */}
                <div className="lg:col-span-2 rounded-2xl border border-sand bg-white shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-sand">
                        <h2 className="text-sm font-semibold text-primary-dark">Destinasi Terbaru</h2>
                        <Link href="/admin/destinations" className="text-xs text-primary hover:text-primary-light transition-colors flex items-center gap-1">
                            Lihat Semua <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>
                    <div className="divide-y divide-sand">
                        {recentDestinations.map((dest) => (
                            <Link
                                key={dest.id}
                                href={`/admin/destinations/${dest.id}/edit`}
                                className="flex items-center justify-between px-6 py-3.5 hover:bg-cream/30 transition-colors"
                            >
                                <div>
                                    <p className="text-sm font-medium text-primary-dark">{dest.name}</p>
                                    <span className="font-mono text-[0.55rem] tracking-wider text-goro-gold uppercase">{dest.tag}</span>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-forest-muted">
                                    <span className="flex items-center gap-1">
                                        <Star className="w-3 h-3 text-goro-gold" />
                                        {dest.rating}
                                    </span>
                                    <span>{dest.hotels_count} hotel</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Categories */}
                <div className="rounded-2xl border border-sand bg-white shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-sand">
                        <h2 className="text-sm font-semibold text-primary-dark">Kategori</h2>
                    </div>
                    <div className="divide-y divide-sand">
                        {Object.entries(categories).map(([key, count]) => (
                            <div key={key} className="flex items-center justify-between px-6 py-3.5">
                                <span className="text-sm text-primary-dark">{CATEGORY_LABELS[key] || key}</span>
                                <span className="text-xs text-forest-muted bg-cream rounded-full px-2.5 py-0.5">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 rounded-2xl border border-sand bg-white shadow-sm p-6">
                <h2 className="text-sm font-semibold text-primary-dark mb-4">Akses Cepat</h2>
                <div className="flex flex-wrap gap-3">
                    <Link
                        href="/admin/destinations/create"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-light transition-colors"
                    >
                        <MapPin className="w-4 h-4" /> Tambah Destinasi
                    </Link>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-sand text-sm text-primary-dark hover:bg-cream transition-colors"
                    >
                        <Globe className="w-4 h-4" /> Lihat Website
                    </Link>
                </div>
            </div>
        </Layout>
    );
}
