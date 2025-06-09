import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const carouselItems = [
    {
        src: "/_candidate_card.gif",
        alt: "Candidate Evaluation",
        tagline: "Instantly view candidate strengths, skills, and fit score.",
    },
    {
        src: "/_top_candidates.gif",
        alt: "Top Candidates Analytics",
        tagline: "Discover top talent with ranked insights by role.",
    },
    {
        src: "/_word_cloud.gif",
        alt: "Skill Word Cloud",
        tagline: "See the most frequent technical skills by job title.",
    },
    {
        src: "/_radar_chart.png",
        alt: "Skill Radar Chart",
        tagline: "Compare skill profiles across multiple roles visually.",
    },
    {
        src: "/_eval_settings.gif",
        alt: "Custom Evaluation Settings",
        tagline: "Tailor your scoring logic and AI evaluation criteria.",
    },
];

export default function HeroCarouselLandingPage() {
    const [index, setIndex] = useState(0);
    const intervalRef = useRef(null);

    const next = () => setIndex((prev) => (prev + 1) % carouselItems.length);
    const prev = () => setIndex((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);

    const pause = () => clearInterval(intervalRef.current);
    const play = () => {
        intervalRef.current = setInterval(next, 4000);
    };

    useEffect(() => {
        play();
        return pause;
    }, []);

    return (
        <div
            className="w-full lg:w-1/2 mt-12 lg:mt-0 flex flex-col items-center text-center pl-4"
            onMouseEnter={pause}
            onMouseLeave={play}
        >
            <div className="relative w-[500px] h-[400px] rounded-2xl overflow-hidden shadow-xl border border-white/10 bg-[#eff1f4] text-[#1f2937] backdrop-blur-md">
                <img
                    src={carouselItems[index].src}
                    alt={carouselItems[index].alt}
                    className="w-full h-[300px] object-contain transition duration-500 ease-in-out"
                />
                <p className="text-sm px-4 py-3 min-h-[64px] text-center font-medium">
                    {carouselItems[index].tagline}
                </p>

                <button
                    onClick={prev}
                    className="absolute top-1/2 left-3 transform -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-white hover:text-black transition"
                >
                    <ChevronLeft size={20} />
                </button>
                <button
                    onClick={next}
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-white hover:text-black transition"
                >
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
}
