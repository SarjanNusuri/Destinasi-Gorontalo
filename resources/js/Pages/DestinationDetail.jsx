import { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import {
    ArrowLeft,
    MapPin,
    Clock,
    Star,
    RotateCcw,
    Navigation,
    X,
    ChevronUp,
    ChevronDown,
    BedDouble,
} from "lucide-react";
import { useThreeViewer } from "@/hooks/useThreeViewer";
import LandingNavbar from "@/components/landing/LandingNavbar";
import Footer from "@/components/landing/Footer";

/* ─── Helpers ─── */
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

const TURN_ICONS = {
    right: "→",
    left: "←",
    "slight right": "↗",
    "slight left": "↖",
    "sharp right": "↗",
    "sharp left": "↖",
    uturn: "↺",
    straight: "⬆",
};

function getManeuverIcon(maneuver) {
    const { type, modifier } = maneuver;
    if (type === "arrive") return "🏁";
    if (type === "depart") return "▶";
    if (type === "roundabout" || type === "rotary" || type === "roundabout turn")
        return "↻";
    return TURN_ICONS[modifier] || "⬆";
}

function formatDistance(meters) {
    if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
    return `${Math.round(meters)} m`;
}

function formatDuration(seconds) {
    if (seconds >= 3600) {
        const h = Math.floor(seconds / 3600);
        const m = Math.round((seconds % 3600) / 60);
        return `${h} jam ${m} menit`;
    }
    return `${Math.round(seconds / 60)} menit`;
}

function ManeuverStep({ step, index, total, destLabel }) {
    const icon = getManeuverIcon(step.maneuver);
    const isArrive = step.maneuver.type === "arrive";
    const isTurn =
        step.maneuver.type === "turn" ||
        step.maneuver.type === "end of road" ||
        step.maneuver.type === "fork";
    const mod = step.maneuver.modifier;
    const modText =
        mod === "slight right"
            ? "sedikit ke kanan"
            : mod === "slight left"
            ? "sedikit ke kiri"
            : mod === "sharp right"
            ? "tajam ke kanan"
            : mod === "sharp left"
            ? "tajam ke kiri"
            : mod === "uturn"
            ? "putar balik"
            : mod === "right"
            ? "ke kanan"
            : mod === "left"
            ? "ke kiri"
            : "";

    return (
        <div
            className={`flex items-start gap-3 py-2.5 ${
                index < total - 1 ? "border-b border-white/5" : ""
            }`}
        >
            <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 ${
                    isArrive
                        ? "bg-goro-gold/20 text-goro-gold"
                        : "bg-goro-card text-goro-cream/70"
                }`}
            >
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm text-goro-cream/90 font-light leading-snug">
                    {isArrive
                        ? `Tiba di ${destLabel}`
                        : `${isTurn ? "Belok" : "Lurus"}${
                              mod && mod !== "straight" ? ` ${modText}` : ""
                          }${step.name ? ` di ${step.name}` : ""}`}
                </p>
                {step.distance > 0 && (
                    <p className="text-[0.65rem] text-goro-cream/40 mt-0.5 font-mono">
                        {formatDistance(step.distance)}
                    </p>
                )}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════
   FLOATING NAV POPUP (hotel — bottom-right, expandable)
   ═══════════════════════════════════════════════════════════════════ */
function FloatingNavPopup({ hotel, onClose, onRouteToHotel }) {
    const [expanded, setExpanded] = useState(false);
    const [navState, setNavState] = useState("idle");
    const [routeInfo, setRouteInfo] = useState(null);
    const [error, setError] = useState(null);
    const [userLocation, setUserLocation] = useState(null);

    useEffect(() => {
        if (!navigator.geolocation) {
            setError("Geolocation tidak didukung browser ini.");
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) =>
                setUserLocation({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                }),
            () => setError("Izin lokasi ditolak."),
            { enableHighAccuracy: true, timeout: 10000 }
        );
    }, []);

    const startNav = useCallback(async () => {
        if (!userLocation) return;
        setNavState("navigating");
        setError(null);
        try {
            const url = `https://router.project-osrm.org/route/v1/driving/${userLocation.lng},${userLocation.lat};${hotel.lng},${hotel.lat}?steps=true&geometries=geojson&overview=full`;
            const res = await fetch(url);
            const data = await res.json();
            if (data.code !== "Ok" || !data.routes?.length) {
                setError("Gagal hitung rute.");
                setNavState("idle");
                return;
            }
            const route = data.routes[0];
            setRouteInfo({
                distance: route.distance,
                duration: route.duration,
                steps: route.legs[0].steps.map((s) => ({
                    maneuver: s.maneuver,
                    name: s.name || "",
                    distance: s.distance,
                })),
            });
            // Send full route to map
            if (onRouteToHotel) onRouteToHotel(route);
        } catch {
            setError("Gagal menghitung rute. Cek koneksi.");
            setNavState("idle");
        }
    }, [userLocation, hotel, onRouteToHotel]);

    const stopNav = useCallback(() => {
        setNavState("idle");
        setRouteInfo(null);
        if (onRouteToHotel) onRouteToHotel(null);
    }, [onRouteToHotel]);

    if (!hotel) return null;

    return (
        <div
            className={`fixed z-[2000] transition-all duration-500 ease-out ${
                expanded
                    ? "bottom-0 right-0 w-full md:bottom-6 md:right-6 md:w-[420px] md:max-h-[80vh]"
                    : "bottom-6 right-6 w-[340px]"
            }`}
        >
            <div
                className={`bg-goro-dark/95 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden transition-all duration-500 ${
                    expanded
                        ? "rounded-none md:rounded-2xl h-[60vh] md:h-auto md:max-h-[80vh]"
                        : "rounded-2xl"
                }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                    <div className="flex items-center gap-3 min-w-0">
                        {hotel.image ? (
                            <img src={hotel.image} alt={hotel.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                        ) : (
                            <div className="w-10 h-10 rounded-lg bg-goro-gold/20 flex items-center justify-center shrink-0">
                                <BedDouble className="w-5 h-5 text-goro-gold" />
                            </div>
                        )}
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-goro-cream truncate">
                                {hotel.name}
                            </p>
                            <p className="text-[0.6rem] text-goro-cream/40 font-mono">
                                {hotel.type} · {hotel.distance} km · ±
                                {hotel.duration} menit
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                        <button
                            onClick={() => setExpanded(!expanded)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-goro-cream/50 hover:text-goro-cream hover:bg-white/5 transition-colors"
                        >
                            {expanded ? (
                                <ChevronDown className="w-4 h-4" />
                            ) : (
                                <ChevronUp className="w-4 h-4" />
                            )}
                        </button>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-goro-cream/50 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div
                    className={`overflow-y-auto transition-all duration-500 ${
                        expanded ? "max-h-[50vh]" : "max-h-0"
                    }`}
                >
                    <div className="p-4">
                        <div className="mb-4">
                            <div className="flex items-center gap-4 text-xs text-goro-cream/50 mb-3">
                                <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3 text-goro-gold" />
                                    {hotel.distance} km dari destinasi
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3 text-goro-gold" />±
                                    {hotel.duration} menit
                                </span>
                                <span className="flex items-center gap-1">
                                    <Star className="w-3 h-3 text-goro-gold" />
                                    {hotel.rating}
                                </span>
                            </div>
                            <p className="text-sm text-goro-cream/60 font-light leading-relaxed">
                                {hotel.description}
                            </p>
                            <div className="mt-3">
                                <span className="text-sm font-semibold text-goro-gold">
                                    {hotel.price}
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-2 mb-4">
                            {navState === "idle" && (
                                <button
                                    onClick={startNav}
                                    disabled={!userLocation}
                                    className="flex-1 flex items-center justify-center gap-2 bg-goro-gold text-goro-dark py-2.5 rounded-xl text-xs font-bold hover:bg-goro-gold-light transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    <Navigation className="w-4 h-4" /> Mulai
                                    Navigasi
                                </button>
                            )}
                            {navState === "navigating" && (
                                <button
                                    onClick={stopNav}
                                    className="flex-1 flex items-center justify-center gap-2 bg-red-500/90 text-white py-2.5 rounded-xl text-xs font-bold hover:bg-red-600 transition-all"
                                >
                                    <X className="w-4 h-4" /> Hentikan
                                </button>
                            )}
                        </div>

                        {error && (
                            <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 mb-4">
                                {error}
                            </div>
                        )}

                        {navState === "navigating" && routeInfo && (
                            <div className="mb-4 p-3 rounded-xl bg-goro-card/50 border border-white/5">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-goro-cream/60">
                                        📏 {formatDistance(routeInfo.distance)}
                                    </span>
                                    <span className="text-goro-cream/60">
                                        ⏱ ±{formatDuration(routeInfo.duration)}
                                    </span>
                                </div>
                            </div>
                        )}

                        {navState === "navigating" && routeInfo && (
                            <div>
                                <p className="font-mono text-[0.55rem] tracking-widest uppercase text-goro-gold mb-2">
                                    Petunjuk Arah
                                </p>
                                <div className="space-y-0 max-h-[250px] overflow-y-auto pr-1">
                                    {routeInfo.steps.map((step, i) => (
                                        <ManeuverStep
                                            key={i}
                                            step={step}
                                            index={i}
                                            total={routeInfo.steps.length}
                                            destLabel={hotel.name}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {!userLocation && !error && (
                            <div className="text-xs text-goro-cream/30 text-center py-2">
                                Meminta izin lokasi...
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════
   HOTEL CARD
   ═══════════════════════════════════════════════════════════════════ */
function HotelCard({ hotel, onSelect, isActive }) {
    return (
        <div
            className={`relative overflow-hidden rounded-2xl border transition-all cursor-pointer ${
                isActive
                    ? "bg-goro-card border-goro-gold/40 shadow-lg shadow-goro-gold/5"
                    : "bg-goro-card/50 border-white/5 hover:border-goro-gold/20 hover:bg-goro-card/80"
            }`}
            onClick={() => onSelect(hotel)}
        >
            {hotel.image && (
                <div className="relative h-36 overflow-hidden">
                    <img
                        src={hotel.image}
                        alt={hotel.name}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                        <div>
                            <h4 className="font-display text-base text-white font-medium leading-tight">
                                {hotel.name}
                            </h4>
                            <span className="text-[0.6rem] font-mono tracking-wider text-goro-gold uppercase">
                                {hotel.type}
                            </span>
                        </div>
                        <div className="text-right shrink-0">
                            <p className="text-sm font-semibold text-goro-gold">
                                {hotel.price}
                            </p>
                            <div className="flex items-center gap-1 justify-end mt-0.5">
                                <Star className="w-3 h-3 text-goro-gold fill-goro-gold" />
                                <span className="text-xs text-white/70">
                                    {hotel.rating}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="p-5">
                {!hotel.image && (
                    <div className="flex items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                            <div
                                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                    isActive ? "bg-goro-gold/20" : "bg-white/5"
                                }`}
                            >
                                <BedDouble
                                    className={`w-5 h-5 ${
                                        isActive
                                            ? "text-goro-gold"
                                            : "text-goro-cream/40"
                                    }`}
                                />
                            </div>
                            <div>
                                <h4 className="font-display text-base text-goro-cream font-medium">
                                    {hotel.name}
                                </h4>
                                <span className="text-[0.6rem] font-mono tracking-wider text-goro-gold uppercase">
                                    {hotel.type}
                                </span>
                            </div>
                        </div>
                        <div className="text-right shrink-0">
                            <p className="text-sm font-semibold text-goro-gold">
                                {hotel.price}
                            </p>
                            <div className="flex items-center gap-1 justify-end mt-0.5">
                                <Star className="w-3 h-3 text-goro-gold" />
                                <span className="text-xs text-goro-cream/50">
                                    {hotel.rating}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
                <p className="text-sm text-goro-cream/50 font-light leading-relaxed mb-4 line-clamp-2">
                    {hotel.description}
                </p>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-goro-cream/40">
                        <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-goro-gold/60" />
                            {hotel.distance} km
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-goro-gold/60" />±
                            {hotel.duration} menit
                        </span>
                    </div>
                    <span
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                            isActive
                                ? "bg-goro-gold text-goro-dark"
                                : "bg-goro-gold/10 text-goro-gold"
                        }`}
                    >
                        {isActive ? "Navigasi aktif" : "Kunjungi →"}
                    </span>
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════
   LEAFLET MAP
   — Destination routing: Kunjungi → Mulai Navigasi (3 buttons)
   — Hotel routing: hotelRouteGeometry prop (from FloatingNavPopup)
   ═══════════════════════════════════════════════════════════════════ */
function LeafletMap({
    lat,
    lng,
    name,
    hotels,
    activeHotel,
    onHotelMarkerClick,
    hotelRouteGeometry,
}) {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const markersRef = useRef([]);
    const destRouteRef = useRef(null);
    const hotelRouteRef = useRef(null);
    const userMarkerRef = useRef(null);

    // ── Destination routing state ──
    const [navState, setNavState] = useState("idle");
    const [userLocation, setUserLocation] = useState(null);
    const [destRouteInfo, setDestRouteInfo] = useState(null);
    const [locationError, setLocationError] = useState(null);

    // Init map + markers
    useEffect(() => {
        if (!mapRef.current || mapInstance.current) return;

        async function init() {
            const L = await import("leaflet");
            await import("leaflet/dist/leaflet.css");

            mapInstance.current = L.map(mapRef.current, {
                center: [lat, lng],
                zoom: 13,
                scrollWheelZoom: false,
                attributionControl: true,
            });

            L.tileLayer(
                "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                { maxZoom: 19, attribution: "© OpenStreetMap" }
            ).addTo(mapInstance.current);

            // Destination marker
            const goldIcon = L.divIcon({
                className: "custom-marker",
                html: `<div style="width:28px;height:28px;background:#d4a853;border:3px solid #0f1f17;border-radius:50%;box-shadow:0 0 20px rgba(212,168,83,0.5);display:flex;align-items:center;justify-content:center;"><div style="width:8px;height:8px;background:#0f1f17;border-radius:50%;"></div></div>`,
                iconSize: [28, 28],
                iconAnchor: [14, 14],
            });
            L.marker([lat, lng], { icon: goldIcon })
                .addTo(mapInstance.current)
                .bindPopup(
                    `<div style="font-family:Manrope,sans-serif;padding:4px;"><strong style="color:#d4a853;">${name}</strong></div>`
                )
                .openPopup();

            // Hotel markers
            if (hotels) {
                hotels.forEach((h) => {
                    const icon = L.divIcon({
                        className: "custom-marker",
                        html: `<div style="width:22px;height:22px;background:#1a3326;border:2px solid #d4a853;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 0 10px rgba(212,168,83,0.3);"><span style="font-size:10px;">🏨</span></div>`,
                        iconSize: [22, 22],
                        iconAnchor: [11, 11],
                    });
                    const m = L.marker([h.lat, h.lng], { icon })
                        .addTo(mapInstance.current)
                        .bindPopup(
                            `<div style="font-family:Manrope,sans-serif;padding:4px;min-width:140px;"><strong style="color:#d4a853;font-size:13px;">${h.name}</strong><br><span style="color:#f5efe6;font-size:11px;">${h.type} · ${h.distance} km</span></div>`
                        );
                    m.on("click", () =>
                        onHotelMarkerClick && onHotelMarkerClick(h)
                    );
                    markersRef.current.push(m);
                });
            }
        }
        init();

        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, [lat, lng, name]);

    // ── Request geolocation ──
    const requestLocation = useCallback(() => {
        if (!navigator.geolocation) {
            setLocationError("Geolocation tidak didukung browser ini.");
            return;
        }
        setLocationError(null);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation({ lat: latitude, lng: longitude });
                setNavState("located");

                if (!mapInstance.current) return;
                const L = require("leaflet");

                const userIcon = L.divIcon({
                    className: "custom-marker",
                    html: `
                        <div class="user-marker-pulse"></div>
                        <div style="width:18px;height:18px;background:#22c55e;border:3px solid #0f1f17;border-radius:50%;position:relative;z-index:2;box-shadow:0 0 12px rgba(34,197,94,0.5);display:flex;align-items:center;justify-content:center;">
                            <div style="width:5px;height:5px;background:#fff;border-radius:50%;"></div>
                        </div>
                    `,
                    iconSize: [18, 18],
                    iconAnchor: [9, 9],
                });
                userMarkerRef.current = L.marker([latitude, longitude], {
                    icon: userIcon,
                })
                    .addTo(mapInstance.current)
                    .bindPopup(
                        `<div style="font-family:Manrope,sans-serif;padding:4px;"><strong style="color:#22c55e;">Lokasi Anda</strong></div>`
                    );

                const bounds = L.latLngBounds(
                    [latitude, longitude],
                    [lat, lng]
                );
                mapInstance.current.fitBounds(bounds, { padding: [50, 50] });
            },
            (error) => {
                const msg =
                    error.code === 1
                        ? "Izin lokasi ditolak. Aktifkan di pengaturan browser."
                        : error.code === 2
                        ? "Informasi lokasi tidak tersedia."
                        : error.code === 3
                        ? "Permintaan lokasi habis waktu."
                        : "Gagal mendapatkan lokasi.";
                setLocationError(msg);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    }, [lat, lng]);

    // ── Start destination navigation ──
    const startDestNav = useCallback(async () => {
        if (!userLocation || !mapInstance.current) return;
        setNavState("navigating");
        setDestRouteInfo(null);
        setLocationError(null);

        try {
            const url = `https://router.project-osrm.org/route/v1/driving/${userLocation.lng},${userLocation.lat};${lng},${lat}?steps=true&geometries=geojson&overview=full`;
            const res = await fetch(url);
            const data = await res.json();
            if (data.code !== "Ok" || !data.routes?.length) {
                setLocationError("Gagal menghitung rute. Coba lagi.");
                setNavState("located");
                return;
            }
            const route = data.routes[0];
            setDestRouteInfo({
                distance: route.distance,
                duration: route.duration,
                steps: route.legs[0].steps.map((s) => ({
                    maneuver: s.maneuver,
                    name: s.name || "",
                    distance: s.distance,
                })),
            });

            const L = await import("leaflet");
            if (destRouteRef.current)
                mapInstance.current.removeLayer(destRouteRef.current);

            destRouteRef.current = L.geoJSON(route.geometry, {
                style: {
                    color: "#4a90d9",
                    weight: 5,
                    opacity: 0.85,
                    lineCap: "round",
                    lineJoin: "round",
                },
            }).addTo(mapInstance.current);
            mapInstance.current.fitBounds(destRouteRef.current.getBounds(), {
                padding: [60, 60],
            });
        } catch {
            setLocationError("Gagal menghitung rute. Periksa koneksi internet.");
            setNavState("located");
        }
    }, [userLocation, lat, lng]);

    // ── Stop destination navigation ──
    const stopDestNav = useCallback(() => {
        if (destRouteRef.current && mapInstance.current) {
            mapInstance.current.removeLayer(destRouteRef.current);
            destRouteRef.current = null;
        }
        if (userMarkerRef.current && mapInstance.current) {
            mapInstance.current.removeLayer(userMarkerRef.current);
            userMarkerRef.current = null;
        }
        setNavState("idle");
        setUserLocation(null);
        setDestRouteInfo(null);
        setLocationError(null);
        if (mapInstance.current) mapInstance.current.setView([lat, lng], 13);
    }, [lat, lng]);

    // ── Draw hotel route from FloatingNavPopup ──
    useEffect(() => {
        if (!mapInstance.current) return;

        async function drawHotelRoute() {
            const L = await import("leaflet");

            if (hotelRouteRef.current) {
                mapInstance.current.removeLayer(hotelRouteRef.current);
                hotelRouteRef.current = null;
            }

            if (hotelRouteGeometry) {
                hotelRouteRef.current = L.geoJSON(hotelRouteGeometry, {
                    style: {
                        color: "#22c55e",
                        weight: 5,
                        opacity: 0.85,
                        lineCap: "round",
                        lineJoin: "round",
                    },
                }).addTo(mapInstance.current);
                mapInstance.current.fitBounds(
                    hotelRouteRef.current.getBounds(),
                    { padding: [60, 60] }
                );
            }
        }
        drawHotelRoute();
    }, [hotelRouteGeometry]);

    return (
        <div className="relative">
            {/* Map */}
            <div
                ref={mapRef}
                className="w-full rounded-2xl overflow-hidden border border-goro-card"
                style={{ height: 420, filter: "invert(0.88) hue-rotate(180deg) brightness(1.1) contrast(1.1) saturate(0.3)" }}
            />

            {/* Destination routing buttons (top-right) */}
            <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
                {navState === "idle" && (
                    <button
                        onClick={requestLocation}
                        className="flex items-center gap-2 bg-goro-card/90 backdrop-blur-sm border border-goro-gold/40 text-goro-gold px-4 py-2.5 rounded-xl text-xs font-semibold hover:bg-goro-gold hover:text-goro-dark transition-all shadow-lg"
                    >
                        <MapPin className="w-4 h-4" /> Kunjungi
                    </button>
                )}
                {navState === "located" && (
                    <button
                        onClick={startDestNav}
                        className="flex items-center gap-2 bg-goro-gold text-goro-dark px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-goro-gold-light transition-all shadow-lg shadow-goro-gold/20"
                    >
                        <Navigation className="w-4 h-4" /> Mulai Navigasi
                    </button>
                )}
                {navState === "navigating" && (
                    <button
                        onClick={stopDestNav}
                        className="flex items-center gap-2 bg-red-500/90 backdrop-blur-sm text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-red-600 transition-all shadow-lg"
                    >
                        <X className="w-4 h-4" /> Hentikan
                    </button>
                )}
                {navState === "navigating" && destRouteInfo && (
                    <div className="bg-goro-card/90 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3 text-xs shadow-lg">
                        <div className="flex items-center gap-2 text-goro-cream/80 mb-1">
                            <span className="text-goro-gold font-bold">
                                📏
                            </span>{" "}
                            {formatDistance(destRouteInfo.distance)}
                        </div>
                        <div className="flex items-center gap-2 text-goro-cream/80">
                            <span className="text-goro-gold font-bold">
                                ⏱
                            </span>{" "}
                            ±{formatDuration(destRouteInfo.duration)}
                        </div>
                    </div>
                )}
                {locationError && (
                    <div className="bg-red-500/20 border border-red-500/40 rounded-xl px-4 py-2.5 text-xs text-red-300 max-w-[220px]">
                        {locationError}
                    </div>
                )}
            </div>

            {/* Destination turn-by-turn panel (bottom) */}
            {navState === "navigating" && destRouteInfo && (
                <div className="absolute bottom-0 left-0 right-0 z-[1000] bg-goro-dark/95 backdrop-blur-md border-t border-white/10 rounded-b-2xl max-h-[220px] overflow-y-auto">
                    <div className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <Navigation className="w-3.5 h-3.5 text-goro-gold" />
                            <span className="font-mono text-[0.6rem] tracking-widest uppercase text-goro-gold">
                                Petunjuk Arah ke {name}
                            </span>
                        </div>
                        <div className="space-y-0">
                            {destRouteInfo.steps.map((step, i) => (
                                <ManeuverStep
                                    key={i}
                                    step={step}
                                    index={i}
                                    total={destRouteInfo.steps.length}
                                    destLabel={name}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════
   3D VIEWER
   ═══════════════════════════════════════════════════════════════════ */
function Viewer3D({ sceneConfig, name }) {
    const canvasRef = useRef(null);
    const wrapRef = useRef(null);
    const { resetView } = useThreeViewer(canvasRef, wrapRef, sceneConfig);

    return (
        <div
            ref={wrapRef}
            className="relative w-full rounded-2xl overflow-hidden bg-[#04141c] border border-goro-card"
            style={{ aspectRatio: "16/10" }}
        >
            <canvas
                ref={canvasRef}
                className="w-full h-full touch-none cursor-grab active:cursor-grabbing"
            />
            <div className="absolute left-4 bottom-4 z-10 flex items-center gap-2 bg-goro-dark/70 border border-white/10 px-3 py-2 rounded-lg text-xs text-goro-cream/50">
                <span className="text-goro-gold">✦</span>
                Seret untuk memutar · Gulir untuk zoom
            </div>
            <button
                onClick={resetView}
                className="absolute right-4 bottom-4 z-10 flex items-center gap-2 bg-goro-dark/70 border border-white/10 px-3 py-2 rounded-lg text-xs text-goro-cream/60 hover:border-goro-gold/40 hover:text-goro-gold transition-colors"
            >
                <RotateCcw className="w-3 h-3" /> Reset
            </button>
            <div className="absolute top-4 left-4 z-10 px-3 py-1.5 bg-goro-dark/70 border border-goro-gold/30 rounded-full font-mono text-[0.55rem] tracking-widest uppercase text-goro-gold">
                Diorama 3D
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════════ */
export default function DestinationDetail() {
    const { destination: dest } = usePage().props;

    const [activeHotel, setActiveHotel] = useState(null);
    const [popupHotel, setPopupHotel] = useState(null);
    const [hotelRouteGeometry, setHotelRouteGeometry] = useState(null);
    const [liveDistance, setLiveDistance] = useState(null);

    useEffect(() => {
        if (!navigator.geolocation) return;
        const watchId = navigator.geolocation.watchPosition(
            (pos) => {
                const dist = haversineDistance(
                    pos.coords.latitude,
                    pos.coords.longitude,
                    dest.lat,
                    dest.lng
                );
                setLiveDistance(dist < 1 ? `${Math.round(dist * 1000)} m` : `${dist.toFixed(1)} km`);
            },
            () => {},
            { enableHighAccuracy: true, timeout: 15000 }
        );
        return () => navigator.geolocation.clearWatch(watchId);
    }, [dest.lat, dest.lng]);

    const handleHotelSelect = useCallback((hotel) => {
        setActiveHotel(hotel);
        setPopupHotel(hotel);
        setHotelRouteGeometry(null);
    }, []);

    const handlePopupClose = useCallback(() => {
        setPopupHotel(null);
        setActiveHotel(null);
        setHotelRouteGeometry(null);
    }, []);

    const handleRouteToHotel = useCallback((route) => {
        if (route && route.geometry) {
            setHotelRouteGeometry(route.geometry);
        } else {
            setHotelRouteGeometry(null);
        }
    }, []);

    if (!dest) {
        return (
            <>
                <Head title="Destinasi Tidak Ditemukan" />
                <div className="min-h-screen bg-goro-dark text-goro-cream flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="font-display text-4xl mb-4">
                            Destinasi Tidak Ditemukan
                        </h1>
                        <Link href="/" className="text-goro-gold underline">
                            Kembali ke Beranda
                        </Link>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Head title={`${dest.name} — GO360`} />
            <div className="min-h-screen bg-goro-dark text-goro-cream">
                <LandingNavbar />

                {/* Hero Image */}
                <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
                    <img
                        src={dest.image}
                        alt={dest.name}
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{ filter: "saturate(1.15)" }}
                    />
                    <div className="gradient-hero absolute inset-0" />
                    <div className="absolute inset-0 bg-goro-dark/30" />
                    <div className="relative z-10 h-full flex flex-col justify-end pb-12 px-6 md:px-16 max-w-6xl mx-auto">
                        <Link
                            href="/#explore"
                            className="inline-flex items-center gap-2 text-goro-cream/60 hover:text-goro-gold transition-colors mb-6 w-fit font-mono text-xs tracking-wider"
                        >
                            <ArrowLeft className="w-4 h-4" /> Kembali
                        </Link>
                        <span className="inline-block w-fit px-4 py-1.5 rounded-full border border-goro-gold/30 bg-goro-gold/10 font-mono text-[0.6rem] tracking-widest uppercase text-goro-gold mb-4">
                            {dest.tag}
                        </span>
                        <h1 className="font-display text-4xl md:text-6xl font-light leading-tight text-balance">
                            {dest.name}
                        </h1>
                        <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-goro-cream/60">
                            <span className="flex items-center gap-1.5">
                                <MapPin className="w-4 h-4 text-goro-gold" />
                                {dest.details.location}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4 text-goro-gold" />
                                {dest.details.duration}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Star className="w-4 h-4 text-goro-gold" />
                                {dest.details.rating} / 5
                            </span>
                        </div>
                    </div>
                </section>

                {/* Content */}
                <section className="max-w-6xl mx-auto px-6 md:px-16 py-16">
                    {/* 3D Viewer */}
                    <div id="diorama" className="mb-16 scroll-mt-24">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-1.5 h-1.5 rounded-full bg-goro-gold" />
                            <h2 className="font-display text-2xl font-light">
                                Diorama 3D
                            </h2>
                        </div>
                        <Viewer3D
                            sceneConfig={dest.sceneConfig}
                            name={dest.name}
                        />
                        <p className="text-goro-cream/40 text-xs mt-3 font-light">
                            Model 3D interaktif — seret untuk memutar, gulir
                            untuk zoom. Dibangun dengan Three.js.
                        </p>
                    </div>

                    {/* Description + Details */}
                    <div id="tentang" className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16 scroll-mt-24">
                        <div className="lg:col-span-2">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-1.5 h-1.5 rounded-full bg-goro-gold" />
                                <h2 className="font-display text-2xl font-light">
                                    Tentang Destinasi
                                </h2>
                            </div>
                            <p className="text-goro-cream/70 text-base leading-relaxed font-light">
                                {dest.description}
                            </p>
                            <div className="mt-8 p-6 rounded-2xl bg-goro-card/50 border border-white/5">
                                <h3 className="font-display text-lg text-goro-cream mb-4">
                                    Highlights
                                </h3>
                                <ul className="space-y-3">
                                    {dest.details.highlights.map((h, i) => (
                                        <li
                                            key={i}
                                            className="flex items-start gap-3 text-sm text-goro-cream/60 font-light"
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full bg-goro-gold mt-1.5 shrink-0" />
                                            {h}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-1.5 h-1.5 rounded-full bg-goro-gold" />
                                <h2 className="font-display text-2xl font-light">
                                    Info
                                </h2>
                            </div>
                            <div className="space-y-4">
                                {[
                                    {
                                        label: "Lokasi",
                                        value: dest.details.location,
                                    },
                                    {
                                        label: "Durasi Kunjungan",
                                        value: dest.details.duration,
                                    },
                                    { label: "Jarak dari Pusat Kota", value: dest.distance },
                                    {
                                        label: "Jarak dari Lokasi Anda",
                                        value: liveDistance || "Menghitung...",
                                    },
                                    {
                                        label: "Rating",
                                        value: (
                                            <span className="flex items-center gap-1">
                                                <Star className="w-3.5 h-3.5 text-goro-gold" />
                                                {dest.details.rating} / 5
                                            </span>
                                        ),
                                    },
                                    {
                                        label: "Koordinat",
                                        value: (
                                            <span className="font-mono text-xs">
                                                {dest.lat.toFixed(4)}°S,{" "}
                                                {dest.lng.toFixed(4)}°E
                                            </span>
                                        ),
                                    },
                                ].map((item) => (
                                    <div
                                        key={item.label}
                                        className="p-4 rounded-xl bg-goro-card/50 border border-white/5"
                                    >
                                        <span className="font-mono text-[0.55rem] tracking-widest uppercase text-goro-gold block mb-1">
                                            {item.label}
                                        </span>
                                        <span className="text-sm text-goro-cream/80 font-light">
                                            {item.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Leaflet Map */}
                    <div id="peta" className="mb-16 scroll-mt-24">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-1.5 h-1.5 rounded-full bg-goro-gold" />
                            <h2 className="font-display text-2xl font-light">
                                Lokasi di Peta
                            </h2>
                        </div>
                        <LeafletMap
                            lat={dest.lat}
                            lng={dest.lng}
                            name={dest.name}
                            hotels={dest.hotels}
                            activeHotel={activeHotel}
                            onHotelMarkerClick={handleHotelSelect}
                            hotelRouteGeometry={hotelRouteGeometry}
                        />
                        <p className="text-goro-cream/40 text-xs mt-3 font-light">
                            Klik "Kunjungi" di peta untuk rute ke destinasi.
                            Klik "Kunjungi" di hotel untuk rute ke penginapan.
                        </p>
                    </div>

                    {/* Hotel Recommendations */}
                    <div id="penginapan" className="scroll-mt-24">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-goro-gold" />
                            <h2 className="font-display text-2xl font-light">
                                Rekomendasi Penginapan
                            </h2>
                        </div>
                        <p className="text-goro-cream/40 text-sm mb-8 font-light">
                            Pilihan tempat menginap di sekitar {dest.name} —
                            klik "Kunjungi" untuk melihat rute.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {dest.hotels.map((hotel) => (
                                <HotelCard
                                    key={hotel.id}
                                    hotel={hotel}
                                    onSelect={handleHotelSelect}
                                    isActive={activeHotel?.id === hotel.id}
                                />
                            ))}
                        </div>
                    </div>
                </section>

                <Footer />
            </div>

            {/* Floating Navigation Popup */}
            {popupHotel && (
                <FloatingNavPopup
                    hotel={popupHotel}
                    onClose={handlePopupClose}
                    onRouteToHotel={handleRouteToHotel}
                />
            )}

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
                    margin: 8px 12px !important;
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
                .user-marker-pulse {
                    position: absolute;
                    width: 40px;
                    height: 40px;
                    top: -11px;
                    left: -11px;
                    border-radius: 50%;
                    background: rgba(34,197,94,0.2);
                    animation: user-pulse 2s ease-out infinite;
                }
                @keyframes user-pulse {
                    0% { transform: scale(0.5); opacity: 1; }
                    100% { transform: scale(2); opacity: 0; }
                }
                .leaflet-interactive {
                    filter: drop-shadow(0 2px 4px rgba(74,144,217,0.3));
                }
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </>
    );
}
