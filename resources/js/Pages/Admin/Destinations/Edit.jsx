import { Head, Link, router, usePage } from "@inertiajs/react";
import { useState, useCallback, useRef } from "react";
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
    Link as LinkIcon,
    Upload,
    Globe,
    Save,
    Trash2,
    Box,
    CheckCircle,
    AlertCircle,
} from "lucide-react";

const CATEGORIES = [
    { value: "nature", label: "Alam" },
    { value: "beach", label: "Pantai" },
    { value: "history", label: "Sejarah" },
    { value: "adventure", label: "Petualangan" },
    { value: "culture", label: "Budaya" },
    { value: "culinary", label: "Kuliner" },
];

const SCENE_TYPES = [
    { value: "", label: "Tanpa 3D" },
    { value: "lake", label: "Danau" },
    { value: "coral", label: "Terumbu Karang" },
    { value: "fort", label: "Benteng" },
    { value: "waterfall", label: "Air Terjun" },
];

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

export default function DestinationsEdit() {
    const { destination } = usePage().props;

    const [form, setForm] = useState({
        name: destination.name || "",
        category: destination.category || "nature",
        tag: destination.tag || "",
        description: destination.description || "",
        image: destination.image || "",
        map_url: destination.map_url || "",
        lat: destination.lat || "",
        lng: destination.lng || "",
        location: destination.location || "",
        duration: destination.duration || "",
        rating: destination.rating || 4.0,
        highlights: destination.highlights?.length
            ? [...destination.highlights, "", "", "", ""].slice(0, 5)
            : ["", "", "", "", ""],
        scene_type: destination.scene_type || "",
        water_color: destination.water_color || "#1f7d78",
        fog_color: destination.fog_color || "#0a2a32",
        terrain_color: destination.terrain_color || "#2f8f5b",
        model_3d_url: destination.model_3d_url || "",
    });

    const [parseStatus, setParseStatus] = useState(null);

    const [hotels, setHotels] = useState(
        destination.hotels?.length
            ? destination.hotels.map((h) => ({
                id: h.id,
                name: h.name || "",
                type: h.type || "Hotel",
                description: h.description || "",
                price: h.price || "",
                rating: h.rating || 4.0,
                distance: h.distance || "",
                duration: h.duration || "",
                lat: h.lat || "",
                lng: h.lng || "",
            }))
            : []
    );
    const [expandedHotel, setExpandedHotel] = useState(-1);

    const [imageMode, setImageMode] = useState("url");
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);

    const update = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        if (field === "map_url") {
            setParseStatus(null);
        }
    };

    const handleParseUrl = useCallback(() => {
        const coords = parseGoogleMapsUrl(form.map_url);
        if (coords) {
            setForm((prev) => ({
                ...prev,
                lat: coords.lat,
                lng: coords.lng,
            }));
            setParseStatus("success");
        } else if (form.map_url.trim()) {
            setParseStatus("error");
        }
    }, [form.map_url]);

    const updateHighlight = (index, value) => {
        const next = [...form.highlights];
        next[index] = value;
        setForm((prev) => ({ ...prev, highlights: next }));
    };

    const addHotel = () => {
        setHotels((prev) => [...prev, { name: "", type: "Hotel", description: "", price: "", rating: 4.0, distance: "", duration: "", lat: "", lng: "" }]);
        setExpandedHotel(hotels.length);
    };

    const removeHotel = (index) => {
        setHotels((prev) => prev.filter((_, i) => i !== index));
        if (expandedHotel >= hotels.length - 1) {
            setExpandedHotel(Math.max(0, hotels.length - 2));
        }
    };

    const updateHotel = (index, field, value) => {
        setHotels((prev) => prev.map((h, i) => (i === index ? { ...h, [field]: value } : h)));
    };

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
        const filteredHighlights = form.highlights.filter((h) => h.trim() !== "");
        const filteredHotels = hotels.filter((h) => h.name.trim() !== "");
        if (imageFile) {
            const formData = new FormData();
            formData.append("_method", "PUT");
            Object.entries({
                ...form,
                highlights: filteredHighlights,
                hotels: filteredHotels,
            }).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    value.forEach((v, i) => formData.append(`${key}[${i}]`, v));
                } else if (value !== "" && value !== null && value !== undefined) {
                    formData.append(key, value);
                }
            });
            formData.append("image_file", imageFile);
            router.post(`/admin/destinations/${form.id}`, formData, {
                forceFormData: true,
            });
        } else {
            router.put(`/admin/destinations/${destination.id}`, {
                ...form,
                highlights: filteredHighlights,
                hotels: filteredHotels,
            });
        }
    };

    const handleDelete = () => {
        if (!confirm(`Hapus destinasi "${destination.name}"? Semua hotel terkait juga akan dihapus.`)) return;
        router.delete(`/admin/destinations/${destination.id}`);
    };

    return (
        <Layout>
            <Head title={`Edit ${destination.name} — Admin GO360`} />

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
                    <p className="text-sm text-forest-muted mt-1">{destination.name}</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleDelete}
                        className="inline-flex items-center gap-2 border border-red-200 text-red-500 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-red-50 hover:border-red-300 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" /> Hapus
                    </button>
                    <button
                        type="submit"
                        form="dest-form"
                        className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-light transition-colors shadow-sm"
                    >
                        <Save className="w-4 h-4" /> Update
                    </button>
                </div>
            </div>

            <form id="dest-form" onSubmit={handleSubmit}>
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
                                    <input type="text" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Contoh: Danau Limboto" className="w-full border border-sand rounded-xl px-4 py-3 text-sm text-primary-dark placeholder:text-forest-muted/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all" />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-forest-muted block mb-1.5">Kategori</label>
                                        <select value={form.category} onChange={(e) => update("category", e.target.value)} className="w-full border border-sand rounded-xl px-4 py-3 text-sm text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all bg-white">
                                            {CATEGORIES.map((c) => (
                                                <option key={c.value} value={c.value}>{c.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs text-forest-muted block mb-1.5">Tag</label>
                                        <input type="text" value={form.tag} onChange={(e) => update("tag", e.target.value.toUpperCase())} placeholder="ALAM" className="w-full border border-sand rounded-xl px-4 py-3 text-sm text-primary-dark placeholder:text-forest-muted/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all uppercase" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-forest-muted block mb-1.5">Deskripsi</label>
                                    <textarea rows={4} value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Deskripsi singkat destinasi wisata..." className="w-full border border-sand rounded-xl px-4 py-3 text-sm text-primary-dark placeholder:text-forest-muted/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all resize-none" />
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
                                        <input
                                            type="url"
                                            value={form.map_url}
                                            onChange={(e) => update("map_url", e.target.value)}
                                            onBlur={() => form.map_url.trim() && handleParseUrl()}
                                            placeholder="https://www.google.com/maps/place/..."
                                            className="flex-1 border border-sand rounded-xl px-4 py-3 text-sm text-primary-dark placeholder:text-forest-muted/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleParseUrl}
                                            className="px-4 py-3 rounded-xl border border-sand bg-cream hover:bg-sand text-sm text-primary-dark font-medium transition-colors shrink-0"
                                        >
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
                                            <AlertCircle className="w-3 h-3" /> Tidak dapat mengambil koordinat dari link ini
                                        </p>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-forest-muted block mb-1.5">Latitude</label>
                                        <input type="number" step="0.000001" value={form.lat} onChange={(e) => update("lat", e.target.value)} placeholder="0.5333" className="w-full border border-sand rounded-xl px-4 py-3 text-sm text-primary-dark placeholder:text-forest-muted/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all" />
                                    </div>
                                    <div>
                                        <label className="text-xs text-forest-muted block mb-1.5">Longitude</label>
                                        <input type="number" step="0.000001" value={form.lng} onChange={(e) => update("lng", e.target.value)} placeholder="123.0333" className="w-full border border-sand rounded-xl px-4 py-3 text-sm text-primary-dark placeholder:text-forest-muted/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all" />
                                    </div>
                                </div>
                                <p className="text-[0.65rem] text-forest-muted/60 italic">
                                    Jarak otomatis dihitung dari pusat kota Gorontalo (-0.5407, 123.0558)
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-forest-muted block mb-1.5">Alamat / Lokasi</label>
                                        <input type="text" value={form.location} onChange={(e) => update("location", e.target.value)} placeholder="Kabupaten Gorontalo, Gorontalo" className="w-full border border-sand rounded-xl px-4 py-3 text-sm text-primary-dark placeholder:text-forest-muted/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all" />
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
                                        <input type="text" value={h} onChange={(e) => updateHighlight(i, e.target.value)} placeholder={`Highlight ${i + 1}`} className="flex-1 border border-sand rounded-xl px-4 py-2.5 text-sm text-primary-dark placeholder:text-forest-muted/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all" />
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
                                    <input type="url" value={form.image} onChange={(e) => update("image", e.target.value)} placeholder="https://example.com/image.jpg" className="w-full border border-sand rounded-xl px-4 py-3 text-sm text-primary-dark placeholder:text-forest-muted/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all mb-4" />
                                    {form.image ? (
                                        <img src={form.image} alt="Preview" className="w-full h-40 rounded-xl object-cover border border-sand" />
                                    ) : (
                                        <div className="w-full h-40 rounded-xl border-2 border-dashed border-sand flex flex-col items-center justify-center text-forest-muted/40">
                                            <Image className="w-8 h-8 mb-2" />
                                            <span className="text-xs">Preview gambar</span>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <>
                                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" id="dest-image-upload" />
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
                                        <label htmlFor="dest-image-upload" className="flex flex-col items-center justify-center w-full h-40 rounded-xl border-2 border-dashed border-sand hover:border-primary/40 cursor-pointer transition-colors">
                                            <Upload className="w-8 h-8 text-forest-muted/40 mb-2" />
                                            <span className="text-xs text-forest-muted/60">Klik untuk pilih gambar</span>
                                            <span className="text-[0.6rem] text-forest-muted/40 mt-1">JPG, PNG, max 2MB</span>
                                        </label>
                                    )}
                                </>
                            )}
                        </div>

                        {/* 3D Diorama Config */}
                        <div className="rounded-2xl border border-sand bg-white p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-5">
                                <div className="w-8 h-8 rounded-lg bg-goro-gold/10 flex items-center justify-center">
                                    <Box className="w-4 h-4 text-goro-gold" />
                                </div>
                                <h2 className="text-sm font-semibold text-primary-dark">Diorama 3D</h2>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs text-forest-muted block mb-1.5">Tipe Scene</label>
                                    <select value={form.scene_type} onChange={(e) => update("scene_type", e.target.value)} className="w-full border border-sand rounded-xl px-4 py-3 text-sm text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all bg-white">
                                        {SCENE_TYPES.map((s) => (
                                            <option key={s.value} value={s.value}>{s.label}</option>
                                        ))}
                                    </select>
                                </div>
                                {form.scene_type && (
                                    <>
                                        <div className="grid grid-cols-3 gap-3">
                                            <div>
                                                <label className="text-xs text-forest-muted block mb-1.5">Warna Air</label>
                                                <div className="flex items-center gap-2">
                                                    <input type="color" value={form.water_color} onChange={(e) => update("water_color", e.target.value)} className="w-9 h-9 rounded-lg border border-sand cursor-pointer" />
                                                    <span className="text-[0.6rem] text-forest-muted font-mono">{form.water_color}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-xs text-forest-muted block mb-1.5">Warna Kabut</label>
                                                <div className="flex items-center gap-2">
                                                    <input type="color" value={form.fog_color} onChange={(e) => update("fog_color", e.target.value)} className="w-9 h-9 rounded-lg border border-sand cursor-pointer" />
                                                    <span className="text-[0.6rem] text-forest-muted font-mono">{form.fog_color}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-xs text-forest-muted block mb-1.5">Warna Terrain</label>
                                                <div className="flex items-center gap-2">
                                                    <input type="color" value={form.terrain_color} onChange={(e) => update("terrain_color", e.target.value)} className="w-9 h-9 rounded-lg border border-sand cursor-pointer" />
                                                    <span className="text-[0.6rem] text-forest-muted font-mono">{form.terrain_color}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs text-forest-muted block mb-1.5">URL Model 3D (opsional)</label>
                                            <input type="url" value={form.model_3d_url} onChange={(e) => update("model_3d_url", e.target.value)} placeholder="https://example.com/model.glb" className="w-full border border-sand rounded-xl px-4 py-3 text-sm text-primary-dark placeholder:text-forest-muted/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all" />
                                            <p className="text-[0.6rem] text-forest-muted/60 mt-1.5">Format: GLB/GLTF. Kosongkan untuk menggunakan scene procedural default.</p>
                                        </div>
                                    </>
                                )}
                            </div>
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
                                {hotels.length === 0 && (
                                    <p className="text-xs text-forest-muted/60 text-center py-4">Belum ada penginapan. Klik "Tambah" untuk menambahkan.</p>
                                )}
                                {hotels.map((hotel, i) => (
                                    <div key={i} className="border border-sand rounded-xl overflow-hidden">
                                        <button type="button" onClick={() => setExpandedHotel(expandedHotel === i ? -1 : i)} className="w-full flex items-center justify-between px-4 py-3 hover:bg-cream/50 transition-colors">
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
                                                        <input type="text" value={hotel.name} onChange={(e) => updateHotel(i, "name", e.target.value)} placeholder="Nama hotel" className="w-full border border-sand rounded-lg px-3 py-2 text-xs text-primary-dark placeholder:text-forest-muted/40 focus:outline-none focus:ring-1 focus:ring-primary/20" />
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
                                                    <textarea rows={2} value={hotel.description} onChange={(e) => updateHotel(i, "description", e.target.value)} placeholder="Deskripsi hotel..." className="w-full border border-sand rounded-lg px-3 py-2 text-xs text-primary-dark placeholder:text-forest-muted/40 focus:outline-none focus:ring-1 focus:ring-primary/20 resize-none" />
                                                </div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="text-[0.65rem] text-forest-muted block mb-1">Harga</label>
                                                        <input type="text" value={hotel.price} onChange={(e) => updateHotel(i, "price", e.target.value)} placeholder="Rp 350.000" className="w-full border border-sand rounded-lg px-3 py-2 text-xs text-primary-dark placeholder:text-forest-muted/40 focus:outline-none focus:ring-1 focus:ring-primary/20" />
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
                                                        <button type="button" onClick={() => removeHotel(i)} className="w-full h-[34px] rounded-lg border border-red-200 text-red-400 hover:bg-red-50 hover:border-red-300 transition-colors flex items-center justify-center">
                                                            <X className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="text-[0.65rem] text-forest-muted block mb-1">Lat</label>
                                                        <input type="number" step="0.000001" value={hotel.lat} onChange={(e) => updateHotel(i, "lat", e.target.value)} className="w-full border border-sand rounded-lg px-3 py-2 text-xs text-primary-dark focus:outline-none focus:ring-1 focus:ring-primary/20" />
                                                    </div>
                                                    <div>
                                                        <label className="text-[0.65rem] text-forest-muted block mb-1">Lng</label>
                                                        <input type="number" step="0.000001" value={hotel.lng} onChange={(e) => updateHotel(i, "lng", e.target.value)} className="w-full border border-sand rounded-lg px-3 py-2 text-xs text-primary-dark focus:outline-none focus:ring-1 focus:ring-primary/20" />
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
