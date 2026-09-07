import { Head, Link, router, usePage } from "@inertiajs/react";
import Layout from "@/components/Admin/Layout";
import { Plus, MapPin, Pencil, Trash2, Star, BedDouble } from "lucide-react";

export default function HotelsIndex() {
    const { hotels } = usePage().props;

    const handleDelete = (id, name) => {
        if (!confirm(`Hapus hotel "${name}"?`)) return;
        router.delete(`/admin/hotels/${id}`, { preserveScroll: true });
    };

    return (
        <Layout>
            <Head title="Hotel — Admin GO360" />

            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-display font-light text-primary-dark">Hotel</h1>
                    <p className="text-sm text-forest-muted mt-1">Kelola semua penginapan di Gorontalo.</p>
                </div>
                <Link
                    href="/admin/hotels/create"
                    className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-light transition-colors"
                >
                    <Plus className="w-4 h-4" /> Tambah Hotel
                </Link>
            </div>

            <div className="rounded-2xl border border-sand bg-white shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-sand bg-cream/50">
                                <th className="text-left px-5 py-3 font-medium text-primary-dark">Hotel</th>
                                <th className="text-left px-5 py-3 font-medium text-primary-dark">Tipe</th>
                                <th className="text-left px-5 py-3 font-medium text-primary-dark">Destinasi Terdekat</th>
                                <th className="text-left px-5 py-3 font-medium text-primary-dark">Jarak</th>
                                <th className="text-left px-5 py-3 font-medium text-primary-dark">Rating</th>
                                <th className="text-left px-5 py-3 font-medium text-primary-dark">Harga</th>
                                <th className="text-right px-5 py-3 font-medium text-primary-dark">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-sand">
                            {hotels.map((hotel) => (
                                <tr key={hotel.id} className="hover:bg-cream/30 transition-colors">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            {hotel.image ? (
                                                <img src={hotel.image} alt={hotel.name} className="w-12 h-8 rounded-lg object-cover border border-sand" />
                                            ) : (
                                                <div className="w-12 h-8 rounded-lg bg-sand flex items-center justify-center">
                                                    <BedDouble className="w-4 h-4 text-forest-muted" />
                                                </div>
                                            )}
                                            <p className="font-medium text-primary-dark">{hotel.name}</p>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className="text-xs text-forest-muted">{hotel.type}</span>
                                    </td>
                                    <td className="px-5 py-4">
                                        {hotel.destination_name ? (
                                            <Link href={`/admin/destinations/${hotel.destination_id}/edit`} className="text-xs text-primary hover:underline">
                                                {hotel.destination_name}
                                            </Link>
                                        ) : (
                                            <span className="text-xs text-forest-muted/50">—</span>
                                        )}
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className="text-xs text-forest-muted">{hotel.distance ? `${hotel.distance} km` : '—'}</span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-1">
                                            <Star className="w-3 h-3 text-goro-gold fill-goro-gold" />
                                            <span className="text-xs text-primary-dark">{hotel.rating}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className="text-xs text-forest-muted">{hotel.price || '—'}</span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/admin/hotels/${hotel.id}/edit`}
                                                className="w-8 h-8 rounded-lg border border-sand flex items-center justify-center text-forest-muted hover:text-primary hover:border-primary/30 hover:bg-mint/50 transition-colors"
                                            >
                                                <Pencil className="w-3.5 h-3.5" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(hotel.id, hotel.name)}
                                                className="w-8 h-8 rounded-lg border border-sand flex items-center justify-center text-forest-muted hover:text-red-500 hover:border-red-300 hover:bg-red-50 transition-colors"
                                            >
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
