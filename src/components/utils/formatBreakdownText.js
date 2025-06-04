// src/utils/formatBreakdownText.js

export function formatSkillMatch(breakdown) {
    if (!breakdown || typeof breakdown !== 'object') return "Skill match breakdown not available.";

    const total = breakdown.expected_skills?.length || 0;
    const matched = breakdown.matched_skills?.length || 0;
    const missingList = breakdown.missing_skills || [];

    const matchPct = breakdown.match_pct !== undefined ? `${breakdown.match_pct}%` : "Unknown";

    let text = `Candidate matches ${matched} out of ${total} required technical skills (${matchPct}).`;

    if (missingList.length > 0) {
        const missing = missingList.slice(0, 5).join(", ");
        text += ` Missing skills include: ${missing}${missingList.length > 5 ? ", and more." : "."}`;
    } else {
        text += ` All expected skills are matched.`;
    }

    return text;
}

export function formatResumeQuality(breakdown) {
    if (!breakdown || typeof breakdown !== 'object') return "Resume quality breakdown not available.";

    const entries = Object.entries(breakdown);
    if (entries.length === 0) return "No resume quality data found.";

    let text = "Resume analysis summary:\n";

    for (const [key, value] of entries) {
        if (value && typeof value === 'object') {
            const explanation = value.explanation || "";
            const score = value.score !== undefined ? ` (Score: ${Math.round(value.score * 100)}%)` : "";
            const formattedKey = key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
            text += `• ${formattedKey}:${score} ${explanation}\n`;
        }
    }

    return text.trim();
}

export function formatScoreBreakdown(breakdown) {
    if (!breakdown || typeof breakdown !== 'object') return "Score breakdown not available.";

    const entries = Object.entries(breakdown);
    if (entries.length === 0) return "No breakdown data available.";

    let text = "Final score summary:\n";

    for (const [key, value] of entries) {
        if (value && typeof value === 'object') {
            const explanation = value.explanation || "";
            const score = value.score !== undefined ? ` (Score: ${value.score})` : "";
            const formattedKey = key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
            text += `• ${formattedKey}:${score} ${explanation}\n`;
        }
    }

    return text.trim();
}
