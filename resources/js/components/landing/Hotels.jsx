import { useRef } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import {
    MapPin,
    Clock,
    Star,
    BedDouble,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { useInView } from "@/hooks/useLanding";

export default function Hotels() {
    const { hotels, hotelsMeta } = usePage().props;
    const [ref, isInView] = useInView();
    const sectionRef = useRef(null);

    const handlePageChange = (page) => {
        router.get(
            "/",
            { hotels_page: page },
            {
                only: ["hotels", "hotelsMeta"],
                preserveState: true,
                onSuccess: () => {
                    setTimeout(() => {
                        sectionRef.current?.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                        });
                    }, 100);
                },
            }
        );
    };

    return (
        <section
            ref={(el) => {
                ref.current = el;
                sectionRef.current = el;
            }}
            className="py-24 bg-goro-surface px-6 md:px-16"
        >
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <span
                        className={`inline-block w-fit px-4 py-1.5 rounded-full border border-goro-gold/30 bg-goro-gold/10 font-mono text-[0.6rem] tracking-widest uppercase text-goro-gold mb-4 ${
                            isInView ? "animate-fade-up" : "opacity-0"
                        }`}
                    >
                        Penginapan
                    </span>
                    <h2
                        className={`font-display text-4xl md:text-5xl font-light leading-tight mb-6 ${
                            isInView ? "animate-fade-up" : "opacity-0"
                        }`}
                        style={{ animationDelay: "100ms" }}
                    >
                        Rekomendasi
                        <br />
                        <em className="italic text-goro-gold">
                            Tempat Menginap
                        </em>
                    </h2>
                    <p
                        className={`text-goro-cream/50 text-sm leading-relaxed max-w-xl mx-auto font-light ${
                            isInView ? "animate-fade-up" : "opacity-0"
                        }`}
                        style={{ animationDelay: "200ms" }}
                    >
                        {hotelsMeta.total} penginapan terbaik di sekitar
                        destinasi wisata Gorontalo — dari hotel berbintang
                        hingga homestay dengan suasana lokal.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {hotels.map((hotel, i) => (
                        <Link
                            key={hotel.id}
                            href={`/destination/${hotel.destinationId}`}
                            className={`group overflow-hidden rounded-2xl bg-goro-card/50 border border-white/5 hover:border-goro-gold/30 hover:bg-goro-card/80 transition-all ${
                                isInView ? "animate-fade-up" : "opacity-0"
                            }`}
                            style={{ animationDelay: `${i * 60 + 200}ms` }}
                        >
                            {hotel.image && (
                                <div className="relative h-44 overflow-hidden">
                                    <img
                                        src={hotel.image}
                                        alt={hotel.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
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
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-goro-gold/10 border border-goro-gold/20 flex items-center justify-center shrink-0">
                                                <BedDouble className="w-5 h-5 text-goro-gold" />
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="font-display text-base text-goro-cream font-medium truncate">
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
                                                <Star className="w-3 h-3 text-goro-gold fill-goro-gold" />
                                                <span className="text-xs text-goro-cream/50">
                                                    {hotel.rating}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <p className="text-sm text-goro-cream/40 font-light leading-relaxed mb-4 line-clamp-2">
                                    {hotel.description}
                                </p>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4 text-xs text-goro-cream/40">
                                        <span className="flex items-center gap-1">
                                            <MapPin className="w-3 h-3 text-goro-gold/60" />
                                            {hotel.distance} km
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3 text-goro-gold/60" />
                                            ±{hotel.duration} menit
                                        </span>
                                    </div>
                                    <span className="text-xs text-goro-cream/30 group-hover:text-goro-gold transition-colors">
                                        {hotel.destinationName}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {hotels.length === 0 && (
                    <div className="py-20 text-center text-goro-cream/30 font-light font-display text-2xl italic">
                        Belum ada data penginapan.
                    </div>
                )}

                {/* Pagination */}
                {hotelsMeta.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-12">
                        <button
                            onClick={() =>
                                handlePageChange(hotelsMeta.current_page - 1)
                            }
                            disabled={hotelsMeta.current_page <= 1}
                            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-goro-cream/50 hover:border-goro-gold/40 hover:text-goro-gold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        {Array.from(
                            { length: hotelsMeta.last_page },
                            (_, i) => i + 1,
                        ).map((page) => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`w-10 h-10 rounded-full border flex items-center justify-center text-sm font-mono transition-all ${
                                    page === hotelsMeta.current_page
                                        ? "bg-goro-gold border-goro-gold text-goro-dark font-semibold"
                                        : "border-white/10 text-goro-cream/50 hover:border-goro-gold/40 hover:text-goro-gold"
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            onClick={() =>
                                handlePageChange(hotelsMeta.current_page + 1)
                            }
                            disabled={
                                hotelsMeta.current_page >= hotelsMeta.last_page
                            }
                            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-goro-cream/50 hover:border-goro-gold/40 hover:text-goro-gold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
