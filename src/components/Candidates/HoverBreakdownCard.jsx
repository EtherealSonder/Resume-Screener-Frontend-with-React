import React from "react";
import {
    formatSkillMatch,
    formatResumeQuality,
    formatScoreBreakdown,
} from "../utils/formatBreakdownText";

export default function HoverBreakdownCard({ breakdown }) {
    if (!breakdown || typeof breakdown !== "object") return null;

    let title = "";
    let textSummary = "";

    if ("match_pct" in breakdown && "matched_skills" in breakdown) {
        title = "Skill Match Breakdown";
        textSummary = formatSkillMatch(breakdown);
    } else if ("structure" in breakdown || "grammar" in breakdown) {
        title = "Resume Quality Breakdown";
        textSummary = formatResumeQuality(breakdown);
    } else if ("skill_match" in breakdown || "education_match" in breakdown) {
        title = "Candidate Match Score Breakdown";
        textSummary = formatScoreBreakdown(breakdown);
    } else {
        title = "Breakdown";
        textSummary = "Breakdown data not available.";
    }

    return (
        <div className="bg-gray-800 text-white rounded-xl shadow-lg p-4 text-xs w-full max-w-[320px] animate-fade-in leading-relaxed">
            <div className="font-bold text-sm mb-1">{title}</div>
            <div className="space-y-1" dangerouslySetInnerHTML={{ __html: textSummary }} />
        </div>
    );
}
