import { useInView } from "@/hooks/useLanding";

export default function CtaBanner() {
    const [ref, isInView] = useInView();

    return (
        <section ref={ref} className="relative overflow-hidden py-28 px-6 md:px-16 text-center">
            <img
                src="https://images.unsplash.com/photo-1542897643-8158da5b4607?w=1400&h=600&fit=crop&auto=format"
                alt="Budaya dan tradisi Gorontalo"
                className="absolute inset-0 w-full h-full object-cover opacity-25"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-goro-dark via-goro-dark/70 to-goro-dark" />
            <div className="relative z-10">
                <span
                    className={`inline-block w-fit px-4 py-1.5 rounded-full border border-goro-gold/30 bg-goro-gold/10 font-mono text-[0.6rem] tracking-widest uppercase text-goro-gold mb-6 mx-auto ${
                        isInView ? "animate-fade-up" : "opacity-0"
                    }`}
                >
                    Mulai Sekarang
                </span>
                <h2
                    className={`font-display text-4xl md:text-6xl font-light leading-tight mb-6 text-balance ${
                        isInView ? "animate-fade-up" : "opacity-0"
                    }`}
                    style={{ animationDelay: "100ms" }}
                >
                    Gorontalo Menunggu{" "}
                    <em className="italic text-goro-gold">
                        Kedatangan Anda
                    </em>
                </h2>
                <p
                    className={`text-goro-cream/50 max-w-xl mx-auto mb-10 font-light ${
                        isInView ? "animate-fade-up" : "opacity-0"
                    }`}
                    style={{ animationDelay: "200ms" }}
                >
                    Dari terumbu karang Pantai Olele hingga sulaman Karawo
                    yang memukau — setiap sudut Gorontalo menyimpan cerita
                    yang menunggu untuk ditemukan.
                </p>
                <a
                    href="#explore"
                    className={`inline-block bg-goro-gold text-goro-dark font-mono text-[0.65rem] tracking-widest uppercase px-10 py-4 rounded-full font-semibold hover:bg-goro-gold-light transition-all hover:shadow-lg hover:shadow-goro-gold/20 hover:translate-y-[-2px] ${
                        isInView ? "animate-fade-up" : "opacity-0"
                    }`}
                    style={{ animationDelay: "300ms" }}
                >
                    Eksplorasi Gorontalo →
                </a>
            </div>
        </section>
    );
}
