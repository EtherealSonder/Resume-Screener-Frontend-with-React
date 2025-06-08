import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ModalPortal from "../../components/ModalPortal";
import { FaTimes } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { deleteUser } from "../../services/api";

export default function DeleteAccountModal({ onClose }) {
    const { user, logout } = useAuth();
    const [inputName, setInputName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleDelete = async () => {
        if (inputName.trim() !== user.name.trim()) {
            setError("Incorrect username");
            return;
        }

        setError("");
        setLoading(true);

        try {
            const res = await deleteUser(user.id);
            if (res.data.success) {
                logout();
                navigate("/signin");
            } else {
                setError("Failed to delete account. Try again.");
                setLoading(false);
            }
        } catch (err) {
            setError("Server error. Please try again.");
            setLoading(false);
        }
    };

    return (
        <ModalPortal>
            <>
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000]" />
                <div className="fixed top-1/2 left-1/2 z-[1010] w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-[#f8f8f8] p-6 rounded-xl shadow-xl">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-800">Delete Account</h2>
                        {!loading && (
                            <button
                                onClick={onClose}
                                className="text-[#dc2626] hover:text-red-700 text-lg"
                            >
                                <FaTimes />
                            </button>
                        )}
                    </div>

                    <p className="text-sm text-gray-700 mb-3">
                        Are you sure you want to delete your account? All user data will be lost.
                    </p>

                    <label className="text-sm font-medium text-gray-700">
                        Type <strong>{user.name}</strong> to confirm
                    </label>
                    <input
                        type="text"
                        value={inputName}
                        onChange={(e) => setInputName(e.target.value)}
                        disabled={loading}
                        className="w-full mt-1 mb-2 px-4 py-2 border border-gray-300 rounded-md"
                    />

                    {error && (
                        <p className="text-sm text-red-500 mb-2">{error}</p>
                    )}

                    <div className="flex justify-end gap-4 mt-4">
                        {!loading ? (
                            <>
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 border border-[#dc2626] text-[#dc2626] hover:bg-[#dc2626] hover:text-white rounded-md transition"
                                >
                                    No
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className={`px-4 py-2 border border-[#3b82f6] rounded-md transition ${inputName === user.name
                                            ? "text-[#3b82f6] hover:bg-[#3b82f6] hover:text-white"
                                            : "text-gray-400 border-gray-300 cursor-not-allowed"
                                        }`}
                                    disabled={inputName !== user.name}
                                >
                                    Yes
                                </button>
                            </>
                        ) : (
                            <div className="w-full flex justify-center items-center py-2">
                                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                            </div>
                        )}
                    </div>
                </div>
            </>
        </ModalPortal>
    );
}
