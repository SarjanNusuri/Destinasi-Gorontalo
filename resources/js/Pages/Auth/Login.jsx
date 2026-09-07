import { useState } from "react";
import { Head } from "@inertiajs/react";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <>
            <Head title="Login — Admin GO360" />
            <div className="min-h-screen bg-goro-dark flex items-center justify-center px-6">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <div className="text-center mb-10">
                        <div className="w-14 h-14 rounded-full bg-goro-gold flex items-center justify-center mx-auto mb-4">
                            <span className="text-goro-dark font-bold text-lg font-mono">
                                GLH
                            </span>
                        </div>
                        <h1 className="font-display text-2xl text-goro-cream font-light">
                            Gorontalo Living Heritage
                        </h1>
                        <p className="text-goro-cream/40 text-xs mt-2 font-mono tracking-wider uppercase">
                            Admin Panel
                        </p>
                    </div>

                    {/* Form */}
                    <div className="bg-goro-card/50 border border-white/5 rounded-2xl p-8">
                        <h2 className="font-display text-lg text-goro-cream mb-6">
                            Masuk ke Dashboard
                        </h2>

                        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
                            <div>
                                <label className="font-mono text-[0.6rem] tracking-widest uppercase text-goro-gold block mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    placeholder="admin@go360.id"
                                    className="w-full bg-goro-dark/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-goro-cream placeholder:text-goro-cream/20 focus:outline-none focus:border-goro-gold/40 transition-colors"
                                />
                            </div>

                            <div>
                                <label className="font-mono text-[0.6rem] tracking-widest uppercase text-goro-gold block mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="w-full bg-goro-dark/60 border border-white/10 rounded-xl px-4 py-3 pr-11 text-sm text-goro-cream placeholder:text-goro-cream/20 focus:outline-none focus:border-goro-gold/40 transition-colors"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-goro-cream/30 hover:text-goro-cream transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 rounded border-white/20 bg-goro-dark text-goro-gold focus:ring-goro-gold/40"
                                    />
                                    <span className="text-xs text-goro-cream/40">
                                        Ingat saya
                                    </span>
                                </label>
                                <a
                                    href="#"
                                    className="text-xs text-goro-gold/60 hover:text-goro-gold transition-colors"
                                >
                                    Lupa password?
                                </a>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-goro-gold text-goro-dark py-3 rounded-xl font-semibold text-sm hover:bg-goro-gold-light transition-all hover:shadow-lg hover:shadow-goro-gold/20"
                            >
                                Masuk
                            </button>
                        </form>
                    </div>

                    <p className="text-center text-goro-cream/20 text-xs mt-6">
                        © 2026 Gorontalo Living Heritage
                    </p>
                </div>
            </div>
        </>
    );
}
