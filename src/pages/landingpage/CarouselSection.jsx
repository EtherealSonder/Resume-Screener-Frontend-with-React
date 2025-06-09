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
            scale: 0.96,
            position: "absolute",
        }),
        center: {
            x: 0,
            opacity: 1,
            scale: 1,
            position: "relative",
            transition: {
                type: "tween",
                ease: "easeInOut",
                duration: 0.2,
            },
        },
        exit: (direction) => ({
            x: direction < 0 ? 100 : -100,
            opacity: 0,
            scale: 0.96,
            position: "absolute",
            transition: {
                type: "tween",
                ease: "easeInOut",
                duration: 0.2,
            },
        }),
    };

    const renderSideCard = (item, position) => {
        const style = `
            absolute ${position === "left" ? "left-[2%]" : "right-[2%]"}
            top-1/2 -translate-y-1/2 w-[520px] h-[75vh]
            bg-white/5 backdrop-blur-md border border-white/10
            rounded-xl shadow-md scale-[.85] opacity-20 z-0
            transition-all duration-200 ease-in-out
        `;

        return (
            <div
                key={item.alt + position}
                onClick={() => {
                    if (position === "left") prev();
                    if (position === "right") next();
                }}
                className={style}
            >
                <div className="w-full h-full flex items-center justify-center px-6 py-6">
                    <img src={item.src} alt={item.alt} className="w-full h-[65%] object-contain" />
                </div>
            </div>
        );
    };

    return (
        <section className="w-full min-h-screen flex items-center justify-center snap-start">
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
                        className="z-20 w-[860px] h-[80vh] flex flex-col justify-center items-center bg-white/10 text-white border border-white/10 shadow-2xl rounded-2xl px-10 py-8 backdrop-blur-lg hover:ring-2 hover:ring-purple-500/30 transition-all duration-200"
                    >
                        <img
                            src={carouselItems[currentIndex].src}
                            alt={carouselItems[currentIndex].alt}
                            className="w-full h-[65%] object-contain"
                        />
                        <p className="text-xl font-semibold text-center leading-snug mt-6 text-white">
                            {carouselItems[currentIndex].tagline}
                        </p>

                        {/* Navigation Arrows */}
                        <div className="absolute top-1/2 w-full px-4 flex justify-between items-center -translate-y-1/2 z-30">
                            <button
                                onClick={prev}
                                className="bg-white/10 text-white rounded-full p-2 shadow-lg hover:bg-white/20 transition"
                            >
                                <ChevronLeft size={22} />
                            </button>
                            <button
                                onClick={next}
                                className="bg-white/10 text-white rounded-full p-2 shadow-lg hover:bg-white/20 transition"
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
