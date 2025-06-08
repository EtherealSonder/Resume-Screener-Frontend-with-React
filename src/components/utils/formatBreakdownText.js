export function formatSkillMatch(breakdown) {
    if (!breakdown || typeof breakdown !== "object") return "Skill match breakdown not available.";

    const expected = breakdown.expected_skills || [];
    const matched = breakdown.matched_skills || [];
    const missing = breakdown.missing_skills || [];
    const matchCount = matched.length;
    const totalCount = expected.length;

    let result = `<strong>Skill Match Breakdown</strong><br><br>`;

    if (matchCount > 0) {
        result += `The candidate has the following matching skills:<br>`;
        result += matched
            .map(
                (skill) =>
                    `<span class="inline-block bg-green-600 text-white text-[11px] font-medium px-2 py-0.5 rounded mr-1 mb-1">${skill}</span>`
            )
            .join(" ");
        result += `<br><br>`;
    }

    if (missing.length > 0) {
        result += `Missing required skills:<br>`;
        result += missing
            .map(
                (skill) =>
                    `<span class="inline-block bg-red-600 text-white text-[11px] font-medium px-2 py-0.5 rounded mr-1 mb-1">${skill}</span>`
            )
            .join(" ");
        result += `<br><br>`;
    }

    result += `Matched ${matchCount} out of ${totalCount} required skills.`;
    return result;
}

export function formatResumeQuality(breakdown) {
    if (!breakdown || typeof breakdown !== "object") return "Resume quality breakdown not available.";

    const metricLabels = {
        structure: "Structure",
        formatting: "Formatting",
        word_count: "Word Count",
        consistency: "Consistency",
        contact_info: "Contact Info",
        section_headers: "Section Headers",
        ats_compatibility: "ATS Compatibility",
        readability_flesch: "Flesch Kincaid Readability Score",
        readability_grammar: "Readability & Grammar"
    };

    let result = `<strong>Resume Quality Breakdown</strong><br><br>`;

    for (const [key, value] of Object.entries(breakdown)) {
        if (key === "bullet_points") continue;
        if (!value || typeof value !== "object") continue;

        const label = metricLabels[key] || key.replace(/_/g, " ");
        const contribution = typeof value.contribution === "number" ? value.contribution : null;

        let explanation = value.explanation || "";
        if (key === "readability_grammar") {
            const match = explanation.match(/Detected \d+ (?:grammar\/spelling|spelling|grammar) issues/i);
            explanation = match ? match[0] + "." : "Detected grammar/spelling issues.";
        }
        if (key === "section_headers") {
            const match = explanation.match(/Detected \d+ header/i);
            explanation = match ? match[0] + "." : "Detected section headers.";
        }

        result += `- <strong>${label}:</strong> ${explanation}`;
        if (contribution !== null) {
            result += ` <span class="inline-block ml-2 bg-blue-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded">${contribution} pts</span>`;
        }
        result += `<br>`;
    }

    return result.trim();
}

export function formatScoreBreakdown(breakdown) {
    if (!breakdown || typeof breakdown !== "object") return "Candidate match breakdown not available.";

    const order = [
        "skill_match",
        "experience_match",
        "education_match",
        "certifications_match",
        "soft_skills_match",
        "language_match",
        "portfolio_match",
        "previous_role_alignment",
    ];

    const defaultHints = [
        "no language requirement",
        "no portfolio requirement",
        "no soft skills required",
        "no certifications required",
    ];

    const lines = [];

    for (const key of order) {
        const metric = breakdown[key];
        if (!metric || typeof metric !== "object") continue;

        const raw = metric.explanation?.toLowerCase() || "";
        const value = metric.explanation || "";
        const contribution = typeof metric.contribution === "number" ? `${metric.contribution} pts` : null;

        if (defaultHints.some((hint) => raw.includes(hint))) continue;

        let line = "";

        if (key === "skill_match") {
            line = `- ${value.trim()}`;
        } else if (key === "experience_match") {
            const expectedMatch = value.match(/Expected experience:.*?(\d[+\.]?\d*)/);
            const candidateMatch = value.match(/Candidate has ([\d\.]+) years/);
            const expected = expectedMatch ? expectedMatch[1] : "N/A";
            const candidate = candidateMatch ? candidateMatch[1] : "N/A";
            line = `- Job requires ${expected} years. Candidate has ${candidate} years.`;
        } else if (key === "education_match") {
            line = `- Candidate has education level that meets job requirement.`;
        } else {
            line = `- ${value.trim()}`;
        }

        if (contribution) {
            line += ` <span class="inline-block ml-2 bg-blue-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded">${contribution}</span>`;
        }

        lines.push(line);
    }

    if (lines.length === 0) return "Candidate match breakdown not available.";

    const intro =
        "<strong>Candidate Match Score Breakdown</strong><br>This score is calculated based on how well the candidate meets key criteria such as skills, experience, education, certifications, and previous roles.<br><br>";

    return `${intro}${lines.join("<br>")}`;
}
