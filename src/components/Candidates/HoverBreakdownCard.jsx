// components/candidates/HoverBreakdownCard.jsx
import React from "react";
import {
    formatSkillMatch,
    formatResumeQuality,
    formatScoreBreakdown,
} from "../utils/formatBreakdownText";

export default function HoverBreakdownCard({ breakdown }) {
    if (!breakdown || typeof breakdown !== "object") return null;

    let textSummary = "";

    if ("match_pct" in breakdown && "matched_skills" in breakdown) {
        // skill_match_breakdown
        textSummary = formatSkillMatch(breakdown);
    } else if ("structure" in breakdown || "grammar" in breakdown) {
        // resume_quality_breakdown
        textSummary = formatResumeQuality(breakdown);
    } else if ("skill_match" in breakdown || "education_match" in breakdown) {
        // score_breakdown
        textSummary = formatScoreBreakdown(breakdown);
    } else {
        // fallback
        textSummary = "Breakdown data not available.";
    }

    return (
        <div
            className="bg-gray-800 text-white rounded-xl shadow-lg p-4 text-xs max-w-sm w-full animate-fade-in leading-relaxed"
            dangerouslySetInnerHTML={{ __html: textSummary }}
        />
    );
}
