import React from "react";

export default function CoverLetterAnalysis({ report }) {
    if (!report || typeof report !== "object" || report.final_ai_score === 0) {
        return (
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm text-center text-gray-500 text-sm italic">
                Cover letter not provided by candidate.
            </div>
        );
    }

    const metrics = [
        {
            label: "JD Alignment",
            score: report.jd_alignment_score?.score ?? 0,
            explanation: report.jd_alignment_score?.explanation ?? "N/A",
        },
        {
            label: "Evidence & Specificity",
            score: report.evidence_score?.score ?? 0,
            explanation: report.evidence_score?.explanation ?? "N/A",
        },
        {
            label: "Company Fit",
            score: report.company_fit_score?.score ?? 0,
            explanation: report.company_fit_score?.explanation ?? "N/A",
        },
        {
            label: "Structure & Tone",
            score: report.structure_tone_score?.score ?? 0,
            explanation: report.structure_tone_score?.explanation ?? "N/A",
        },
    ];

    const getBarColor = (score) => {
        if (score >= 80) return "bg-green-500";
        if (score >= 50) return "bg-yellow-500";
        return "bg-red-500";
    };

    const finalScore = report.final_ai_score ?? 0;

    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-6">
            <h4 className="text-lg font-bold text-gray-800">Cover Letter Analysis</h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {metrics.map((metric, idx) => (
                    <div
                        key={idx}
                        className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3"
                    >
                        <div className="flex justify-between items-center">
                            <p className="text-sm font-bold text-gray-700">{metric.label}</p>
                            <span className="text-xs font-semibold text-gray-600">
                                {metric.score} / 100
                            </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className={`h-full ${getBarColor(metric.score)}`}
                                style={{ width: `${metric.score}%` }}
                            ></div>
                        </div>

                        <p className="text-sm text-gray-700 leading-relaxed">
                            {metric.explanation}
                        </p>
                    </div>
                ))}
            </div>

            {/* Final Score */}
            <div className="pt-4 border-t border-gray-200">
                <h5 className="font-semibold text-sm text-gray-600 mb-2">📄 Cover Letter Score</h5>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-gray-700">Total Score</span>
                        <span className="text-sm font-semibold text-gray-800">
                            {finalScore} / 100
                        </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className={`h-full ${getBarColor(finalScore)}`}
                            style={{ width: `${finalScore}%` }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
