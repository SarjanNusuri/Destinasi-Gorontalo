import { useRef, useEffect, useState } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import {
    ArrowLeft,
    MapPin,
    Clock,
    Star,
    Navigation,
    BedDouble,
} from "lucide-react";
import LandingNavbar from "@/components/landing/LandingNavbar";
import Footer from "@/components/landing/Footer";

function haversineDistance(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function LeafletMap({ hotel, destination }) {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);

    useEffect(() => {
        if (!mapRef.current || mapInstance.current) return;

        const L = window.L;
        if (!L) return;

        const map = L.map(mapRef.current, {
            center: [hotel.lat, hotel.lng],
            zoom: 14,
            zoomControl: false,
        });

        L.control.zoom({ position: "topright" }).addTo(map);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap",
        }).addTo(map);

        // Hotel marker
        const hotelIcon = L.divIcon({
            html: `<div style="background:#d4a853;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,.3);"><span style="font-size:16px;">🏨</span></div>`,
            className: "",
            iconSize: [32, 32],
            iconAnchor: [16, 16],
        });
        L.marker([hotel.lat, hotel.lng], { icon: hotelIcon })
            .addTo(map)
            .bindPopup(`<b>${hotel.name}</b><br>${hotel.type}`);

        // Destination marker
        if (destination) {
            const destIcon = L.divIcon({
                html: `<div style="background:#d4a853;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,.3);"><span style="color:#0f1f17;font-size:11px;font-weight:bold;">📍</span></div>`,
                className: "",
                iconSize: [28, 28],
                iconAnchor: [14, 14],
            });
            L.marker([destination.lat, destination.lng], { icon: destIcon })
                .addTo(map)
                .bindPopup(`<b>${destination.name}</b><br>${destination.tag}`);

            // Draw line
            L.polyline(
                [
                    [hotel.lat, hotel.lng],
                    [destination.lat, destination.lng],
                ],
                { color: "#d4a853", weight: 2, opacity: 0.6, dashArray: "6 4" }
            ).addTo(map);
        }

        mapInstance.current = map;

        return () => {
            map.remove();
            mapInstance.current = null;
        };
    }, [hotel, destination]);

    return <div ref={mapRef} className="w-full h-80 rounded-2xl" />;
}

export default function HotelDetail() {
    const { hotel } = usePage().props;
    const [liveDistance, setLiveDistance] = useState(null);

    useEffect(() => {
        if (!navigator.geolocation) return;
        const watchId = navigator.geolocation.watchPosition(
            (pos) => {
                const dist = haversineDistance(
                    pos.coords.latitude,
                    pos.coords.longitude,
                    hotel.lat,
                    hotel.lng
                );
                setLiveDistance(dist < 1 ? `${Math.round(dist * 1000)} m` : `${dist.toFixed(1)} km`);
            },
            () => {},
            { enableHighAccuracy: true, timeout: 15000 }
        );
        return () => navigator.geolocation.clearWatch(watchId);
    }, [hotel.lat, hotel.lng]);

    const hasScene = hotel.sceneConfig?.type && hotel.sceneConfig?.type !== null;

    return (
        <>
            <Head title={`${hotel.name} — GO360`} />
            <div className="min-h-screen bg-goro-dark text-goro-cream">
                <LandingNavbar />

                {/* Hero Image */}
                <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
                    {hotel.image ? (
                        <img src={hotel.image} alt={hotel.name} className="absolute inset-0 w-full h-full object-cover" style={{ filter: "saturate(1.15)" }} />
                    ) : (
                        <div className="absolute inset-0 bg-goro-surface" />
                    )}
                    <div className="gradient-hero absolute inset-0" />
                    <div className="absolute inset-0 bg-goro-dark/30" />
                    <div className="relative z-10 h-full flex flex-col justify-end pb-12 px-6 md:px-16 max-w-6xl mx-auto">
                        <Link href="/#explore" className="inline-flex items-center gap-2 text-goro-cream/60 hover:text-goro-gold transition-colors mb-6 w-fit font-mono text-xs tracking-wider">
                            <ArrowLeft className="w-4 h-4" /> Kembali
                        </Link>
                        <span className="inline-block w-fit px-4 py-1.5 rounded-full border border-goro-gold/30 bg-goro-gold/10 font-mono text-[0.6rem] tracking-widest uppercase text-goro-gold mb-4">
                            {hotel.type}
                        </span>
                        <h1 className="font-display text-4xl md:text-6xl font-light leading-tight text-balance">
                            {hotel.name}
                        </h1>
                        <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-goro-cream/60">
                            <span className="flex items-center gap-1.5">
                                <MapPin className="w-4 h-4 text-goro-gold" />
                                {hotel.distance_from_center} dari pusat kota
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Star className="w-4 h-4 text-goro-gold" />
                                {hotel.rating} / 5
                            </span>
                            {hotel.price && (
                                <span className="flex items-center gap-1.5 text-goro-gold font-semibold">
                                    {hotel.price}
                                </span>
                            )}
                        </div>
                    </div>
                </section>

                {/* Content */}
                <section className="max-w-6xl mx-auto px-6 md:px-16 py-16">
                    {/* 3D Viewer */}
                    {hasScene && (
                        <div className="mb-16">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-1.5 h-1.5 rounded-full bg-goro-gold" />
                                <h2 className="font-display text-2xl font-light">Diorama 3D</h2>
                            </div>
                            <div className="rounded-2xl overflow-hidden border border-white/10">
                                {/* Three.js viewer would go here - using placeholder */}
                                <div className="w-full h-80 bg-goro-surface flex items-center justify-center">
                                    <p className="text-goro-cream/40 text-sm">3D Diorama Viewer</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Description + Info */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
                        <div className="lg:col-span-2">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-1.5 h-1.5 rounded-full bg-goro-gold" />
                                <h2 className="font-display text-2xl font-light">Tentang Hotel</h2>
                            </div>
                            <p className="text-goro-cream/70 text-base leading-relaxed font-light">
                                {hotel.description || "Tidak ada deskripsi."}
                            </p>
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-1.5 h-1.5 rounded-full bg-goro-gold" />
                                <h2 className="font-display text-2xl font-light">Info</h2>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { label: "Jarak dari Pusat Kota", value: hotel.distance_from_center },
                                    { label: "Jarak dari Lokasi Anda", value: liveDistance || "Menghitung..." },
                                    { label: "Tipe", value: hotel.type },
                                    { label: "Harga", value: hotel.price || "Hubungi" },
                                    {
                                        label: "Rating",
                                        value: (
                                            <span className="flex items-center gap-1">
                                                <Star className="w-3.5 h-3.5 text-goro-gold" />
                                                {hotel.rating} / 5
                                            </span>
                                        ),
                                    },
                                    {
                                        label: "Koordinat",
                                        value: (
                                            <span className="font-mono text-xs">
                                                {hotel.lat.toFixed(4)}°S, {hotel.lng.toFixed(4)}°E
                                            </span>
                                        ),
                                    },
                                ].map((item) => (
                                    <div key={item.label} className="p-4 rounded-xl bg-goro-card/50 border border-white/5">
                                        <span className="font-mono text-[0.55rem] tracking-widest uppercase text-goro-gold block mb-1">
                                            {item.label}
                                        </span>
                                        <span className="text-sm text-goro-cream/80 font-light">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Map */}
                    <div className="mb-16">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-1.5 h-1.5 rounded-full bg-goro-gold" />
                            <h2 className="font-display text-2xl font-light">Lokasi di Peta</h2>
                        </div>
                        <LeafletMap hotel={hotel} destination={hotel.destination} />
                        <p className="text-goro-cream/40 text-xs mt-3 font-light">
                            Garis putus-putus menunjukkan jarak ke destinasi terdekat.
                        </p>
                    </div>

                    {/* Nearest Destination */}
                    {hotel.destination && (
                        <div className="rounded-2xl border border-goro-gold/20 bg-goro-card/50 p-8">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-1.5 h-1.5 rounded-full bg-goro-gold" />
                                <h2 className="font-display text-2xl font-light">Destinasi Terdekat</h2>
                            </div>
                            <div className="flex items-center gap-6">
                                {hotel.destination.image && (
                                    <img src={hotel.destination.image} alt={hotel.destination.name} className="w-24 h-16 rounded-xl object-cover border border-white/10" />
                                )}
                                <div>
                                    <span className="font-mono text-[0.55rem] tracking-widest uppercase text-goro-gold block mb-1">
                                        {hotel.destination.tag}
                                    </span>
                                    <h3 className="text-lg font-display text-goro-cream">{hotel.destination.name}</h3>
                                    <p className="text-sm text-goro-cream/50">{hotel.distance} km dari hotel ini</p>
                                </div>
                                <Link
                                    href={`/destination/${hotel.destination.id}`}
                                    className="ml-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-goro-gold/20 border border-goro-gold/30 text-goro-gold text-sm font-medium hover:bg-goro-gold hover:text-goro-dark transition-all"
                                >
                                    Lihat Destinasi <Navigation className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    )}
                </section>

                <Footer />
            </div>
        </>
    );
}
