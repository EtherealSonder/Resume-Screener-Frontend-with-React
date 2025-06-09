import { useEffect, useRef, useState } from "react";
import TopNavLandingPage from "./landingpage/TopNavLandingPage";
import HeroTextLandingPage from "./landingpage/HeroTextLandingPage";
import CarouselSection from "./landingpage/CarouselSection";
import WhyLUPIQ from "./landingpage/WhyLUPIQ";

export default function LandingPage() {
    const heroRef = useRef(null);
    const whyRef = useRef(null);
    const carouselRef = useRef(null);
    const [activeSection, setActiveSection] = useState(0);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const sectionId = entry.target.id;
                        if (sectionId === "hero") setActiveSection(0);
                        else if (sectionId === "why-lupiq") setActiveSection(1);
                        else if (sectionId === "carousel") setActiveSection(2);
                    }
                });
            },
            { threshold: 0.5 }
        );

        [heroRef, whyRef, carouselRef].forEach((ref) => {
            if (ref.current) observer.observe(ref.current);
        });

        return () => {
            [heroRef, whyRef, carouselRef].forEach((ref) => {
                if (ref.current) observer.unobserve(ref.current);
            });
        };
    }, []);

    return (
        <div
            className="relative w-full h-screen text-white font-sans overflow-x-hidden overflow-y-auto snap-y snap-mandatory scroll-smooth"
            style={{
                background: `radial-gradient(600px circle at 30% 20%, #a855f733, transparent 60%), #1f2937`,
            }}
        >
            <TopNavLandingPage />

            <section id="hero" ref={heroRef} className="snap-start snap-always w-full min-h-screen pt-[96px]">
                <HeroTextLandingPage />
            </section>

            <section id="why-lupiq" ref={whyRef} className="snap-start snap-always w-full min-h-screen pt-[96px]">
                <WhyLUPIQ />
            </section>

            <section id="carousel" ref={carouselRef} className="snap-start snap-always w-full min-h-screen pt-[96px]">
                <CarouselSection />
            </section>

            <div className="fixed top-1/2 right-8 transform -translate-y-1/2 flex flex-col space-y-3 z-50">
                {[0, 1, 2].map((i) => (
                    <button
                        key={i}
                        onClick={() => {
                            const id = i === 0 ? "hero" : i === 1 ? "why-lupiq" : "carousel";
                            document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${activeSection === i
                            ? "bg-white scale-125 shadow-md animate-pulse"
                            : "bg-gray-500 opacity-60"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
