import { Link } from "@inertiajs/react";
import { MapPin, Clock, Star, BedDouble, ArrowRight } from "lucide-react";
import { useInView } from "@/hooks/useLanding";
import { destinations } from "@/data/landing";

export default function Hotels() {
    const [ref, isInView] = useInView();

    const allHotels = destinations.flatMap((dest) =>
        dest.hotels.map((h) => ({ ...h, destinationName: dest.name, destinationId: dest.id }))
    );

    return (
        <section
            ref={ref}
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
                        Temukan penginapan terbaik di sekitar destinasi wisata Gorontalo — dari hotel berbintang hingga homestay dengan suasana lokal.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {allHotels.map((hotel, i) => (
                        <Link
                            key={hotel.id}
                            href={`/destination/${hotel.destinationId}`}
                            className={`group p-5 rounded-2xl bg-goro-card/50 border border-white/5 hover:border-goro-gold/30 hover:bg-goro-card/80 transition-all ${
                                isInView ? "animate-fade-up" : "opacity-0"
                            }`}
                            style={{ animationDelay: `${i * 60 + 200}ms` }}
                        >
                            <div className="flex items-start justify-between gap-3 mb-3">
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
                                        <Clock className="w-3 h-3 text-goro-gold/60" />±
                                        {hotel.duration} menit
                                    </span>
                                </div>
                                <span className="text-xs text-goro-cream/30 group-hover:text-goro-gold transition-colors">
                                    {hotel.destinationName}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
