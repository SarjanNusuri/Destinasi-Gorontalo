import { useState } from "react";
import { interests } from "@/data/landing";
import { useInView } from "@/hooks/useLanding";

const sampleItineraries = [
    [
        "Benteng Otanaha → Danau Limboto → Taman Kota",
        "Pantai Olele (snorkeling) → Kuliner Milu Siram",
        "Air Terjun Tapadaa → Desa Adat Bongo",
    ],
    [
        "Pantai Olele → Benteng Otanaha",
        "Danau Limboto → Kerajinan Karawo",
        "Air Terjun Tapadaa → Kuliner Binte Biluhuta",
    ],
    [
        "Taman Kota → Benteng Otanaha",
        "Pantai Olele → Danau Limboto",
        "Desa Adat Bongo → Air Terjun Tapadaa",
    ],
];

const distances = [45, 62, 78, 55, 88];
const durations = [4, 6, 8, 5, 10];

export default function TripPlanner() {
    const [tripStart, setTripStart] = useState("");
    const [tripDuration, setTripDuration] = useState("2");
    const [selectedInterests, setSelectedInterests] = useState([]);
    const [ref, isInView] = useInView();

    const toggleInterest = (id) => {
        setSelectedInterests((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const dayCount = Math.min(Number(tripDuration), 3);

    return (
        <section id="trip" ref={ref} className="py-24 md:py-32 px-6 md:px-16">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-16">
                    <span
                        className={`inline-block w-fit px-4 py-1.5 rounded-full border border-goro-gold/30 bg-goro-gold/10 font-mono text-[0.6rem] tracking-widest uppercase text-goro-gold mb-4 mx-auto ${
                            isInView ? "animate-fade-up" : "opacity-0"
                        }`}
                    >
                        Trip Planner
                    </span>
                    <h2
                        className={`font-display text-4xl md:text-6xl font-light leading-tight ${
                            isInView ? "animate-fade-up" : "opacity-0"
                        }`}
                        style={{ animationDelay: "100ms" }}
                    >
                        Rencanakan Perjalanan
                        <br />
                        <em className="italic text-goro-gold">
                            Impian Anda
                        </em>
                    </h2>
                    <p
                        className={`text-goro-cream/40 max-w-md mx-auto mt-4 text-sm font-light ${
                            isInView ? "animate-fade-up" : "opacity-0"
                        }`}
                        style={{ animationDelay: "200ms" }}
                    >
                        Sistem akan menyusun itinerari berdasarkan lokasi awal,
                        durasi, dan minat perjalanan Anda.
                    </p>
                </div>

                <div
                    className={`bg-goro-card/50 border border-white/5 rounded-3xl p-8 md:p-12 ${
                        isInView ? "animate-scale-in" : "opacity-0"
                    }`}
                    style={{ animationDelay: "300ms" }}
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div>
                            <label className="font-mono text-[0.6rem] tracking-widest text-goro-gold uppercase block mb-3">
                                Lokasi Awal
                            </label>
                            <input
                                type="text"
                                placeholder="Kota Gorontalo"
                                value={tripStart}
                                onChange={(e) => setTripStart(e.target.value)}
                                className="w-full bg-goro-dark/60 border border-white/10 rounded-xl px-5 py-3.5 text-goro-cream placeholder-goro-cream/20 text-sm font-light focus:outline-none focus:border-goro-gold/50 focus:ring-1 focus:ring-goro-gold/20 transition-all"
                            />
                        </div>
                        <div>
                            <label className="font-mono text-[0.6rem] tracking-widest text-goro-gold uppercase block mb-3">
                                Durasi Perjalanan
                            </label>
                            <select
                                value={tripDuration}
                                onChange={(e) =>
                                    setTripDuration(e.target.value)
                                }
                                className="w-full bg-goro-dark/60 border border-white/10 rounded-xl px-5 py-3.5 text-goro-cream text-sm font-light focus:outline-none focus:border-goro-gold/50 focus:ring-1 focus:ring-goro-gold/20 transition-all appearance-none cursor-pointer"
                            >
                                <option value="1">1 Hari</option>
                                <option value="2">2 Hari</option>
                                <option value="3">3 Hari</option>
                                <option value="5">5 Hari</option>
                                <option value="7">1 Minggu</option>
                            </select>
                        </div>
                        <div>
                            <label className="font-mono text-[0.6rem] tracking-widest text-goro-gold uppercase block mb-3">
                                Minat Wisata
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {interests.slice(0, 4).map((interest) => (
                                    <button
                                        key={interest.id}
                                        onClick={() =>
                                            toggleInterest(interest.id)
                                        }
                                        className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                                            selectedInterests.includes(
                                                interest.id
                                            )
                                                ? "bg-goro-gold/20 border-goro-gold/60 text-goro-gold"
                                                : "border-white/10 text-goro-cream/40 hover:border-goro-gold/30"
                                        }`}
                                    >
                                        {interest.icon} {interest.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button className="w-full md:w-auto bg-goro-gold text-goro-dark font-mono text-[0.65rem] tracking-widest uppercase px-10 py-4 rounded-full font-semibold hover:bg-goro-gold-light transition-all hover:shadow-lg hover:shadow-goro-gold/20 hover:translate-y-[-2px]">
                        Buat Rencana Perjalanan →
                    </button>

                    {/* Sample itinerary preview */}
                    <div className="mt-10 pt-10 border-t border-white/5">
                        <p className="font-mono text-[0.6rem] tracking-widest text-goro-cream/30 uppercase mb-6">
                            Contoh Itinerari — {tripDuration} Hari
                        </p>
                        <div className="space-y-4">
                            {Array.from({ length: dayCount }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`flex gap-5 items-start ${
                                        isInView
                                            ? "animate-slide-right"
                                            : "opacity-0"
                                    }`}
                                    style={{
                                        animationDelay: `${i * 100 + 400}ms`,
                                    }}
                                >
                                    <div className="shrink-0 w-12 h-12 rounded-full bg-goro-gold/10 border border-goro-gold/20 flex items-center justify-center">
                                        <span className="font-display text-lg text-goro-gold font-light">
                                            {i + 1}
                                        </span>
                                    </div>
                                    <div className="flex-1 pt-1">
                                        <p className="text-goro-cream/80 text-sm font-light mb-1">
                                            {sampleItineraries[
                                                Number(tripDuration) % 3
                                            ]?.[i] || sampleItineraries[0][i]}
                                        </p>
                                        <p className="font-mono text-[0.55rem] text-goro-cream/25 tracking-wider">
                                            ±{distances[i]} km · estimasi{" "}
                                            {durations[i]} jam
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
