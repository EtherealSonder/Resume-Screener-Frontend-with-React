import { motion } from "framer-motion";

const features = [
    {
        title: "Ask Questions, Not Filters",
        icon: "/icons/chat-gpt.png",
        alt: "ChatGPT icon",
        attribution: "Chat gpt icons created by chehuna - Flaticon",
        link: "https://www.flaticon.com/free-icons/chat-gpt",
        description: "Use natural language to explore candidates like “best with C++ and 3+ yrs exp.”"
    },
    {
        title: "Visualize Fit Instantly",
        icon: "/icons/bar-chart.png",
        alt: "Bar chart icon",
        attribution: "Graphic icons created by Freepik - Flaticon",
        link: "https://www.flaticon.com/free-icons/graphic",
        description: "Radar charts, word clouds, and scoring dashboards tell you why someone’s a match."
    },
    {
        title: "Custom Evaluation Rubrics",
        icon: "/icons/development.png",
        alt: "Custom settings icon",
        attribution: "Custom icons created by fariha begum - Flaticon",
        link: "https://www.flaticon.com/free-icons/custom",
        description: "Define your own AI prompts to reflect your culture, not a one-size-fits-all rubric."
    },
    {
        title: "Instant Resume Quality Insights",
        icon: "/icons/high-quality.png",
        alt: "Resume quality icon",
        attribution: "High quality icons created by juicy_fish - Flaticon",
        link: "https://www.flaticon.com/free-icons/high-quality",
        description: "Get instant feedback on structure, clarity, formatting, and section completeness — rated on an AI-powered quality score."
    },
    {
        title: "Built for Small Teams",
        icon: "/icons/team-work.png",
        alt: "Team icon",
        attribution: "Small team icons created by berkahicon - Flaticon",
        link: "https://www.flaticon.com/free-icons/small-team",
        description: "Designed for clarity and speed — even if you don’t have a big HR department."
    },
    {
        title: "Intelligent, Not Just ATS",
        icon: "/icons/brain.png",
        alt: "Brain icon",
        attribution: "Machine learning icons created by VectorPortal - Flaticon",
        link: "https://www.flaticon.com/free-icons/machine-learning",
        description: "LUPIQ thinks alongside you — like ChatGPT, but trained to understand hiring intent."
    }
];

export default function WhyLUPIQ() {
    return (
        <section id="why-lupiq" className="w-full min-h-screen flex items-center justify-center pt-[96px] pb-20 px-6 lg:px-24 snap-start">
            <div className="max-w-6xl w-full text-center">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl sm:text-5xl font-extrabold text-white mb-6"
                >
                    Why LUPIQ?
                </motion.h2>

                <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-12">
                    AI-first ATS that thinks like a recruiter — not just filters like a machine.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            whileHover={{ scale: 1.03 }}
                            transition={{ type: "tween", duration: 0.1 }}
                            className="group flex items-start gap-4 bg-white/10 backdrop-blur-md border border-white/10 text-left text-white p-6 rounded-2xl shadow-xl transition-all duration-100 ease-out hover:ring-2 hover:ring-purple-500/30"
                        >
                            <div className="relative">
                                <img
                                    src={feature.icon}
                                    alt={feature.alt}
                                    className="h-10 w-10 mt-0.5 object-contain filter invert brightness-150 shrink-0"
                                />
                                <div className="absolute bottom-0 left-0 z-40 hidden group-hover:block bg-black text-white text-[10px] px-2 py-1 rounded shadow-lg whitespace-nowrap">
                                    <a
                                        href={feature.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="underline"
                                    >
                                        {feature.attribution}
                                    </a>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-1">{feature.title}</h3>
                                <p className="text-gray-300 text-sm">{feature.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <button
                    onClick={() => {
                        const section = document.getElementById("carousel");
                        section?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="mt-12 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-full text-lg shadow-lg hover:scale-105 transition-all duration-150"
                >
                    See It In Action
                </button>
            </div>
        </section>
    );
}
