import { useState } from "react";
import { Link } from "@inertiajs/react";
import {
    MapPin,
    Trees,
    Landmark,
    Waves,
    ScrollText,
    UtensilsCrossed,
    Mountain,
    Layers,
} from "lucide-react";
import { destinations, interests } from "@/data/landing";
import { useInView } from "@/hooks/useLanding";

const LUCIDE_MAP = {
    Trees,
    Landmark,
    Waves,
    ScrollText,
    UtensilsCrossed,
    Mountain,
};

const ALL_CATEGORIES = [{ id: "all", label: "Semua", lucide: "Layers" }, ...interests];

function DestinationCard({ dest, index, isInView }) {
    return (
        <div
            className={`group relative overflow-hidden rounded-2xl bg-goro-card ${
                isInView ? "animate-scale-in" : "opacity-0"
            }`}
            style={{ aspectRatio: "3/4", animationDelay: `${index * 100}ms` }}
        >
            <img
                src={dest.image}
                alt={dest.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="gradient-card absolute inset-0 transition-opacity duration-500 group-hover:opacity-80" />

            <div className="absolute inset-0 p-5 flex flex-col justify-end">
                <span className="inline-block w-fit px-3 py-1 rounded-full bg-goro-gold/20 border border-goro-gold/30 font-mono text-[0.55rem] tracking-widest uppercase text-goro-gold mb-2">
                    {dest.tag}
                </span>
                <h3 className="font-display text-xl font-light text-goro-cream mb-1">
                    {dest.name}
                </h3>
                <p className="text-goro-cream/60 text-xs leading-relaxed mb-3 font-light">
                    {dest.description}
                </p>
                <div className="flex items-center justify-between">
                    <span className="font-mono text-[0.6rem] text-goro-gold tracking-wider flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {dest.distance}
                    </span>
                    <Link
                        href={`/destination/${dest.id}`}
                        className="w-8 h-8 rounded-full bg-goro-gold/20 border border-goro-gold/40 flex items-center justify-center text-goro-gold hover:bg-goro-gold hover:text-goro-dark transition-all text-xs group-hover:translate-x-1"
                    >
                        →
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function Explore() {
    const [activeCategory, setActiveCategory] = useState("all");
    const [ref, isInView] = useInView();

    const filteredDestinations =
        activeCategory === "all"
            ? destinations
            : destinations.filter(
                  (d) => d.category.toLowerCase() === activeCategory
              );

    return (
        <section
            id="explore"
            ref={ref}
            className="py-24 md:py-32 px-6 md:px-16 max-w-7xl mx-auto"
        >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                <div>
                    <span
                        className={`inline-block w-fit px-4 py-1.5 rounded-full border border-goro-gold/30 bg-goro-gold/10 font-mono text-[0.6rem] tracking-widest uppercase text-goro-gold mb-4 ${
                            isInView ? "animate-fade-up" : "opacity-0"
                        }`}
                    >
                        Destinasi Unggulan
                    </span>
                    <h2
                        className={`font-display text-4xl md:text-6xl font-light leading-tight ${
                            isInView ? "animate-fade-up" : "opacity-0"
                        }`}
                        style={{ animationDelay: "100ms" }}
                    >
                        Temukan Destinasi
                        <br />
                        <em className="italic text-goro-gold">
                            Pilihan Anda
                        </em>
                    </h2>
                </div>
                <p
                    className={`text-goro-cream/50 max-w-xs text-sm leading-relaxed font-light ${
                        isInView ? "animate-fade-up" : "opacity-0"
                    }`}
                    style={{ animationDelay: "200ms" }}
                >
                    127 destinasi wisata tersebar dari pesisir Teluk Tomini
                    hingga pegunungan Bone Bolango.
                </p>
            </div>

            {/* Category filters — single select */}
            <div className="flex flex-wrap gap-3 mb-12">
                {ALL_CATEGORIES.map((cat, i) => {
                    const LucideIcon =
                        cat.lucide === "Layers"
                            ? Layers
                            : LUCIDE_MAP[cat.lucide] || Layers;
                    const isActive = activeCategory === cat.id;

                    return (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all text-sm font-medium ${
                                isInView ? "animate-fade-up" : "opacity-0"
                            } ${
                                isActive
                                    ? "bg-goro-gold border-goro-gold text-goro-dark shadow-lg shadow-goro-gold/20"
                                    : "border-goro-card text-goro-cream/60 hover:border-goro-gold/40 hover:text-goro-cream"
                            }`}
                            style={{ animationDelay: `${i * 50 + 250}ms` }}
                        >
                            <LucideIcon className="w-4 h-4" />
                            <span>{cat.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Destination grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {filteredDestinations.map((dest, i) => (
                    <DestinationCard
                        key={dest.id}
                        dest={dest}
                        index={i}
                        isInView={isInView}
                    />
                ))}
            </div>

            {filteredDestinations.length === 0 && (
                <div className="py-20 text-center text-goro-cream/30 font-light font-display text-2xl italic">
                    Tidak ada destinasi untuk kategori ini.
                </div>
            )}
        </section>
    );
}
