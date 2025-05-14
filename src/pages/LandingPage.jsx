import { useNavigate } from "react-router-dom";

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <div
            className="min-h-screen w-full flex items-center justify-center bg-cover bg-center font-sans overflow-hidden"
            style={{
                backgroundImage: "url('/src/assets/bg.jpg')",
            }}
        >
            <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl rounded-3xl w-[360px] text-center p-8 animate-fadeIn transition duration-500">
                <h1 className="text-2xl font-bold mb-6 text-white drop-shadow-md">
                    Resume Screener
                </h1>

                <button
                    onClick={() => navigate("/login")}
                    className="w-full mb-4 py-2 rounded-full bg-blue-500 text-white font-medium hover:bg-blue-600 transform hover:scale-105 transition duration-200"
                >
                    Login
                </button>

                <button
                    onClick={() => navigate("/signup")}
                    className="w-full py-2 rounded-full bg-green-500 text-white font-medium hover:bg-green-600 transform hover:scale-105 transition duration-200"
                >
                    Sign Up
                </button>
            </div>
        </div>
    );
}
