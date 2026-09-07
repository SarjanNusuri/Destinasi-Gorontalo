import { useEffect, useRef } from "react";
import { Link, usePage } from "@inertiajs/react";
import { MapPin, Navigation, Search, Compass } from "lucide-react";
import { useInView } from "@/hooks/useLanding";

const features = [
    { icon: MapPin, label: "Marker per kategori wisata" },
    { icon: Navigation, label: "Lokasi & jarak real-time" },
    { icon: Compass, label: "Rute & estimasi waktu" },
    { icon: Search, label: "Filter & pencarian destinasi" },
];

// Pusat Kota Gorontalo
const GORONTALO_CENTER = [0.5435442, 123.0567693];

export default function MapSection() {
    const { allDestinations } = usePage().props;
    const [ref, isInView] = useInView();

    const mapRef = useRef(null);
    const mapInstance = useRef(null);

    useEffect(() => {
        if (!mapRef.current || mapInstance.current) return;

        let isMounted = true;

        async function init() {
            const L = await import("leaflet");

            if (!isMounted || !mapRef.current) return;

            /*
             * ==========================================
             * INITIALIZE MAP
             * ==========================================
             */
            const map = L.map(mapRef.current, {
                center: GORONTALO_CENTER,
                zoom: 13,
                scrollWheelZoom: false,
                attributionControl: true,
            });

            mapInstance.current = map;

            /*
             * ==========================================
             * OPENSTREETMAP TILE
             * ==========================================
             */
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                maxZoom: 18,
                attribution: "© OpenStreetMap",
            }).addTo(map);

            /*
             * ==========================================
             * WISATA MARKER
             * ==========================================
             */
            const goldIcon = L.divIcon({
                className: "custom-marker",
                html: `
                    <div
                        style="
                            width:24px;
                            height:24px;
                            background:#d4a853;
                            border:3px solid #0f1f17;
                            border-radius:50%;
                            box-shadow:0 0 16px rgba(212,168,83,0.5);
                            display:flex;
                            align-items:center;
                            justify-content:center;
                        "
                    >
                        <div
                            style="
                                width:7px;
                                height:7px;
                                background:#0f1f17;
                                border-radius:50%;
                            "
                        ></div>
                    </div>
                `,
                iconSize: [24, 24],
                iconAnchor: [12, 12],
            });

            /*
             * ==========================================
             * HOTEL MARKER
             * ==========================================
             */
            const hotelIcon = L.divIcon({
                className: "custom-marker",
                html: `
                    <div
                        style="
                            width:20px;
                            height:20px;
                            background:#1a3326;
                            border:2px solid #d4a853;
                            border-radius:50%;
                            display:flex;
                            align-items:center;
                            justify-content:center;
                            box-shadow:0 0 8px rgba(212,168,83,0.3);
                        "
                    >
                        <span style="font-size:9px;">🏨</span>
                    </div>
                `,
                iconSize: [20, 20],
                iconAnchor: [10, 10],
            });

            /*
             * ==========================================
             * DESTINATION MARKERS
             * ==========================================
             */
            allDestinations.forEach((dest) => {
                const destinationMarker = L.marker([dest.lat, dest.lng], {
                    icon: goldIcon,
                }).addTo(map);

                destinationMarker.bindPopup(`
                    <div
                        style="
                            font-family:Manrope,sans-serif;
                            padding:4px;
                            min-width:140px;
                        "
                    >
                        <strong
                            style="
                                color:#d4a853;
                                font-size:13px;
                            "
                        >
                            ${dest.name}
                        </strong>

                        <br>

                        <span
                            style="
                                color:#666;
                                font-size:11px;
                            "
                        >
                            ${dest.tag} · ${dest.distance}
                        </span>

                        <br>

                        <a
                            href="/destination/${dest.id}"
                            style="
                                color:#16a34a;
                                font-size:11px;
                                text-decoration:underline;
                                cursor:pointer;
                            "
                        >
                            Lihat Detail →
                        </a>
                    </div>
                `);

                /*
                 * ==========================================
                 * HOTEL MARKERS
                 * ==========================================
                 */
                if (Array.isArray(dest.hotels)) {
                    dest.hotels.forEach((hotel) => {
                        const hotelMarker = L.marker([hotel.lat, hotel.lng], {
                            icon: hotelIcon,
                        }).addTo(map);

                        hotelMarker.bindPopup(`
                            <div
                                style="
                                    font-family:Manrope,sans-serif;
                                    padding:4px;
                                    min-width:160px;
                                "
                            >
                                ${hotel.image ? `<img src="${hotel.image}" style="width:100%;height:60px;object-fit:cover;border-radius:6px;margin-bottom:6px;" />` : ''}
                                <strong
                                    style="
                                        color:#d4a853;
                                        font-size:12px;
                                    "
                                >
                                    ${hotel.name}
                                </strong>

                                <br>

                                <span
                                    style="
                                        color:#666;
                                        font-size:10px;
                                    "
                                >
                                    ${hotel.type} · ${hotel.price || ''}
                                </span>
                            </div>
                        `);
                    });
                }
            });

            /*
             * ==========================================
             * FIX MAP SIZE
             * ==========================================
             */
            setTimeout(() => {
                if (mapInstance.current) {
                    mapInstance.current.invalidateSize();
                }
            }, 100);
        }

        init();

        /*
         * ==========================================
         * CLEANUP
         * ==========================================
         */
        return () => {
            isMounted = false;

            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, []);

    /*
     * ==========================================
     * HOTEL COUNT
     * ==========================================
     */
    const hotelCount = allDestinations.reduce(
        (total, destination) =>
            total +
            (Array.isArray(destination.hotels) ? destination.hotels.length : 0),
        0,
    );

    return (
        <section
            id="map"
            ref={ref}
            className="py-24 bg-goro-surface px-6 md:px-16"
        >
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row gap-12 items-start">
                    {/* ==========================================
                        LEFT CONTENT
                    ========================================== */}

                    <div className="md:w-2/5">
                        {/* Badge */}
                        <span
                            className={`
                                inline-block
                                w-fit
                                px-4
                                py-1.5
                                rounded-full
                                border
                                border-goro-gold/30
                                bg-goro-gold/10
                                font-mono
                                text-[0.6rem]
                                tracking-widest
                                uppercase
                                text-goro-gold
                                mb-4
                                ${isInView ? "animate-fade-up" : "opacity-0"}
                            `}
                        >
                            Peta Interaktif
                        </span>

                        {/* Heading */}
                        <h2
                            className={`
                                font-display
                                text-4xl
                                md:text-5xl
                                font-light
                                leading-tight
                                mb-6
                                ${isInView ? "animate-fade-up" : "opacity-0"}
                            `}
                            style={{
                                animationDelay: "100ms",
                            }}
                        >
                            Jelajahi Gorontalo
                            <br />
                            <em className="italic text-goro-gold">dari Peta</em>
                        </h2>

                        {/* Description */}
                        <p
                            className={`
                                text-goro-cream/50
                                text-sm
                                leading-relaxed
                                mb-8
                                font-light
                                ${isInView ? "animate-fade-up" : "opacity-0"}
                            `}
                            style={{
                                animationDelay: "200ms",
                            }}
                        >
                            Temukan destinasi berdasarkan kategori, lihat jarak
                            dari lokasi Anda, estimasi waktu perjalanan, dan
                            tampilkan rute menuju destinasi tujuan.
                        </p>

                        {/* Features */}
                        <div className="space-y-4">
                            {features.map((item, i) => {
                                const Icon = item.icon;

                                return (
                                    <div
                                        key={i}
                                        className={`
                                            flex
                                            items-center
                                            gap-4
                                            ${
                                                isInView
                                                    ? "animate-slide-right"
                                                    : "opacity-0"
                                            }
                                        `}
                                        style={{
                                            animationDelay: `${
                                                i * 100 + 300
                                            }ms`,
                                        }}
                                    >
                                        <div
                                            className="
                                                w-10
                                                h-10
                                                rounded-xl
                                                bg-goro-gold/10
                                                border
                                                border-goro-gold/20
                                                flex
                                                items-center
                                                justify-center
                                            "
                                        >
                                            <Icon className="w-4 h-4 text-goro-gold" />
                                        </div>

                                        <span
                                            className="
                                                text-goro-cream/70
                                                text-sm
                                                font-light
                                            "
                                        >
                                            {item.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Button */}
                        <Link
                            href="/map"
                            className="
                                mt-10
                                inline-block
                                bg-goro-gold
                                text-goro-dark
                                font-mono
                                text-[0.65rem]
                                tracking-widest
                                uppercase
                                px-7
                                py-3.5
                                rounded-full
                                font-semibold
                                hover:bg-goro-gold-light
                                transition-all
                                hover:shadow-lg
                                hover:shadow-goro-gold/20
                                hover:translate-y-[-2px]
                            "
                        >
                            Buka Peta Penuh →
                        </Link>
                    </div>

                    {/* ==========================================
                        MAP
                    ========================================== */}

                    <div
                        className={`
                            md:w-3/5
                            relative
                            rounded-3xl
                            overflow-hidden
                            bg-goro-card
                            border
                            border-white/5
                            ${isInView ? "animate-scale-in" : "opacity-0"}
                        `}
                        style={{
                            minHeight: 460,
                            animationDelay: "200ms",
                        }}
                    >
                        {/* Leaflet Map */}
                        <div
                            ref={mapRef}
                            className="w-full h-full rounded-3xl"
                            style={{
                                minHeight: 460,

                                /*
                                 * Membuat map mengikuti
                                 * tema dark/gold website.
                                 */
                                filter: `
                                    invert(0.88)
                                    hue-rotate(180deg)
                                    brightness(1.1)
                                    contrast(1.1)
                                    saturate(0.3)
                                `,
                            }}
                        />

                        {/* ==========================================
                            MAP INFO
                        ========================================== */}

                        <div
                            className="
                                absolute
                                top-4
                                left-4
                                z-[1000]
                                flex
                                items-center
                                gap-2
                                bg-goro-dark/80
                                backdrop-blur-sm
                                border
                                border-white/10
                                px-3
                                py-2
                                rounded-full
                            "
                        >
                            <div
                                className="
                                    w-2
                                    h-2
                                    rounded-full
                                    bg-goro-gold
                                    animate-pulse
                                "
                            />

                            <span
                                className="
                                    font-mono
                                    text-[0.55rem]
                                    tracking-widest
                                    text-goro-gold
                                    uppercase
                                "
                            >
                                {allDestinations.length} Destinasi · {hotelCount}{" "}
                                Hotel
                            </span>
                        </div>

                        {/* ==========================================
                            LEGEND
                        ========================================== */}

                        <div
                            className="
                                absolute
                                bottom-4
                                left-4
                                z-[1000]
                                flex
                                items-center
                                gap-4
                                bg-goro-dark/80
                                backdrop-blur-sm
                                border
                                border-white/10
                                px-3
                                py-2
                                rounded-xl
                            "
                        >
                            {/* Wisata */}
                            <div className="flex items-center gap-1.5">
                                <div
                                    className="
                                        w-3
                                        h-3
                                        rounded-full
                                        bg-goro-gold
                                    "
                                />

                                <span
                                    className="
                                        text-[0.55rem]
                                        text-goro-cream/60
                                    "
                                >
                                    Wisata
                                </span>
                            </div>

                            {/* Hotel */}
                            <div className="flex items-center gap-1.5">
                                <div
                                    className="
                                        w-3
                                        h-3
                                        rounded-full
                                        bg-goro-card
                                        border
                                        border-goro-gold
                                        flex
                                        items-center
                                        justify-center
                                    "
                                >
                                    <span className="text-[6px]">🏨</span>
                                </div>

                                <span
                                    className="
                                        text-[0.55rem]
                                        text-goro-cream/60
                                    "
                                >
                                    Hotel
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
