import { useEffect, useRef, useState } from "react";
import TopNavLandingPage from "./landingpage/TopNavLandingPage";
import HeroTextLandingPage from "./landingpage/HeroTextLandingPage";
import CarouselSection from "./landingpage/CarouselSection";

export default function LandingPage() {
    const heroRef = useRef(null);
    const carouselRef = useRef(null);
    const [activeSection, setActiveSection] = useState(0);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const sectionId = entry.target.id;
                        setActiveSection(sectionId === "hero" ? 0 : 1);
                    }
                });
            },
            { threshold: 0.5 }
        );

        if (heroRef.current) observer.observe(heroRef.current);
        if (carouselRef.current) observer.observe(carouselRef.current);

        return () => {
            if (heroRef.current) observer.unobserve(heroRef.current);
            if (carouselRef.current) observer.unobserve(carouselRef.current);
        };
    }, []);

    return (
        <div className="w-full h-screen bg-[#1f2937] text-white font-sans overflow-x-hidden overflow-y-auto snap-y snap-mandatory scroll-smooth">
            <TopNavLandingPage />
            <section
                id="hero"
                ref={heroRef}
                className="snap-start snap-always w-full h-screen pt-24 flex flex-col justify-center items-center"
            >
                <HeroTextLandingPage />
            </section>
            <section
                id="carousel"
                ref={carouselRef}
                className="snap-start snap-always w-full h-screen pt-24"
            >
                <CarouselSection />
            </section>

            {/* Dot Navigation */}
            <div className="fixed top-1/2 right-8 transform -translate-y-1/2 flex flex-col space-y-3 z-50">
                {[0, 1].map((i) => (
                    <button
                        key={i}
                        onClick={() =>
                            document
                                .getElementById(i === 0 ? "hero" : "carousel")
                                ?.scrollIntoView({ behavior: "smooth" })
                        }
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
