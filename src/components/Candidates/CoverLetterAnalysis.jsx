import React from "react";

export default function CoverLetterAnalysis({ report, score }) {
    const getBadgeColor = (value) => {
        if (value <= 30) return "bg-green-100 text-green-700";
        if (value <= 50) return "bg-yellow-100 text-yellow-700";
        return "bg-red-100 text-red-700";
    };

    if (!report || typeof report !== "object") return null;

    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h4 className="text-lg font-bold text-gray-800 mb-4">Cover Letter Analysis</h4>

            {/* Analysis */}
            <div className="mb-4">
                <h5 className="font-semibold text-sm text-gray-600 mb-1">🧠 Overall Analysis</h5>
                <p className="text-sm text-gray-800 leading-relaxed">{report.analysis || "Not available."}</p>
            </div>

            {/* Issues */}
            <div className="mb-4">
                <h5 className="font-semibold text-sm text-gray-600 mb-1">🚩 Detected Issues</h5>
                {report.issues && report.issues.length > 0 ? (
                    <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
                        {report.issues.map((issue, i) => (
                            <li key={i}>{issue}</li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-gray-800">No major issues or exaggerations detected.</p>
                )}
            </div>

            {/* AI Writing Score */}
            <div className="mb-4">
                <h5 className="font-semibold text-sm text-gray-600 mb-1">🤖 AI-Writing Probability</h5>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getBadgeColor(score)}`}>
                    {score ?? "N/A"}%
                </span>
            </div>

            {/* Recommendation */}
            {report.recommendation && (
                <div className="mb-2">
                    <h5 className="font-semibold text-sm text-gray-600 mb-1">✅ Recommendation</h5>
                    <p className="text-sm text-gray-800">{report.recommendation}</p>
                </div>
            )}
        </div>
    );
}
