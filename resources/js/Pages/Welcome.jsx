import { Head } from "@inertiajs/react";
import LandingNavbar from "@/components/landing/LandingNavbar";
import Hero from "@/components/landing/Hero";
import Stats from "@/components/landing/Stats";
import Explore from "@/components/landing/Explore";
import MapSection from "@/components/landing/MapSection";
import Heritage from "@/components/landing/Heritage";
import Hotels from "@/components/landing/Hotels";
import TripPlanner from "@/components/landing/TripPlanner";
import CtaBanner from "@/components/landing/CtaBanner";
import Footer from "@/components/landing/Footer";

export default function Welcome() {
    return (
        <>
            <Head title="Gorontalo Living Heritage" />
            <div className="min-h-full bg-goro-dark text-goro-cream">
                <LandingNavbar />
                <Hero />
                <Stats />
                <MapSection />
                <Explore />
                <Heritage />
                <Hotels />
                <TripPlanner />
                <CtaBanner />
                <Footer />

                <style>{`
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        </>
    );
}
