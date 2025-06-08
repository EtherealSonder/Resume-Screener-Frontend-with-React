import { useState } from "react";
import { FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import LoadingSpinner from "../../components/Candidates/LoadingSpinner";

export default function GeneralSettings({ onChangePassword, onSignOut, onDeleteAccount }) {
    const { user, setUser } = useAuth();
    const [editing, setEditing] = useState({ name: false, email: false });
    const [values, setValues] = useState({ name: user.name, email: user.email });
    const [errors, setErrors] = useState({ name: "", email: "" });
    const [loading, setLoading] = useState({ name: false, email: false });

    const handleSave = async (field) => {
        const newVal = values[field].trim();

        if (field === "name" && newVal.length > 30) {
            setErrors((prev) => ({ ...prev, name: "Max length 30 characters." }));
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
        if (field === "email" && !emailRegex.test(newVal)) {
            setErrors((prev) => ({ ...prev, email: "Enter a valid email address" }));
            return;
        }

        setErrors((prev) => ({ ...prev, [field]: "" }));
        setLoading((prev) => ({ ...prev, [field]: true }));

        try {
            const res = await api.post("/update_user", {
                id: user.id,
                field,
                value: newVal,
            });

            if (res.data.success) {
                setUser((prev) => {
                    const updated = { ...prev, [field]: newVal };
                    localStorage.setItem("user", JSON.stringify(updated));
                    return updated;
                });
                setEditing((prev) => ({ ...prev, [field]: false }));
            } else {
                setErrors((prev) => ({ ...prev, [field]: res.data.message || "Update failed." }));
            }
        } catch (err) {
            setErrors((prev) => ({ ...prev, [field]: "Update failed. Try again." }));
        } finally {
            setLoading((prev) => ({ ...prev, [field]: false }));
        }
    };

    const handleCancel = (field) => {
        setValues((prev) => ({ ...prev, [field]: user[field] }));
        setErrors((prev) => ({ ...prev, [field]: "" }));
        setEditing((prev) => ({ ...prev, [field]: false }));
    };

    const renderField = (label, field) => (
        <div className="mb-6">
            <label className="block text-gray-800 font-medium mb-1">{label}</label>
            <div className="flex items-center gap-3">
                <input
                    type="text"
                    className={`w-full px-4 py-2 rounded-md border bg-gray-100 ${editing[field] ? "border-gray-400 bg-white" : "border-gray-300"}`}
                    disabled={!editing[field]}
                    value={values[field]}
                    onChange={(e) =>
                        setValues((prev) => ({ ...prev, [field]: e.target.value }))
                    }
                />
                {!editing[field] ? (
                    <button
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => setEditing((prev) => ({ ...prev, [field]: true }))}
                    >
                        <FaEdit />
                    </button>
                ) : loading[field] ? (
                    <LoadingSpinner size="small" />
                ) : (
                    <>
                        <button
                            className="text-green-600 hover:text-green-800"
                            onClick={() => handleSave(field)}
                        >
                            <FaCheck />
                        </button>
                        <button
                            className="text-red-600 hover:text-red-800"
                            onClick={() => handleCancel(field)}
                        >
                            <FaTimes />
                        </button>
                    </>
                )}
            </div>
            {errors[field] && (
                <p className="text-sm text-red-500 mt-1">{errors[field]}</p>
            )}
        </div>
    );

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
            {renderField("User Name", "name")}
            {renderField("Email Address", "email")}

            <div className="flex flex-wrap gap-4 mt-6">
                <button
                    onClick={onChangePassword}
                    className="px-6 py-2 rounded-md border border-[#64748b] text-[#64748b] hover:bg-[#64748b] hover:text-white transition shadow-sm"
                >
                    Change Password
                </button>
                <button
                    onClick={onSignOut}
                    className="px-6 py-2 rounded-md border border-[#3b82f6] text-[#3b82f6] hover:bg-[#3b82f6] hover:text-white transition shadow-sm"
                >
                    Sign Out
                </button>
                <button
                    onClick={onDeleteAccount}
                    className="px-6 py-2 rounded-md border border-[#dc2626] text-[#dc2626] hover:bg-[#dc2626] hover:text-white transition shadow-sm"
                >
                    Delete Account
                </button>
            </div>
        </div>
    );
}
