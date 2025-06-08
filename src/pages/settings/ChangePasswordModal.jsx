import { useState } from "react";
import { verifyPassword, updatePassword } from "../../services/api";
import LoadingSpinner from "../../components/Candidates/LoadingSpinner";
import ModalPortal from "../../components/ModalPortal";
import { FaTimes } from "react-icons/fa";

export default function ChangePasswordModal({ onClose, onSuccessToast }) {
    const user = JSON.parse(localStorage.getItem("user"));
    const [step, setStep] = useState(1);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [retypePassword, setRetypePassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleVerify = async () => {
        setError("");
        setLoading(true);
        try {
            const res = await verifyPassword({
                email: user.email,
                password: currentPassword,
            });
            if (res.data.valid) {
                setStep(2);
            } else {
                setError("Incorrect current password");
            }
        } catch {
            setError("Verification failed");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (newPassword !== retypePassword) {
            setError("Passwords do not match");
            return;
        }

        setError("");
        setLoading(true);
        try {
            const res = await updatePassword({
                email: user.email,
                current_password: currentPassword,
                new_password: newPassword,
            });

            if (res.data.success) {
                setTimeout(() => {
                    onClose();
                    onSuccessToast();
                }, 300); // slight delay for UI smoothness
            } else {
                setError("Password update failed");
            }
        } catch {
            setError("Error saving password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModalPortal>
            <>
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000]" />

                <div className="fixed top-1/2 left-1/2 z-[1010] w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-[#f8f8f8] p-6 rounded-xl shadow-xl">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-800">Change Password</h2>
                        {!loading && (
                            <button
                                onClick={onClose}
                                className="text-[#dc2626] hover:text-red-700 text-lg"
                            >
                                <FaTimes />
                            </button>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Enter current password
                            </label>
                            <input
                                type="password"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md mt-1"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                disabled={loading || step === 2}
                            />
                        </div>

                        {step === 2 && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Enter new password
                                    </label>
                                    <input
                                        type="password"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md mt-1"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Re-enter new password
                                    </label>
                                    <input
                                        type="password"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md mt-1"
                                        value={retypePassword}
                                        onChange={(e) => setRetypePassword(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>
                            </>
                        )}

                        {error && <p className="text-sm text-red-500">{error}</p>}

                        <div className="pt-2">
                            {loading ? (
                                <div className="flex justify-center">
                                    <LoadingSpinner />
                                </div>
                            ) : step === 1 ? (
                                <button
                                    onClick={handleVerify}
                                    className="w-full px-6 py-2 border border-[#3b82f6] text-[#3b82f6] hover:bg-[#3b82f6] hover:text-white rounded-md transition"
                                >
                                    Verify
                                </button>
                            ) : (
                                <button
                                    onClick={handleSave}
                                    className="w-full px-6 py-2 border border-[#3b82f6] text-[#3b82f6] hover:bg-[#3b82f6] hover:text-white rounded-md transition"
                                >
                                    Save Changes
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </>
        </ModalPortal>
    );
}
