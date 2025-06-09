import { useState } from "react";
import { loginUser } from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/candidates/LoadingSpinner";

export default function LoginPage() {
    const [form, setForm] = useState({ email: "", password: "", remember: false });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!form.email.includes("@")) {
            setError("Please enter a valid email.");
            return;
        }

        setLoading(true);
        try {
            const res = await loginUser(form.email, form.password);
            login(res.data, form.remember);
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.error || "Login failed");
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen w-full">
            {/* Left Panel */}
            <div
                className="w-1/2 hidden md:flex flex-col justify-center items-center relative"
                style={{
                    background: `radial-gradient(600px circle at 30% 20%, #a855f733, transparent 60%), #1f2937`,
                }}
            >
                <div className="absolute top-6 left-8 text-white text-2xl font-bold cursor-pointer">LUPIQ</div>
                <img src="/assets/login-side.gif" alt="Login illustration" className="w-3/4 max-w-md" />
            </div>

            {/* Right Panel */}
            <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Your co-pilot for intelligent hiring.</h1>
                    <p className="text-sm text-gray-600 mb-6">Login to discover smarter candidate insights.</p>
                    {error && <div className="bg-red-500 text-white p-2 mb-4 rounded">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <input
                            name="email"
                            type="email"
                            placeholder="Email"
                            onChange={handleChange}
                            className="w-full mb-3 p-3 rounded border border-gray-300"
                            disabled={loading}
                        />
                        <input
                            name="password"
                            type="password"
                            placeholder="Password"
                            onChange={handleChange}
                            className="w-full mb-3 p-3 rounded border border-gray-300"
                            disabled={loading}
                        />
                        <label className="flex items-center text-sm mb-4 text-gray-700">
                            <input
                                type="checkbox"
                                name="remember"
                                onChange={handleChange}
                                className="mr-2"
                                disabled={loading}
                            />
                            Remember me
                        </label>
                        {loading ? <LoadingSpinner /> : (
                            <button
                                type="submit"
                                className="w-full py-2 rounded-full font-semibold text-white bg-gradient-to-r from-purple-500 to-indigo-500 hover:brightness-110 transition"
                            >
                                Login
                            </button>
                        )}
                    </form>
                    {!loading && (
                        <p className="mt-4 text-sm text-gray-600">
                            New user?{" "}
                            <Link to="/signup" className="text-blue-500 hover:underline">
                                Sign up
                            </Link>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
