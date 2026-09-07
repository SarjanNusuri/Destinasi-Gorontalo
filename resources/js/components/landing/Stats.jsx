import { useInView, useCountUp } from "@/hooks/useLanding";
import { stats } from "@/data/landing";

function StatItem({ stat, index, isInView }) {
    const display = useCountUp(stat.value, 2000, isInView);

    return (
        <div
            className={`px-8 py-10 flex flex-col gap-1 border-r border-goro-card last:border-r-0 transition-all duration-500 ${
                isInView ? "animate-fade-up" : "opacity-0"
            }`}
            style={{ animationDelay: `${index * 100}ms` }}
        >
            <span className="font-display text-4xl font-light text-goro-gold">
                {display}
            </span>
            <span className="font-mono text-[0.6rem] tracking-widest uppercase text-goro-cream/40">
                {stat.label}
            </span>
        </div>
    );
}

export default function Stats() {
    const [ref, isInView] = useInView();

    return (
        <section
            ref={ref}
            className="border-t border-b border-goro-card bg-goro-surface"
        >
            <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4">
                {stats.map((stat, i) => (
                    <StatItem
                        key={i}
                        stat={stat}
                        index={i}
                        isInView={isInView}
                    />
                ))}
            </div>
        </section>
    );
}
