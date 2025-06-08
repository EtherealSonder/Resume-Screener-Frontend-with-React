import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import LoadingSpinner from "../../components/Candidates/LoadingSpinner";
import ToastPortal from "../../components/ToastPortal";
import { FaUndo } from "react-icons/fa";

const METRICS = [
    "skill_match",
    "education_match",
    "experience_match",
    "portfolio_match",
    "certifications_match",
    "soft_skills_match",
    "language_match",
    "previous_role_alignment",
];

const LABELS = {
    skill_match: "Skill Match",
    education_match: "Education",
    experience_match: "Experience",
    portfolio_match: "Portfolio",
    certifications_match: "Certifications",
    soft_skills_match: "Soft Skills",
    language_match: "Languages",
    previous_role_alignment: "Previous Role",
};

const DEFAULT_WEIGHTS = {
    skill_match: 35,
    education_match: 10,
    experience_match: 15,
    portfolio_match: 5,
    certifications_match: 10,
    soft_skills_match: 5,
    language_match: 5,
    previous_role_alignment: 15,
};

export default function ScoringWeightsBox() {
    const { user } = useAuth();
    const [weights, setWeights] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [error, setError] = useState("");

    const total = weights ? Object.values(weights).reduce((a, b) => a + b, 0) : 0;

    useEffect(() => {
        const fetchWeights = async () => {
            try {
                const res = await api.get("/client_preferences", {
                    params: { client_id: user.id },
                });
                if (res.data?.weights) {
                    const clean = {};
                    for (let k of METRICS) {
                        const val = res.data.weights[k];
                        clean[k] = typeof val === "number" && !isNaN(val)
                            ? Math.round(val)
                            : DEFAULT_WEIGHTS[k];
                    }
                    setWeights(clean);
                } else {
                    setWeights(DEFAULT_WEIGHTS);
                }
            } catch (err) {
                console.error("Failed to fetch weights", err);
                setWeights(DEFAULT_WEIGHTS);
            }
        };

        fetchWeights();
    }, [user]);

    const handleSliderChange = (key, value) => {
        setWeights(prev => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleReset = () => {
        setWeights(DEFAULT_WEIGHTS);
        setError("");
    };

    const handleSave = async () => {
        if (total !== 100) {
            setError("Total weight must equal 100% before saving.");
            return;
        }

        setLoading(true);
        try {
            const res = await api.get("/client_preferences", {
                params: { client_id: user.id },
            });
            const currentPrompt = res.data?.prompt ?? "";

            await api.post("/client_preferences/update", {
                client_id: user.id,
                custom_eval_prompt: currentPrompt,
                weights,
            });

            setError("");
            setShowToast(true);
        } catch (err) {
            console.error("Failed to update weights", err);
        } finally {
            setLoading(false);
            setTimeout(() => setShowToast(false), 3000);
        }
    };

    if (!weights) {
        return (
            <div className="flex justify-center items-center py-10">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-6">
            <h2 className="text-lg font-semibold mb-2">Custom Resume Scoring Metrics</h2>
            <p className="text-sm text-gray-500 mb-4">
                Adjust how much each evaluation metric contributes to the final score. Total must equal 100%.
            </p>

            <div className="space-y-6">
                {METRICS.map((key) => (
                    <div key={key} className="flex items-center justify-between gap-4">
                        <div className="w-40 text-sm font-medium text-gray-800">{LABELS[key]}</div>
                        <div className="relative flex-1 h-6">
                            <input
                                type="range"
                                min="0"
                                max="100"
                                step="1"
                                value={weights[key]}
                                onChange={(e) => handleSliderChange(key, parseInt(e.target.value))}
                                className="w-full h-2 appearance-none bg-gray-300 rounded-full transition-all focus:outline-none"
                                style={{
                                    background: `linear-gradient(to right, #8b5cf6 ${weights[key]}%, #e5e7eb ${weights[key]}%)`,
                                }}
                            />
                            <style jsx>{`
                input[type="range"]::-webkit-slider-thumb {
                  appearance: none;
                  height: 18px;
                  width: 18px;
                  border-radius: 50%;
                  background: #8b5cf6;
                  cursor: pointer;
                  transition: 0.2s;
                }
                input[type="range"]::-webkit-slider-thumb:hover {
                  box-shadow: 0 0 0 6px rgba(139, 92, 246, 0.25);
                }
                input[type="range"]::-webkit-slider-thumb:active {
                  box-shadow: 0 0 0 10px rgba(139, 92, 246, 0.4);
                }
              `}</style>
                        </div>
                        <div className="w-10 text-sm text-right text-gray-700">
                            {weights[key]}%
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-between mt-6">
                <div className="text-sm font-semibold text-gray-700">
                    Total: {total}%
                    {error && <span className="ml-3 text-red-500 font-normal text-sm">{error}</span>}
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleReset}
                        className="px-4 py-1.5 text-sm border border-gray-500 text-gray-700 hover:bg-gray-500 hover:text-white rounded-md transition"
                    >
                        <FaUndo className="inline mr-1" /> Reset to Default
                    </button>

                    {!loading ? (
                        <button
                            onClick={handleSave}
                            className="px-4 py-1.5 text-sm border border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white rounded-md transition"
                        >
                            Save
                        </button>
                    ) : (
                        <div className="w-[28px] h-[28px] flex items-center justify-center">
                            <LoadingSpinner />
                        </div>
                    )}
                </div>
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
