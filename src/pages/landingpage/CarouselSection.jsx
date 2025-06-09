import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const carouselItems = [
    {
        src: "/_candidate_card.gif",
        alt: "Candidate Evaluation",
        tagline: "Instantly view strengths, skills, and AI-evaluated fit score.",
    },
    {
        src: "/_top_candidates.gif",
        alt: "Top Candidates Analytics",
        tagline: "Identify top applicants with visual, role-specific scoring.",
    },
    {
        src: "/_word_cloud.gif",
        alt: "Skill Word Cloud",
        tagline: "Visualize dominant technical skills across candidate pools.",
    },
    {
        src: "/_radar_chart.png",
        alt: "Skill Radar Chart",
        tagline: "Compare skill alignment between job expectations and candidates.",
    },
    {
        src: "/_eval_settings.gif",
        alt: "Custom Evaluation Settings",
        tagline: "Define your own scoring rubric, preferences, and soft skill weightings.",
    },
];

export default function CarouselSection() {
    const [index, setIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    const next = () => {
        setDirection(1);
        setIndex((prev) => (prev + 1) % carouselItems.length);
    };

    const prev = () => {
        setDirection(-1);
        setIndex((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
    };

    const getIndices = () => {
        const prevIndex = (index - 1 + carouselItems.length) % carouselItems.length;
        const nextIndex = (index + 1) % carouselItems.length;
        return { prevIndex, currentIndex: index, nextIndex };
    };

    const { prevIndex, currentIndex, nextIndex } = getIndices();

    const variants = {
        enter: (direction) => ({
            x: direction > 0 ? 100 : -100,
            opacity: 0,
            position: "absolute",
        }),
        center: {
            x: 0,
            opacity: 1,
            position: "relative",
            transition: {
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.3 },
            },
        },
        exit: (direction) => ({
            x: direction < 0 ? 100 : -100,
            opacity: 0,
            position: "absolute",
            transition: { duration: 0.3 },
        }),
    };

    const renderSideCard = (item, position) => {
        const baseStyle =
            "absolute transition-all duration-500 ease-in-out flex flex-col items-center justify-center rounded-3xl cursor-pointer";

        const styles = {
            left: "left-[5%] top-1/2 -translate-y-1/2 w-72 h-[65vh] opacity-30 scale-90 blur-md bg-white/10 border border-white/10 backdrop-blur-lg",
            right: "right-[5%] top-1/2 -translate-y-1/2 w-72 h-[65vh] opacity-30 scale-90 blur-md bg-white/10 border border-white/10 backdrop-blur-lg",
        };

        return (
            <div
                key={item.alt + position}
                onClick={() => {
                    if (position === "left") prev();
                    if (position === "right") next();
                }}
                className={`${baseStyle} ${styles[position]}`}
            >
                <div className="w-full h-full flex items-center justify-center px-6 py-6">
                    <img src={item.src} alt={item.alt} className="w-full h-[65%] object-contain" />
                </div>
            </div>
        );
    };

    return (
        <section className="w-full h-screen flex items-center justify-center bg-[#1f2937] snap-start">
            <div className="relative w-full max-w-[1440px] flex items-center justify-center mt-[-48px]">
                {renderSideCard(carouselItems[prevIndex], "left")}

                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={carouselItems[currentIndex].alt}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="z-20 w-[600px] h-[70vh] max-h-[600px] flex flex-col justify-center items-center bg-gradient-to-b from-[#f4f5f7] to-[#e8eaee] text-[#1f2937] border border-[#dcdfe3] shadow-[0_10px_60px_rgba(0,0,0,0.25)] rounded-3xl px-8 py-6"
                    >
                        <img
                            src={carouselItems[currentIndex].src}
                            alt={carouselItems[currentIndex].alt}
                            className="w-full h-[65%] object-contain"
                        />
                        <p className="text-xl font-semibold text-center leading-snug mt-6">
                            {carouselItems[currentIndex].tagline}
                        </p>

                        <div className="absolute top-1/2 w-full px-4 flex justify-between items-center -translate-y-1/2 z-10">
                            <button
                                onClick={prev}
                                className="bg-black/30 hover:bg-white hover:text-black text-white p-2 rounded-full"
                            >
                                <ChevronLeft size={22} />
                            </button>
                            <button
                                onClick={next}
                                className="bg-black/30 hover:bg-white hover:text-black text-white p-2 rounded-full"
                            >
                                <ChevronRight size={22} />
                            </button>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {renderSideCard(carouselItems[nextIndex], "right")}
            </div>
        </section>
    );
}
