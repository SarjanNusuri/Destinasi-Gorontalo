import { useInView } from "@/hooks/useLanding";

export default function Hero() {
    const [ref, isInView] = useInView();

    return (
        <section
            ref={ref}
            className="relative h-screen min-h-[700px] overflow-hidden"
        >
            <img
                src="https://images.unsplash.com/photo-1627967464841-6b32176ddbe8?w=1600&h=1000&fit=crop&auto=format"
                alt="Pantai Gorontalo — hamparan laut tropis biru kehijauan"
                className="absolute inset-0 w-full h-full object-cover object-center scale-105 animate-fade-in"
                style={{ filter: "saturate(1.15)" }}
            />
            <div className="gradient-hero absolute inset-0" />
            <div className="absolute inset-0 bg-goro-dark/30" />

            {/* Decorative vertical line */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-4 opacity-40">
                <div className="h-16 w-px bg-goro-gold" />
                <span
                    className="font-mono text-[0.6rem] tracking-[0.3em] text-goro-gold"
                    style={{ writingMode: "vertical-rl" }}
                >
                    SCROLL TO EXPLORE
                </span>
            </div>

            {/* Decorative dots */}
            <div className="absolute top-32 left-12 hidden lg:block opacity-20">
                <div className="grid grid-cols-3 gap-2">
                    {Array.from({ length: 9 }).map((_, i) => (
                        <div
                            key={i}
                            className="w-1 h-1 rounded-full bg-goro-gold"
                        />
                    ))}
                </div>
            </div>

            <div className="relative z-10 h-full flex flex-col justify-end pb-20 md:pb-28 px-6 md:px-16 max-w-5xl">
                <span
                    className={`inline-block w-fit px-4 py-1.5 rounded-full border border-goro-gold/30 bg-goro-gold/10 font-mono text-[0.6rem] tracking-widest uppercase text-goro-gold mb-5 ${
                        isInView ? "animate-fade-up" : "opacity-0"
                    }`}
                >
                    Gorontalo, Sulawesi Utara
                </span>

                <h1
                    className={`font-display text-5xl md:text-7xl lg:text-8xl font-light leading-[1.02] text-balance mb-6 ${
                        isInView ? "animate-fade-up" : "opacity-0"
                    }`}
                    style={{ animationDelay: "150ms" }}
                >
                    Jelajahi{" "}
                    <em className="italic text-goro-gold font-light">
                        Warisan
                    </em>
                    <br />
                    yang Masih Hidup
                </h1>

                <p
                    className={`text-goro-cream/70 text-lg md:text-xl max-w-2xl leading-relaxed mb-10 font-light ${
                        isInView ? "animate-fade-up" : "opacity-0"
                    }`}
                    style={{ animationDelay: "300ms" }}
                >
                    Destinasi wisata, budaya, dan tradisi Gorontalo dalam satu
                    platform interaktif. Dari peta real-time hingga visualisasi
                    3D destinasi.
                </p>

                <div
                    className={`flex flex-wrap gap-4 ${
                        isInView ? "animate-fade-up" : "opacity-0"
                    }`}
                    style={{ animationDelay: "450ms" }}
                >
                    <a
                        href="#explore"
                        className="bg-goro-gold text-goro-dark font-mono text-[0.65rem] tracking-widest uppercase px-7 py-3.5 rounded-full font-semibold hover:bg-goro-gold-light transition-all hover:shadow-lg hover:shadow-goro-gold/20 hover:translate-y-[-2px]"
                    >
                        Mulai Eksplorasi
                    </a>
                    <a
                        href="#heritage"
                        className="border border-goro-cream/30 text-goro-cream/80 font-mono text-[0.65rem] tracking-widest uppercase px-7 py-3.5 rounded-full hover:border-goro-cream/60 hover:text-goro-cream transition-all hover:translate-y-[-2px]"
                    >
                        Warisan Budaya
                    </a>
                </div>
            </div>
        </section>
    );
}
