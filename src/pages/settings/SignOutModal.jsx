import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ModalPortal from "../../components/ModalPortal";
import { FaTimes } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

export default function SignOutModal({ onClose }) {
    const { logout } = useAuth();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleConfirm = async () => {
        setLoading(true);
        setTimeout(() => {
            logout();
            navigate("/signin");
        }, 600);
    };

    return (
        <ModalPortal>
            <>
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000]" />
                <div className="fixed top-1/2 left-1/2 z-[1010] w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-[#f8f8f8] p-6 rounded-xl shadow-xl">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-800">Sign Out</h2>
                        {!loading && (
                            <button
                                onClick={onClose}
                                className="text-[#dc2626] hover:text-red-700 text-lg"
                            >
                                <FaTimes />
                            </button>
                        )}
                    </div>

                    <p className="text-sm text-gray-700 mb-6">
                        Are you sure you want to sign out?
                    </p>

                    <div className="flex justify-end gap-4">
                        {!loading ? (
                            <>
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 border border-[#dc2626] text-[#dc2626] hover:bg-[#dc2626] hover:text-white rounded-md transition"
                                >
                                    No
                                </button>
                                <button
                                    onClick={handleConfirm}
                                    className="px-4 py-2 border border-[#3b82f6] text-[#3b82f6] hover:bg-[#3b82f6] hover:text-white rounded-md transition"
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
