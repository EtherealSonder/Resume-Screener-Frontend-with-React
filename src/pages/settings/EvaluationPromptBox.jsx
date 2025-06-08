import { useEffect, useState } from "react";
import { FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import LoadingSpinner from "../../components/Candidates/LoadingSpinner";
import ToastPortal from "../../components/ToastPortal";

export default function EvaluationPromptBox() {
    const { user } = useAuth();
    const [prompt, setPrompt] = useState("");
    const [editedPrompt, setEditedPrompt] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        const fetchPrompt = async () => {
            try {
                const res = await api.get(`/client_preferences`, {
                    params: { client_id: user.id },
                });
                if (res.data?.prompt !== undefined) {
                    const fetchedPrompt = res.data.prompt || "";
                    setPrompt(fetchedPrompt);
                    setEditedPrompt(fetchedPrompt);
                }
            } catch (err) {
                console.error("Failed to fetch evaluation prompt", err);
            }
        };

        fetchPrompt();
    }, [user]);

    const handleSave = async () => {
        setLoading(true);
        try {
            // Fetch current weights to avoid overwriting them
            const res = await api.get("/client_preferences", {
                params: { client_id: user.id },
            });
            const currentWeights = res.data?.weights || {};

            await api.post("/client_preferences/update", {
                client_id: user.id,
                custom_eval_prompt: editedPrompt,
                weights: currentWeights,
            });

            setPrompt(editedPrompt);
            setIsEditing(false);
            setShowToast(true);
        } catch (err) {
            console.error("Failed to update prompt", err);
        } finally {
            setLoading(false);
            setTimeout(() => setShowToast(false), 3000);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditedPrompt(prompt);
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-6">
            <h2 className="text-lg font-semibold mb-1">Custom Resume Evaluation Instructions</h2>
            <p className="text-sm text-gray-500 mb-3">
                Enter specific instructions to personalize how resumes should be evaluated.
            </p>

            <textarea
                className={`w-full min-h-[150px] border rounded-md p-3 text-sm transition ${isEditing
                        ? "border-blue-400 bg-white focus:outline-blue-500"
                        : "border-gray-200 bg-gray-100 text-gray-600 cursor-not-allowed"
                    }`}
                value={isEditing ? editedPrompt : prompt}
                onChange={(e) => setEditedPrompt(e.target.value)}
                readOnly={!isEditing}
            />

            <div className="flex justify-end items-center mt-3 space-x-2">
                {!isEditing && (
                    <button
                        onClick={() => {
                            setIsEditing(true);
                            setEditedPrompt(prompt);
                        }}
                        className="px-4 py-1.5 text-sm border border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white rounded-md transition"
                    >
                        <FaEdit className="inline mr-1" /> Edit
                    </button>
                )}

                {isEditing && !loading && (
                    <>
                        <button
                            onClick={handleSave}
                            className="px-4 py-1.5 text-sm border border-green-500 text-green-600 hover:bg-green-500 hover:text-white rounded-md transition"
                        >
                            <FaCheck className="inline mr-1" /> Save
                        </button>
                        <button
                            onClick={handleCancel}
                            className="px-4 py-1.5 text-sm border border-red-500 text-red-600 hover:bg-red-500 hover:text-white rounded-md transition"
                        >
                            <FaTimes className="inline mr-1" /> Cancel
                        </button>
                    </>
                )}

                {loading && (
                    <div className="h-[32px] flex items-center justify-center">
                        <LoadingSpinner />
                    </div>
                )}
            </div>

            {showToast && (
                <ToastPortal>
                    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-md bg-green-600 text-white text-sm shadow">
                        Preferences updated successfully
                    </div>
                </ToastPortal>
            )}
        </div>
    );
}
