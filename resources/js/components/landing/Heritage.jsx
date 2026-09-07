import { useState } from "react";
import { heritageItems } from "@/data/landing";
import { useInView } from "@/hooks/useLanding";

export default function Heritage() {
    const [activeHeritage, setActiveHeritage] = useState(0);
    const [ref, isInView] = useInView();

    const active = heritageItems[activeHeritage];

    return (
        <section id="heritage" ref={ref} className="py-24 md:py-32 px-6 md:px-16">
            <div className="max-w-7xl mx-auto">
                <div className="mb-16">
                    <span
                        className={`inline-block w-fit px-4 py-1.5 rounded-full border border-goro-gold/30 bg-goro-gold/10 font-mono text-[0.6rem] tracking-widest uppercase text-goro-gold mb-4 ${
                            isInView ? "animate-fade-up" : "opacity-0"
                        }`}
                    >
                        Living Heritage
                    </span>
                    <h2
                        className={`font-display text-4xl md:text-6xl font-light leading-tight ${
                            isInView ? "animate-fade-up" : "opacity-0"
                        }`}
                        style={{ animationDelay: "100ms" }}
                    >
                        Budaya yang Masih{" "}
                        <em className="italic text-goro-gold">Bernafas</em>
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                    {/* Main showcase */}
                    <div
                        className={`relative rounded-2xl overflow-hidden bg-goro-card ${
                            isInView ? "animate-scale-in" : "opacity-0"
                        }`}
                        style={{ minHeight: 500, animationDelay: "200ms" }}
                    >
                        <img
                            src={active.image}
                            alt={active.title}
                            className="w-full h-full object-cover transition-all duration-700"
                            style={{ minHeight: 500 }}
                        />
                        <div className="gradient-card absolute inset-0" />
                        <div className="absolute bottom-0 left-0 right-0 p-8">
                            <span className="inline-block w-fit px-3 py-1 rounded-full bg-goro-gold/20 border border-goro-gold/30 font-mono text-[0.55rem] tracking-widest uppercase text-goro-gold mb-3">
                                {active.subtitle}
                            </span>
                            <h3 className="font-display text-3xl font-light text-goro-cream mb-2">
                                {active.title}
                            </h3>
                            <p className="text-goro-cream/60 text-sm font-light leading-relaxed max-w-md">
                                {active.description}
                            </p>
                        </div>
                    </div>

                    {/* Heritage list */}
                    <div className="flex flex-col gap-2">
                        {heritageItems.map((item, i) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveHeritage(i)}
                                className={`relative overflow-hidden rounded-2xl text-left transition-all duration-500 ${
                                    isInView ? "animate-fade-up" : "opacity-0"
                                } ${
                                    i === activeHeritage
                                        ? "flex-1"
                                        : "flex-none h-28"
                                } bg-goro-card`}
                                style={{
                                    minHeight: i === activeHeritage ? 160 : 112,
                                    animationDelay: `${i * 100 + 200}ms`,
                                }}
                            >
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                                    style={{
                                        opacity:
                                            i === activeHeritage ? 0.8 : 0.4,
                                    }}
                                />
                                <div className="gradient-card absolute inset-0" />
                                <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between">
                                    <div>
                                        <p className="font-mono text-[0.55rem] text-goro-gold tracking-widest uppercase mb-1">
                                            {item.subtitle}
                                        </p>
                                        <h4 className="font-display text-xl font-light text-goro-cream">
                                            {item.title}
                                        </h4>
                                    </div>
                                    <div
                                        className={`w-7 h-7 rounded-full border transition-all duration-300 flex items-center justify-center text-xs ${
                                            i === activeHeritage
                                                ? "bg-goro-gold border-goro-gold text-goro-dark scale-110"
                                                : "border-goro-cream/20 text-goro-cream/40 hover:border-goro-gold/40"
                                        }`}
                                    >
                                        →
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
