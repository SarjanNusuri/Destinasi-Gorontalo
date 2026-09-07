import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import Layout from "@/components/Admin/Layout";
import {
    ArrowLeft,
    Plus,
    X,
    MapPin,
    BedDouble,
    ChevronDown,
    ChevronUp,
    Image,
    Star,
    Globe,
    Save,
} from "lucide-react";

const CATEGORIES = [
    { value: "nature", label: "Alam" },
    { value: "beach", label: "Pantai" },
    { value: "history", label: "Sejarah" },
    { value: "adventure", label: "Petualangan" },
    { value: "culture", label: "Budaya" },
    { value: "culinary", label: "Kuliner" },
];

const sampleDestination = {
    id: 3,
    name: "Benteng Otanaha",
    category: "history",
    tag: "SEJARAH",
    distance: "8 km",
    description: "Benteng bersejarah peninggalan Portugis dengan pemandangan Teluk Gorontalo.",
    image: "https://images.unsplash.com/photo-1628000190980-ca80ff499ecf?w=600&h=400&fit=crop&auto=format",
    lat: "0.54",
    lng: "123.06",
    location: "Kota Gorontalo, Gorontalo",
    duration: "1–2 jam",
    rating: 4.6,
    highlights: [
        "235 anak tangga menuju puncak",
        "Panorama 360° Danau Limboto",
        "Situs cagar budaya nasional",
        "Arsitektur batu kapur abad ke-16",
        "Bendera tradisi di menara puncak",
    ],
    hotels: [
        {
            name: "Grand Gorontalo Hotel",
            type: "Hotel",
            description: "Hotel bintang 4 di pusat kota, 10 menit dari Benteng Otanaha.",
            price: "Rp 650.000/malam",
            rating: 4.5,
            distance: 2.8,
            duration: 7,
            lat: 0.542,
            lng: 123.058,
        },
        {
            name: "Rumah Adat Guesthouse",
            type: "Guesthouse",
            description: "Guesthouse bergaya tradisional Gorontalo di kaki bukit Otanaha.",
            price: "Rp 200.000/malam",
            rating: 4.3,
            distance: 1.5,
            duration: 4,
            lat: 0.541,
            lng: 123.061,
        },
    ],
};

export default function DestinationsEdit() {
    const [form, setForm] = useState({
        name: sampleDestination.name,
        category: sampleDestination.category,
        tag: sampleDestination.tag,
        distance: sampleDestination.distance,
        description: sampleDestination.description,
        image: sampleDestination.image,
        lat: sampleDestination.lat,
        lng: sampleDestination.lng,
        location: sampleDestination.location,
        duration: sampleDestination.duration,
        rating: sampleDestination.rating,
        highlights: [...sampleDestination.highlights],
    });

    const [hotels, setHotels] = useState(sampleDestination.hotels.map((h) => ({ ...h })));
    const [expandedHotel, setExpandedHotel] = useState(-1);

    const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

    const updateHighlight = (index, value) => {
        const next = [...form.highlights];
        next[index] = value;
        setForm((prev) => ({ ...prev, highlights: next }));
    };

    const addHotel = () => {
        setHotels((prev) => [
            ...prev,
            { name: "", type: "Hotel", description: "", price: "", rating: 4.0, distance: "", duration: "", lat: "", lng: "" },
        ]);
        setExpandedHotel(hotels.length);
    };

    const removeHotel = (index) => {
        setHotels((prev) => prev.filter((_, i) => i !== index));
        if (expandedHotel >= hotels.length - 1) setExpandedHotel(Math.max(0, hotels.length - 2));
    };

    const updateHotel = (index, field, value) => {
        setHotels((prev) => prev.map((h, i) => (i === index ? { ...h, [field]: value } : h)));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Berhasil diupdate (dummy)!");
        router.visit("/admin/destinations");
    };

    return (
        <Layout>
            <Head title={`Edit ${form.name} — Admin GO360`} />

            <div className="flex items-center justify-between mb-8">
                <div>
                    <Link
                        href="/admin/destinations"
                        className="inline-flex items-center gap-2 text-sm text-forest-muted hover:text-primary-dark transition-colors mb-2"
                    >
                        <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar
                    </Link>
                    <h1 className="text-2xl font-display font-light text-primary-dark">
                        Edit Destinasi
                    </h1>
                    <p className="text-xs text-forest-muted mt-1">
                        Mengedit <strong className="text-primary-dark">{form.name}</strong>
                    </p>
                </div>
                <button
                    type="submit"
                    form="dest-edit-form"
                    className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-light transition-colors shadow-sm"
                >
                    <Save className="w-4 h-4" /> Update
                </button>
            </div>

            <form id="dest-edit-form" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Left column */}
                    <div className="xl:col-span-2 space-y-6">
                        {/* Basic Info */}
                        <div className="rounded-2xl border border-sand bg-white p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-5">
                                <div className="w-8 h-8 rounded-lg bg-goro-gold/10 flex items-center justify-center">
                                    <Globe className="w-4 h-4 text-goro-gold" />
                                </div>
                                <h2 className="text-sm font-semibold text-primary-dark">Informasi Dasar</h2>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs text-forest-muted block mb-1.5">Nama Destinasi</label>
                                    <input
                                        type="text"
                                        value={form.name}
                                        onChange={(e) => update("name", e.target.value)}
                                        className="w-full border border-sand rounded-xl px-4 py-3 text-sm text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-forest-muted block mb-1.5">Kategori</label>
                                        <select
                                            value={form.category}
                                            onChange={(e) => update("category", e.target.value)}
                                            className="w-full border border-sand rounded-xl px-4 py-3 text-sm text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all bg-white"
                                        >
                                            {CATEGORIES.map((c) => (
                                                <option key={c.value} value={c.value}>{c.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs text-forest-muted block mb-1.5">Tag</label>
                                        <input
                                            type="text"
                                            value={form.tag}
                                            onChange={(e) => update("tag", e.target.value.toUpperCase())}
                                            className="w-full border border-sand rounded-xl px-4 py-3 text-sm text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all uppercase"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-forest-muted block mb-1.5">Deskripsi</label>
                                    <textarea
                                        rows={4}
                                        value={form.description}
                                        onChange={(e) => update("description", e.target.value)}
                                        className="w-full border border-sand rounded-xl px-4 py-3 text-sm text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="rounded-2xl border border-sand bg-white p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-5">
                                <div className="w-8 h-8 rounded-lg bg-goro-gold/10 flex items-center justify-center">
                                    <MapPin className="w-4 h-4 text-goro-gold" />
                                </div>
                                <h2 className="text-sm font-semibold text-primary-dark">Lokasi & Koordinat</h2>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs text-forest-muted block mb-1.5">Alamat</label>
                                    <input
                                        type="text"
                                        value={form.location}
                                        onChange={(e) => update("location", e.target.value)}
                                        className="w-full border border-sand rounded-xl px-4 py-3 text-sm text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-forest-muted block mb-1.5">Latitude</label>
                                        <input type="number" step="0.0001" value={form.lat} onChange={(e) => update("lat", e.target.value)} className="w-full border border-sand rounded-xl px-4 py-3 text-sm text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all" />
                                    </div>
                                    <div>
                                        <label className="text-xs text-forest-muted block mb-1.5">Longitude</label>
                                        <input type="number" step="0.0001" value={form.lng} onChange={(e) => update("lng", e.target.value)} className="w-full border border-sand rounded-xl px-4 py-3 text-sm text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div>
                                        <label className="text-xs text-forest-muted block mb-1.5">Jarak</label>
                                        <input type="text" value={form.distance} onChange={(e) => update("distance", e.target.value)} className="w-full border border-sand rounded-xl px-4 py-3 text-sm text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all" />
                                    </div>
                                    <div>
                                        <label className="text-xs text-forest-muted block mb-1.5">Durasi</label>
                                        <input type="text" value={form.duration} onChange={(e) => update("duration", e.target.value)} className="w-full border border-sand rounded-xl px-4 py-3 text-sm text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all" />
                                    </div>
                                    <div>
                                        <label className="text-xs text-forest-muted block mb-1.5">Rating</label>
                                        <input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={(e) => update("rating", parseFloat(e.target.value))} className="w-full border border-sand rounded-xl px-4 py-3 text-sm text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Highlights */}
                        <div className="rounded-2xl border border-sand bg-white p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-5">
                                <div className="w-8 h-8 rounded-lg bg-goro-gold/10 flex items-center justify-center">
                                    <Star className="w-4 h-4 text-goro-gold" />
                                </div>
                                <h2 className="text-sm font-semibold text-primary-dark">Highlights</h2>
                            </div>
                            <div className="space-y-3">
                                {form.highlights.map((h, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <span className="w-7 h-7 rounded-lg bg-goro-gold/10 border border-goro-gold/20 flex items-center justify-center text-[0.6rem] text-goro-gold font-mono shrink-0">
                                            {i + 1}
                                        </span>
                                        <input
                                            type="text"
                                            value={h}
                                            onChange={(e) => updateHighlight(i, e.target.value)}
                                            className="flex-1 border border-sand rounded-xl px-4 py-2.5 text-sm text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right column */}
                    <div className="space-y-6">
                        {/* Image */}
                        <div className="rounded-2xl border border-sand bg-white p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-5">
                                <div className="w-8 h-8 rounded-lg bg-goro-gold/10 flex items-center justify-center">
                                    <Image className="w-4 h-4 text-goro-gold" />
                                </div>
                                <h2 className="text-sm font-semibold text-primary-dark">Gambar</h2>
                            </div>
                            <input
                                type="url"
                                value={form.image}
                                onChange={(e) => update("image", e.target.value)}
                                className="w-full border border-sand rounded-xl px-4 py-3 text-sm text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all mb-4"
                            />
                            {form.image ? (
                                <img src={form.image} alt="Preview" className="w-full h-40 rounded-xl object-cover border border-sand" />
                            ) : (
                                <div className="w-full h-40 rounded-xl border-2 border-dashed border-sand flex flex-col items-center justify-center text-forest-muted/40">
                                    <Image className="w-8 h-8 mb-2" />
                                    <span className="text-xs">Preview gambar</span>
                                </div>
                            )}
                        </div>

                        {/* Hotels */}
                        <div className="rounded-2xl border border-sand bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-5">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-goro-gold/10 flex items-center justify-center">
                                        <BedDouble className="w-4 h-4 text-goro-gold" />
                                    </div>
                                    <h2 className="text-sm font-semibold text-primary-dark">Penginapan ({hotels.length})</h2>
                                </div>
                                <button type="button" onClick={addHotel} className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary-light transition-colors font-medium">
                                    <Plus className="w-3.5 h-3.5" /> Tambah
                                </button>
                            </div>
                            <div className="space-y-2">
                                {hotels.map((hotel, i) => (
                                    <div key={i} className="border border-sand rounded-xl overflow-hidden">
                                        <button
                                            type="button"
                                            onClick={() => setExpandedHotel(expandedHotel === i ? -1 : i)}
                                            className="w-full flex items-center justify-between px-4 py-3 hover:bg-cream/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-2 min-w-0">
                                                <BedDouble className="w-4 h-4 text-goro-gold shrink-0" />
                                                <span className="text-sm font-medium text-primary-dark truncate">{hotel.name || `Hotel ${i + 1}`}</span>
                                            </div>
                                            {expandedHotel === i ? <ChevronUp className="w-4 h-4 text-forest-muted shrink-0" /> : <ChevronDown className="w-4 h-4 text-forest-muted shrink-0" />}
                                        </button>
                                        {expandedHotel === i && (
                                            <div className="px-4 pb-4 pt-2 border-t border-sand space-y-3">
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="text-[0.65rem] text-forest-muted block mb-1">Nama</label>
                                                        <input type="text" value={hotel.name} onChange={(e) => updateHotel(i, "name", e.target.value)} className="w-full border border-sand rounded-lg px-3 py-2 text-xs text-primary-dark placeholder:text-forest-muted/40 focus:outline-none focus:ring-1 focus:ring-primary/20" />
                                                    </div>
                                                    <div>
                                                        <label className="text-[0.65rem] text-forest-muted block mb-1">Tipe</label>
                                                        <select value={hotel.type} onChange={(e) => updateHotel(i, "type", e.target.value)} className="w-full border border-sand rounded-lg px-3 py-2 text-xs text-primary-dark focus:outline-none focus:ring-1 focus:ring-primary/20 bg-white">
                                                            {["Hotel", "Homestay", "Villa", "Resort", "Guesthouse", "Eco Lodge"].map((t) => (
                                                                <option key={t} value={t}>{t}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="text-[0.65rem] text-forest-muted block mb-1">Deskripsi</label>
                                                    <textarea rows={2} value={hotel.description} onChange={(e) => updateHotel(i, "description", e.target.value)} className="w-full border border-sand rounded-lg px-3 py-2 text-xs text-primary-dark placeholder:text-forest-muted/40 focus:outline-none focus:ring-1 focus:ring-primary/20 resize-none" />
                                                </div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="text-[0.65rem] text-forest-muted block mb-1">Harga</label>
                                                        <input type="text" value={hotel.price} onChange={(e) => updateHotel(i, "price", e.target.value)} className="w-full border border-sand rounded-lg px-3 py-2 text-xs text-primary-dark placeholder:text-forest-muted/40 focus:outline-none focus:ring-1 focus:ring-primary/20" />
                                                    </div>
                                                    <div>
                                                        <label className="text-[0.65rem] text-forest-muted block mb-1">Rating</label>
                                                        <input type="number" step="0.1" min="0" max="5" value={hotel.rating} onChange={(e) => updateHotel(i, "rating", parseFloat(e.target.value))} className="w-full border border-sand rounded-lg px-3 py-2 text-xs text-primary-dark focus:outline-none focus:ring-1 focus:ring-primary/20" />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-3 gap-3">
                                                    <div>
                                                        <label className="text-[0.65rem] text-forest-muted block mb-1">Jarak (km)</label>
                                                        <input type="number" step="0.1" value={hotel.distance} onChange={(e) => updateHotel(i, "distance", e.target.value)} className="w-full border border-sand rounded-lg px-3 py-2 text-xs text-primary-dark focus:outline-none focus:ring-1 focus:ring-primary/20" />
                                                    </div>
                                                    <div>
                                                        <label className="text-[0.65rem] text-forest-muted block mb-1">Durasi (mnt)</label>
                                                        <input type="number" value={hotel.duration} onChange={(e) => updateHotel(i, "duration", e.target.value)} className="w-full border border-sand rounded-lg px-3 py-2 text-xs text-primary-dark focus:outline-none focus:ring-1 focus:ring-primary/20" />
                                                    </div>
                                                    <div className="flex items-end">
                                                        {hotels.length > 1 && (
                                                            <button type="button" onClick={() => removeHotel(i)} className="w-full h-[34px] rounded-lg border border-red-200 text-red-400 hover:bg-red-50 hover:border-red-300 transition-colors flex items-center justify-center">
                                                                <X className="w-3.5 h-3.5" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="text-[0.65rem] text-forest-muted block mb-1">Lat</label>
                                                        <input type="number" step="0.0001" value={hotel.lat} onChange={(e) => updateHotel(i, "lat", e.target.value)} className="w-full border border-sand rounded-lg px-3 py-2 text-xs text-primary-dark focus:outline-none focus:ring-1 focus:ring-primary/20" />
                                                    </div>
                                                    <div>
                                                        <label className="text-[0.65rem] text-forest-muted block mb-1">Lng</label>
                                                        <input type="number" step="0.0001" value={hotel.lng} onChange={(e) => updateHotel(i, "lng", e.target.value)} className="w-full border border-sand rounded-lg px-3 py-2 text-xs text-primary-dark focus:outline-none focus:ring-1 focus:ring-primary/20" />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </Layout>
    );
}
