import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function HeroTextLandingPage() {
    const navigate = useNavigate();

    return (
        <section className="h-screen w-full flex flex-col justify-center items-center text-center px-6 lg:px-48 relative overflow-hidden">
            {/* 🧠 Heading */}
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight tracking-[-0.5px]"
            >
                Your intelligent hiring copilot.
            </motion.h1>

            {/* 📄 Subtext */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="text-lg sm:text-xl text-gray-300 leading-relaxed max-w-2xl mb-8"
            >
                <p>A recruiter-centric ATS that doesn’t just sort resumes,</p>
                <p>
                    it <span className="text-white font-semibold">understands</span> them.
                </p>
                <p className="mt-2">
                    Ask questions, evaluate candidates, and uncover deeper insights — powered by intelligent interaction.
                </p>
            </motion.div>

            {/* 🚀 Buttons */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex gap-4 flex-wrap justify-center"
            >
                <button
                    onClick={() => navigate("/login")}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full shadow-lg hover:brightness-110 hover:scale-105 transition-all duration-150 ease-out focus:ring-2 focus:ring-pink-500 focus:outline-none"
                >
                    Get Started
                </button>
                <button
                    onClick={() => {
                        const section = document.getElementById("why-lupiq");
                        section?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="text-white font-medium underline underline-offset-4 hover:text-pink-400 transition-all"
                >
                    Why LUPIQ?
                </button>
            </motion.div>
        </section>
    );
}
