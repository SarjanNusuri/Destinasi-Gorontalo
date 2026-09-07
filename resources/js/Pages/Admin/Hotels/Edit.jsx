import { Head, Link, router, usePage } from "@inertiajs/react";
import { useState, useCallback, useRef } from "react";
import Layout from "@/components/Admin/Layout";
import {
    ArrowLeft,
    MapPin,
    Image,
    Star,
    Save,
    Trash2,
    BedDouble,
    CheckCircle,
    AlertCircle,
    Link as LinkIcon,
    Upload,
    X,
} from "lucide-react";

const HOTEL_TYPES = ["Hotel", "Homestay", "Villa", "Resort", "Guesthouse", "Eco Lodge"];

function parseGoogleMapsUrl(url) {
    if (!url) return null;
    let m;
    if ((m = url.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/))) {
        return { lat: parseFloat(m[1]), lng: parseFloat(m[2]) };
    }
    if ((m = url.match(/[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/))) {
        return { lat: parseFloat(m[1]), lng: parseFloat(m[2]) };
    }
    if ((m = url.match(/[?&]ll=(-?\d+\.?\d*),(-?\d+\.?\d*)/))) {
        return { lat: parseFloat(m[1]), lng: parseFloat(m[2]) };
    }
    return null;
}

export default function HotelsEdit() {
    const { hotel, nearest } = usePage().props;

    const [form, setForm] = useState({
        name: hotel.name || "",
        type: hotel.type || "Hotel",
        description: hotel.description || "",
        price: hotel.price || "",
        rating: hotel.rating || 4.0,
        image: hotel.image || "",
        map_url: hotel.map_url || "",
        lat: hotel.lat || "",
        lng: hotel.lng || "",
    });

    const [parseStatus, setParseStatus] = useState(null);
    const [imageMode, setImageMode] = useState("url");
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);

    const update = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        if (field === "map_url") setParseStatus(null);
    };

    const handleParseUrl = useCallback(() => {
        const coords = parseGoogleMapsUrl(form.map_url);
        if (coords) {
            setForm((prev) => ({ ...prev, lat: coords.lat, lng: coords.lng }));
            setParseStatus("success");
        } else if (form.map_url.trim()) {
            setParseStatus("error");
        }
    }, [form.map_url]);

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
            router.post(`/admin/hotels/${hotel.id}`, formData, {
                forceFormData: true,
            });
        } else {
            router.put(`/admin/hotels/${hotel.id}`, form);
        }
    };

    const handleDelete = () => {
        if (!confirm(`Hapus hotel "${hotel.name}"?`)) return;
        router.delete(`/admin/hotels/${hotel.id}`);
    };

    return (
        <Layout>
            <Head title={`Edit ${hotel.name} — Admin GO360`} />

            <div className="flex items-center justify-between mb-8">
                <div>
                    <Link href="/admin/hotels" className="inline-flex items-center gap-2 text-sm text-forest-muted hover:text-primary-dark transition-colors mb-2">
                        <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar
                    </Link>
                    <h1 className="text-2xl font-display font-light text-primary-dark">Edit Hotel</h1>
                    <p className="text-sm text-forest-muted mt-1">{hotel.name}</p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={handleDelete} className="inline-flex items-center gap-2 border border-red-200 text-red-500 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-red-50 hover:border-red-300 transition-colors">
                        <Trash2 className="w-4 h-4" /> Hapus
                    </button>
                    <button type="submit" form="hotel-form" className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-light transition-colors shadow-sm">
                        <Save className="w-4 h-4" /> Update
                    </button>
                </div>
            </div>

            {/* Nearest Destination Info */}
            {nearest && (
                <div className="rounded-2xl border border-goro-gold/30 bg-goro-gold/5 p-4 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-goro-gold/10 flex items-center justify-center shrink-0">
                            <MapPin className="w-5 h-5 text-goro-gold" />
                        </div>
                        <div>
                            <p className="text-sm text-primary-dark">
                                Destinasi terdekat: <Link href={`/admin/destinations/${nearest.id}/edit`} className="font-semibold text-primary hover:underline">{nearest.name}</Link>
                            </p>
                            <p className="text-xs text-forest-muted">Jarak: {nearest.distance} km · Tag: {nearest.tag}</p>
                        </div>
                    </div>
                </div>
            )}

            <form id="hotel-form" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Left column */}
                    <div className="xl:col-span-2 space-y-6">
                        {/* Basic Info */}
                        <div className="rounded-2xl border border-sand bg-white p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-5">
                                <div className="w-8 h-8 rounded-lg bg-goro-gold/10 flex items-center justify-center">
                                    <BedDouble className="w-4 h-4 text-goro-gold" />
                                </div>
                                <h2 className="text-sm font-semibold text-primary-dark">Informasi Hotel</h2>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs text-forest-muted block mb-1.5">Nama Hotel</label>
                                    <input type="text" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Contoh: Grand Gorontalo Hotel" className="w-full border border-sand rounded-xl px-4 py-3 text-sm text-primary-dark placeholder:text-forest-muted/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all" />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-forest-muted block mb-1.5">Tipe</label>
                                        <select value={form.type} onChange={(e) => update("type", e.target.value)} className="w-full border border-sand rounded-xl px-4 py-3 text-sm text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all bg-white">
                                            {HOTEL_TYPES.map((t) => (
                                                <option key={t} value={t}>{t}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs text-forest-muted block mb-1.5">Rating</label>
                                        <input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={(e) => update("rating", parseFloat(e.target.value))} className="w-full border border-sand rounded-xl px-4 py-3 text-sm text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-forest-muted block mb-1.5">Harga</label>
                                    <input type="text" value={form.price} onChange={(e) => update("price", e.target.value)} placeholder="Rp 350.000/malam" className="w-full border border-sand rounded-xl px-4 py-3 text-sm text-primary-dark placeholder:text-forest-muted/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all" />
                                </div>
                                <div>
                                    <label className="text-xs text-forest-muted block mb-1.5">Deskripsi</label>
                                    <textarea rows={3} value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Deskripsi hotel..." className="w-full border border-sand rounded-xl px-4 py-3 text-sm text-primary-dark placeholder:text-forest-muted/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all resize-none" />
                                </div>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="rounded-2xl border border-sand bg-white p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-5">
                                <div className="w-8 h-8 rounded-lg bg-goro-gold/10 flex items-center justify-center">
                                    <MapPin className="w-4 h-4 text-goro-gold" />
                                </div>
                                <h2 className="text-sm font-semibold text-primary-dark">Lokasi</h2>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs text-forest-muted block mb-1.5">Link Google Maps</label>
                                    <div className="flex gap-2">
                                        <input type="url" value={form.map_url} onChange={(e) => update("map_url", e.target.value)} onBlur={() => form.map_url.trim() && handleParseUrl()} placeholder="https://www.google.com/maps/place/..." className="flex-1 border border-sand rounded-xl px-4 py-3 text-sm text-primary-dark placeholder:text-forest-muted/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all" />
                                        <button type="button" onClick={handleParseUrl} className="px-4 py-3 rounded-xl border border-sand bg-cream hover:bg-sand text-sm text-primary-dark font-medium transition-colors shrink-0">
                                            Ambil Koordinat
                                        </button>
                                    </div>
                                    {parseStatus === "success" && (
                                        <p className="flex items-center gap-1.5 text-[0.65rem] text-green-600 mt-1.5">
                                            <CheckCircle className="w-3 h-3" /> Koordinat berhasil diambil
                                        </p>
                                    )}
                                    {parseStatus === "error" && (
                                        <p className="flex items-center gap-1.5 text-[0.65rem] text-red-500 mt-1.5">
                                            <AlertCircle className="w-3 h-3" /> Tidak dapat mengambil koordinat
                                        </p>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-forest-muted block mb-1.5">Latitude</label>
                                        <input type="number" step="0.000001" value={form.lat} onChange={(e) => update("lat", e.target.value)} className="w-full border border-sand rounded-xl px-4 py-3 text-sm text-primary-dark placeholder:text-forest-muted/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all" />
                                    </div>
                                    <div>
                                        <label className="text-xs text-forest-muted block mb-1.5">Longitude</label>
                                        <input type="number" step="0.000001" value={form.lng} onChange={(e) => update("lng", e.target.value)} className="w-full border border-sand rounded-xl px-4 py-3 text-sm text-primary-dark placeholder:text-forest-muted/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all" />
                                    </div>
                                </div>
                                <p className="text-[0.65rem] text-forest-muted/60 italic">
                                    Jarak dari pusat kota dihitung otomatis. Destinasi terdekat juga otomatis terhubung.
                                </p>
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
                                <h2 className="text-sm font-semibold text-primary-dark">Foto Hotel</h2>
                            </div>

                            {/* Toggle URL / File */}
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
                                    <input type="url" value={form.image} onChange={(e) => update("image", e.target.value)} placeholder="https://example.com/hotel.jpg" className="w-full border border-sand rounded-xl px-4 py-3 text-sm text-primary-dark placeholder:text-forest-muted/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all mb-4" />
                                    {form.image ? (
                                        <img src={form.image} alt="Preview" className="w-full h-40 rounded-xl object-cover border border-sand" />
                                    ) : (
                                        <div className="w-full h-40 rounded-xl border-2 border-dashed border-sand flex flex-col items-center justify-center text-forest-muted/40">
                                            <Image className="w-8 h-8 mb-2" />
                                            <span className="text-xs">Preview foto</span>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <>
                                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" id="hotel-image-upload" />
                                    {imageFile ? (
                                        <div className="relative w-full h-40 rounded-xl overflow-hidden border border-sand group">
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
                                        <label htmlFor="hotel-image-upload" className="flex flex-col items-center justify-center w-full h-40 rounded-xl border-2 border-dashed border-sand hover:border-primary/40 cursor-pointer transition-colors">
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
