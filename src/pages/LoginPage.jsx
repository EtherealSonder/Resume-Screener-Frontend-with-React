import { useState } from "react";
import { loginUser } from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import FancyContainer from "../components/FancyContainer";

export default function LoginPage() {
    const [form, setForm] = useState({ email: "", password: "", remember: false });
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await loginUser(form.email, form.password);
            login(res.data, form.remember);
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.error || "Invalid credentials");
        }
    };

    return (
        <FancyContainer>
            <div className="animate-fadeIn transition-opacity duration-500">
                <h2 className="text-xl font-semibold mb-4 text-white drop-shadow-md">Login</h2>
                {error && <div className="bg-red-500 text-white p-2 mb-4 rounded">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        onChange={handleChange}
                        className="w-full mb-3 p-2 rounded bg-white/90 border border-gray-300"
                    />
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        onChange={handleChange}
                        className="w-full mb-3 p-2 rounded bg-white/90 border border-gray-300"
                    />
                    <label className="flex items-center text-white text-sm mb-4">
                        <input type="checkbox" name="remember" onChange={handleChange} className="mr-2" />
                        Remember me
                    </label>
                    <button className="w-full bg-blue-600 text-white py-2 rounded-full font-medium hover:bg-blue-700 transform hover:scale-105 transition">
                        Login
                    </button>
                </form>
                <p className="mt-4 text-white">
                    New user?{" "}
                    <Link to="/signup" className="text-blue-200 underline hover:text-white transition">Sign up</Link>
                </p>
            </div>
        </FancyContainer>
    );
}
