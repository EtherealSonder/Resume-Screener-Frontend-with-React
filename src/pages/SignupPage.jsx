import { useState } from "react";
import { signupUser } from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import FancyContainer from "../components/FancyContainer";

export default function SignupPage() {
    const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password !== form.confirm) {
            setError("Passwords do not match");
            return;
        }
        try {
            const res = await signupUser(form.name, form.email, form.password);
            login(res.data, true);
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.error || "Signup failed");
        }
    };

    return (
        <FancyContainer>
            <div className="animate-fadeIn transition-opacity duration-500">
                <h2 className="text-xl font-semibold mb-4 text-white drop-shadow-md">Sign Up</h2>
                {error && <div className="bg-red-500 text-white p-2 mb-4 rounded">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <input
                        name="name"
                        placeholder="Name"
                        onChange={handleChange}
                        className="w-full mb-3 p-2 rounded bg-white/90 border border-gray-300"
                    />
                    <input
                        name="email"
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
                    <input
                        name="confirm"
                        type="password"
                        placeholder="Confirm Password"
                        onChange={handleChange}
                        className="w-full mb-3 p-2 rounded bg-white/90 border border-gray-300"
                    />
                    <button className="w-full bg-green-600 text-white py-2 rounded-full font-medium hover:bg-green-700 transform hover:scale-105 transition">
                        Sign Up
                    </button>
                </form>
                <p className="mt-4 text-white">
                    Already an account?{" "}
                    <Link to="/login" className="text-blue-200 underline hover:text-white transition">Log in</Link>
                </p>
            </div>
        </FancyContainer>
    );
}
