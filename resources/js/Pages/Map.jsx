import { Head, Link, usePage } from "@inertiajs/react";
import { useState, useEffect, useRef, useMemo } from "react";
import {
    ArrowLeft,
    Search,
    MapPin,
    Navigation,
    X,
    Layers,
    Trees,
    Landmark,
    Waves,
    ScrollText,
    UtensilsCrossed,
    Mountain,
} from "lucide-react";
import { interests } from "@/data/landing";

const LUCIDE_MAP = { Trees, Landmark, Waves, ScrollText, UtensilsCrossed, Mountain };

const CATEGORIES = [
    { id: "all", label: "Semua", lucide: "Layers" },
    ...interests.map((i) => ({ id: i.id, label: i.label, lucide: i.lucide })),
];

export default function Map() {
    const { destinations } = usePage().props;
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const markersRef = useRef([]);
    const userMarkerRef = useRef(null);
    const routeRef = useRef(null);

    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [activeCategory, setActiveCategory] = useState("all");
    const [userLocation, setUserLocation] = useState(null);

    const filtered = useMemo(() => {
        let list = destinations;
        if (activeCategory !== "all") {
            list = list.filter((d) => d.category === activeCategory);
        }
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(
                (d) =>
                    d.name.toLowerCase().includes(q) ||
                    d.tag.toLowerCase().includes(q) ||
                    d.details.location.toLowerCase().includes(q)
            );
        }
        return list;
    }, [activeCategory, search]);

    useEffect(() => {
        if (!mapRef.current || mapInstance.current) return;

        async function init() {
            const L = await import("leaflet");

            mapInstance.current = L.map(mapRef.current, {
                center: [-0.5407, 123.0558],
                zoom: 13,
                scrollWheelZoom: true,
                attributionControl: true,
            });

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                maxZoom: 18,
                attribution: "© OpenStreetMap",
            }).addTo(mapInstance.current);

            const goldIcon = L.divIcon({
                className: "custom-marker",
                html: `<div style="width:28px;height:28px;background:#d4a853;border:3px solid #0f1f17;border-radius:50%;box-shadow:0 0 20px rgba(212,168,83,0.5);display:flex;align-items:center;justify-content:center;cursor:pointer;"><div style="width:8px;height:8px;background:#0f1f17;border-radius:50%;"></div></div>`,
                iconSize: [28, 28],
                iconAnchor: [14, 14],
            });

            const hotelIcon = L.divIcon({
                className: "custom-marker",
                html: `<div style="width:22px;height:22px;background:#1a3326;border:2px solid #d4a853;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 0 10px rgba(212,168,83,0.3);cursor:pointer;"><span style="font-size:10px;">🏨</span></div>`,
                iconSize: [22, 22],
                iconAnchor: [11, 11],
            });

            destinations.forEach((dest) => {
                const m = L.marker([dest.lat, dest.lng], { icon: goldIcon })
                    .addTo(mapInstance.current)
                    .bindPopup(
                        `<div style="font-family:Manrope,sans-serif;padding:6px;min-width:160px;">
                            <strong style="color:#d4a853;font-size:14px;">${dest.name}</strong><br>
                            <span style="color:#f5efe699;font-size:11px;">${dest.tag} · ${dest.distance}</span><br>
                            <span style="color:#f5efe6cc;font-size:11px;display:block;margin:4px 0;">⭐ ${dest.details.rating} · ${dest.details.location}</span>
                            <span onclick="window.location.href='/destination/${dest.id}'" style="color:#22c55e;font-size:12px;text-decoration:underline;cursor:pointer;font-weight:600;">Lihat Detail →</span>
                        </div>`
                    );
                markersRef.current.push({ marker: m, dest, type: "dest" });

                if (dest.hotels) {
                    dest.hotels.forEach((h) => {
                        const hm = L.marker([h.lat, h.lng], { icon: hotelIcon })
                            .addTo(mapInstance.current)
                            .bindPopup(
                                `<div style="font-family:Manrope,sans-serif;padding:6px;min-width:160px;">
                                    <strong style="color:#d4a853;font-size:13px;">${h.name}</strong><br>
                                    <span style="color:#f5efe699;font-size:10px;">${h.type} · ${h.price}</span><br>
                                    <span style="color:#f5efe6cc;font-size:10px;display:block;margin:4px 0;">⭐ ${h.rating} · ${h.distance} km · ±${h.duration} menit</span>
                                    <span onclick="window.location.href='/destination/${dest.id}'" style="color:#22c55e;font-size:11px;text-decoration:underline;cursor:pointer;">Lihat Destinasi →</span>
                                </div>`
                            );
                        markersRef.current.push({ marker: hm, dest, type: "hotel" });
                    });
                }
            });
        }
        init();

        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (!mapInstance.current) return;
        markersRef.current.forEach(({ marker, dest, type }) => {
            const matchesCategory =
                activeCategory === "all" || dest.category === activeCategory;
            const matchesSearch =
                !search.trim() ||
                dest.name.toLowerCase().includes(search.toLowerCase()) ||
                dest.tag.toLowerCase().includes(search.toLowerCase()) ||
                dest.details.location.toLowerCase().includes(search.toLowerCase());
            const visible = matchesCategory && matchesSearch;
            if (visible) {
                if (!mapInstance.current.hasLayer(marker))
                    marker.addTo(mapInstance.current);
            } else {
                if (mapInstance.current.hasLayer(marker))
                    mapInstance.current.removeLayer(marker);
            }
        });
    }, [activeCategory, search]);

    // Fly to first destination when category changes
    useEffect(() => {
        if (!mapInstance.current) return;
        if (activeCategory === "all") {
            mapInstance.current.flyTo([-0.5407, 123.0558], 13, { duration: 1.2 });
        } else {
            const first = destinations.find((d) => d.category === activeCategory);
            if (first) {
                mapInstance.current.flyTo([first.lat, first.lng], 13, { duration: 1.2 });
            }
        }
    }, [activeCategory]);

    const handleSearch = (value) => {
        setSearch(value);
        if (!value.trim()) {
            setSearchResults([]);
            setShowResults(false);
            return;
        }
        const q = value.toLowerCase();
        const results = destinations.filter(
            (d) =>
                d.name.toLowerCase().includes(q) ||
                d.tag.toLowerCase().includes(q) ||
                d.details.location.toLowerCase().includes(q)
        );
        setSearchResults(results);
        setShowResults(true);
    };

    const flyToDestination = (dest) => {
        if (!mapInstance.current) return;
        mapInstance.current.flyTo([dest.lat, dest.lng], 15, { duration: 1.2 });
        setShowResults(false);
        setSearch(dest.name);
        const entry = markersRef.current.find(
            (m) => m.type === "dest" && m.dest.id === dest.id
        );
        if (entry) entry.marker.openPopup();
    };

    const submitSearch = () => {
        const q = search.toLowerCase().trim();
        if (!q) return;
        const match = destinations.find(
            (d) =>
                d.name.toLowerCase().includes(q) ||
                d.tag.toLowerCase().includes(q) ||
                d.details.location.toLowerCase().includes(q)
        );
        if (match) {
            flyToDestination(match);
        } else {
            alert("Lokasi yang Anda cari tidak ditemukan.");
        }
    };

    const goToUser = () => {
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                setUserLocation({ lat: latitude, lng: longitude });

                if (!mapInstance.current) return;
                const L = require("leaflet");

                if (userMarkerRef.current)
                    mapInstance.current.removeLayer(userMarkerRef.current);

                const icon = L.divIcon({
                    className: "custom-marker",
                    html: `<div style="width:20px;height:20px;background:#22c55e;border:3px solid #0f1f17;border-radius:50%;box-shadow:0 0 14px rgba(34,197,94,0.5);display:flex;align-items:center;justify-content:center;"><div style="width:6px;height:6px;background:#fff;border-radius:50%;"></div></div>`,
                    iconSize: [20, 20],
                    iconAnchor: [10, 10],
                });
                userMarkerRef.current = L.marker([latitude, longitude], { icon })
                    .addTo(mapInstance.current)
                    .bindPopup(
                        `<div style="font-family:Manrope,sans-serif;padding:4px;"><strong style="color:#22c55e;">Lokasi Anda</strong></div>`
                    )
                    .openPopup();

                mapInstance.current.setView([latitude, longitude], 13);
            },
            () => {},
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    return (
        <>
            <Head title="Peta Gorontalo — GO360" />
            <div className="fixed inset-0 flex flex-col bg-goro-dark text-goro-cream">
                {/* Header */}
                <div className="flex items-center gap-3 px-4 py-3 bg-goro-dark/95 backdrop-blur-md border-b border-white/10 z-[1100]">
                    <Link
                        href="/"
                        className="w-9 h-9 rounded-lg bg-goro-card border border-white/10 flex items-center justify-center text-goro-cream/60 hover:text-goro-gold hover:border-goro-gold/40 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-goro-cream/30" />
                        <input
                            type="text"
                            placeholder="Cari destinasi, kategori, lokasi..."
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && submitSearch()}
                            className="w-full bg-goro-card/80 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-goro-cream placeholder:text-goro-cream/30 focus:outline-none focus:border-goro-gold/40 transition-colors"
                        />
                        {search && (
                            <button
                                onClick={() => { setSearch(""); setSearchResults([]); setShowResults(false); }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-goro-cream/30 hover:text-goro-cream"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                        {showResults && searchResults.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-goro-dark/95 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden z-[1200] max-h-[300px] overflow-y-auto">
                                {searchResults.map((d) => (
                                    <button
                                        key={d.id}
                                        onClick={() => flyToDestination(d)}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-goro-card/80 transition-colors border-b border-white/5 last:border-0"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-goro-gold/20 flex items-center justify-center shrink-0">
                                            <MapPin className="w-4 h-4 text-goro-gold" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm text-goro-cream font-medium truncate">{d.name}</p>
                                            <p className="text-[0.6rem] text-goro-cream/40">{d.tag} · {d.distance}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                        {showResults && search && searchResults.length === 0 && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-goro-dark/95 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 z-[1200]">
                                <p className="text-xs text-goro-cream/40">Lokasi yang Anda cari tidak ditemukan.</p>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={goToUser}
                        className="w-9 h-9 rounded-lg bg-goro-card border border-white/10 flex items-center justify-center text-goro-cream/60 hover:text-green-400 hover:border-green-400/40 transition-colors"
                        title="Lokasi Saya"
                    >
                        <Navigation className="w-4 h-4" />
                    </button>
                </div>

                {/* Category filter */}
                <div className="flex gap-2 px-4 py-2.5 bg-goro-dark/95 backdrop-blur-md border-b border-white/5 z-[1100] overflow-x-auto scrollbar-hide">
                    {CATEGORIES.map((cat) => {
                        const LucideIcon =
                            cat.lucide === "Layers"
                                ? Layers
                                : LUCIDE_MAP[cat.lucide] || Layers;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                                    activeCategory === cat.id
                                        ? "bg-goro-gold text-goro-dark"
                                        : "bg-goro-card/80 text-goro-cream/50 border border-white/10 hover:border-goro-gold/30 hover:text-goro-cream"
                                }`}
                            >
                                <LucideIcon className="w-3.5 h-3.5" />
                                {cat.label}
                            </button>
                        );
                    })}
                </div>

                {/* Map */}
                <div className="flex-1 relative">
                    <div
                        ref={mapRef}
                        className="w-full h-full"
                        style={{
                            filter: "invert(0.88) hue-rotate(180deg) brightness(1.1) contrast(1.1) saturate(0.3)",
                        }}
                    />

                    {/* Result count */}
                    <div className="absolute top-3 left-3 z-[1000] bg-goro-dark/85 backdrop-blur-sm border border-white/10 px-3 py-1.5 rounded-lg">
                        <span className="font-mono text-[0.6rem] tracking-wider text-goro-gold">
                            {filtered.length} destinasi
                            {activeCategory !== "all" &&
                                ` · ${CATEGORIES.find((c) => c.id === activeCategory)?.label}`}
                        </span>
                    </div>

                    {/* Legend */}
                    <div className="absolute bottom-3 left-3 z-[1000] bg-goro-dark/85 backdrop-blur-sm border border-white/10 px-3 py-2 rounded-xl flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-goro-gold" />
                            <span className="text-[0.55rem] text-goro-cream/60">Wisata</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-goro-card border border-goro-gold flex items-center justify-center">
                                <span className="text-[6px]">🏨</span>
                            </div>
                            <span className="text-[0.55rem] text-goro-cream/60">Hotel</span>
                        </div>
                        {userLocation && (
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                                <span className="text-[0.55rem] text-goro-cream/60">Lokasi Saya</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                .custom-marker {
                    background: transparent !important;
                    border: none !important;
                }
                .leaflet-popup-content-wrapper {
                    background: #1a3326 !important;
                    border: 1px solid rgba(212,168,83,0.3) !important;
                    border-radius: 12px !important;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.4) !important;
                }
                .leaflet-popup-content {
                    color: #f5efe6 !important;
                    margin: 10px 14px !important;
                    font-family: 'Manrope', sans-serif !important;
                }
                .leaflet-popup-tip {
                    background: #1a3326 !important;
                    border: 1px solid rgba(212,168,83,0.3) !important;
                }
                .leaflet-control-zoom a {
                    background: #1a3326 !important;
                    color: #d4a853 !important;
                    border-color: rgba(255,255,255,0.1) !important;
                }
                .leaflet-control-zoom a:hover {
                    background: #0f1f17 !important;
                }
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </>
    );
}
