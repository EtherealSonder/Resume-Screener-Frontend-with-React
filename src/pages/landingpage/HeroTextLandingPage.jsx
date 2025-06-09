import { useNavigate } from "react-router-dom";

export default function HeroTextLandingPage() {
    const navigate = useNavigate();

    return (
        <section className="h-screen w-full flex flex-col items-center justify-center text-center px-6 lg:px-48">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
                Your intelligent hiring co-pilot.
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 max-w-3xl mb-8">
                A recruiter-centric ATS that doesn’t just sort resumes — it <span className="text-white font-semibold">understands</span> them. <br />
                Ask questions, evaluate candidates, and uncover deeper insight — powered by intelligent interaction.
            </p>

            <div className="flex gap-6 mt-4">
                <button
                    onClick={() => navigate("/login")}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full shadow-lg transition"
                >
                    Get Started
                </button>
                <button
                    onClick={() => navigate("/about")}
                    className="text-white underline underline-offset-4 hover:text-purple-300 transition"
                >
                    Why LUPIQ?
                </button>
            </div>
        </section>
    );
}
