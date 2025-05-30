import React from "react";
import { ResponsiveContainer, LineChart, Line } from "recharts";

export default function CoverLetterAnalysis({ report, score }) {
    if (!report || typeof report !== "object") return null;

    const metrics = [
        { label: "Clarity", value: report.clarity },
        { label: "Relevance", value: report.relevance },
        { label: "Engagement", value: report.engagement },
        { label: "Originality", value: report.originality },
        { label: "Tone Consistency", value: report.tone_consistency },
    ];

    const getBadgeColor = (value) => {
        if (value >= 80) return "bg-green-100 text-green-700";
        if (value >= 50) return "bg-yellow-100 text-yellow-700";
        return "bg-red-100 text-red-700";
    };

    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h4 className="text-lg font-bold text-gray-800 mb-4">Cover Letter Analysis</h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {metrics.map((metric, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                        <p className="text-sm text-gray-600 font-medium">{metric.label}</p>
                        <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getBadgeColor(metric.value)}`}
                        >
                            {metric.value ?? "N/A"} / 100
                        </span>
                    </div>
                ))}
            </div>

            {report.analysis && (
                <div className="mb-4">
                    <h5 className="font-semibold text-sm text-gray-600 mb-1">🧠 Overall Analysis</h5>
                    {typeof report.analysis === "string" ? (
                        <p className="text-sm text-gray-800 leading-relaxed">{report.analysis}</p>
                    ) : (
                        <div className="space-y-1">
                            {Object.entries(report.analysis).map(([key, val]) => (
                                <p key={key} className="text-sm text-gray-800">
                                    <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {val}
                                </p>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <div className="mt-4">
                <h5 className="font-semibold text-sm text-gray-600 mb-1">✏️ Cover Letter Score</h5>
                <div className="border border-gray-300 rounded-lg p-3 bg-gray-50 text-center font-bold text-lg text-gray-800">
                    {score ?? "N/A"} / 100
                </div>
            </div>
        </div>
    );
}
