import { Head, Link } from "@inertiajs/react";
import Layout from "@/components/Admin/Layout";
import { Plus, MapPin, Pencil, Trash2, Star, BedDouble } from "lucide-react";

const destinations = [
    {
        id: 1,
        name: "Danau Limboto",
        tag: "ALAM",
        category: "nature",
        location: "Kabupaten Gorontalo",
        distance: "12 km",
        rating: 4.5,
        hotels: 3,
        image: "https://images.unsplash.com/photo-1630399477185-8135fa7c02ae?w=120&h=80&fit=crop&auto=format",
    },
    {
        id: 2,
        name: "Pantai Olele",
        tag: "PANTAI",
        category: "beach",
        location: "Kabila Bone",
        distance: "25 km",
        rating: 4.9,
        hotels: 3,
        image: "https://images.unsplash.com/photo-1627967464841-6b32176ddbe8?w=120&h=80&fit=crop&auto=format",
    },
    {
        id: 3,
        name: "Benteng Otanaha",
        tag: "SEJARAH",
        category: "history",
        location: "Kota Gorontalo",
        distance: "8 km",
        rating: 4.6,
        hotels: 3,
        image: "https://images.unsplash.com/photo-1628000190980-ca80ff499ecf?w=120&h=80&fit=crop&auto=format",
    },
    {
        id: 4,
        name: "Air Terjun Tapadaa",
        tag: "PETUALANGAN",
        category: "adventure",
        location: "Bone Bolango",
        distance: "35 km",
        rating: 4.7,
        hotels: 3,
        image: "https://images.unsplash.com/photo-1554931670-4ebfabf6e7a9?w=120&h=80&fit=crop&auto=format",
    },
];

export default function DestinationsIndex() {
    return (
        <Layout>
            <Head title="Destinasi — Admin GO360" />

            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-display font-light text-primary-dark">
                        Destinasi Wisata
                    </h1>
                    <p className="text-sm text-forest-muted mt-1">
                        Kelola semua destinasi wisata di Gorontalo.
                    </p>
                </div>
                <Link
                    href="/admin/destinations/create"
                    className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-light transition-colors"
                >
                    <Plus className="w-4 h-4" /> Tambah Destinasi
                </Link>
            </div>

            {/* Table */}
            <div className="rounded-2xl border border-sand bg-white shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-sand bg-cream/50">
                                <th className="text-left px-5 py-3 font-medium text-primary-dark">
                                    Destinasi
                                </th>
                                <th className="text-left px-5 py-3 font-medium text-primary-dark">
                                    Kategori
                                </th>
                                <th className="text-left px-5 py-3 font-medium text-primary-dark">
                                    Lokasi
                                </th>
                                <th className="text-left px-5 py-3 font-medium text-primary-dark">
                                    Rating
                                </th>
                                <th className="text-left px-5 py-3 font-medium text-primary-dark">
                                    Hotel
                                </th>
                                <th className="text-right px-5 py-3 font-medium text-primary-dark">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-sand">
                            {destinations.map((dest) => (
                                <tr key={dest.id} className="hover:bg-cream/30 transition-colors">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={dest.image}
                                                alt={dest.name}
                                                className="w-12 h-8 rounded-lg object-cover border border-sand"
                                            />
                                            <div>
                                                <p className="font-medium text-primary-dark">
                                                    {dest.name}
                                                </p>
                                                <span className="font-mono text-[0.55rem] tracking-wider text-goro-gold uppercase">
                                                    {dest.tag}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className="text-xs text-forest-muted capitalize">
                                            {dest.category}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className="text-xs text-forest-muted">
                                            {dest.location}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-1">
                                            <Star className="w-3 h-3 text-goro-gold fill-goro-gold" />
                                            <span className="text-xs text-primary-dark">
                                                {dest.rating}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-1">
                                            <BedDouble className="w-3 h-3 text-forest-muted" />
                                            <span className="text-xs text-forest-muted">
                                                {dest.hotels}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/admin/destinations/${dest.id}/edit`}
                                                className="w-8 h-8 rounded-lg border border-sand flex items-center justify-center text-forest-muted hover:text-primary hover:border-primary/30 hover:bg-mint/50 transition-colors"
                                            >
                                                <Pencil className="w-3.5 h-3.5" />
                                            </Link>
                                            <button className="w-8 h-8 rounded-lg border border-sand flex items-center justify-center text-forest-muted hover:text-red-500 hover:border-red-300 hover:bg-red-50 transition-colors">
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
}
