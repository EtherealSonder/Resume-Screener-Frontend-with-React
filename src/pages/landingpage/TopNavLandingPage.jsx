import { useNavigate } from "react-router-dom";

export default function TopNavLandingPage() {
    const navigate = useNavigate();

    return (
        <header className="w-full fixed top-0 left-0 z-50 px-24 py-6 flex justify-between items-center bg-[#1f2937]">
            <div
                onClick={() => navigate("/")}
                className="text-white text-xl font-bold cursor-pointer transition hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
            >
                LUPIQ
            </div>

            <div className="flex gap-4">
                <button
                    onClick={() => navigate("/login")}
                    className="px-5 py-2 border border-white text-white rounded-full transition duration-300 hover:bg-[#eff1f4] hover:text-[#1f2937]"
                >
                    Login
                </button>
                <button
                    onClick={() => navigate("/signup")}
                    className="px-5 py-2 border border-white text-white rounded-full transition duration-300 hover:bg-[#eff1f4] hover:text-[#1f2937]"
                >
                    Sign Up
                </button>
            </div>
        </header>
    );
}
