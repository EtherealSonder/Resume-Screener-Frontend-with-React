import React from "react";
import EvaluationPromptBox from "./EvaluationPromptBox";
import ScoringWeightsBox from "./ScoringWeightsBox";

export default function EvaluationPreferences() {
    return (
        <div className="px-6 py-6 w-full overflow-y-auto">
            <h1 className="text-2xl font-semibold text-gray-800 mb-6">
                Evaluation Preferences
            </h1>

            <EvaluationPromptBox />
            <ScoringWeightsBox />
        </div>
    );
}
