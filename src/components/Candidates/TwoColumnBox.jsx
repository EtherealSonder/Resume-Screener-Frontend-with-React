import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";

// 🔹 Parse bullet points or multiline strengths/weaknesses
function parsePoints(raw) {
    if (!raw) return [];

    try {
        // Handle Postgres arrays and JSON strings
        // Example 1: '["item1", "item2"]'
        // Example 2: '{"item1", "item2"}'
        const cleaned = raw.replace(/^{|}$/g, "").trim();

        // Case 1: Comma-separated inside curly braces → split manually
        if (cleaned.includes('","') || cleaned.includes('","')) {
            return cleaned
                .split(/"\s*,\s*"/)
                .map((s) => s.replace(/^"|"$/g, "").trim())
                .filter(Boolean);
        }

        // Case 2: It's a stringified JSON array
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
    } catch {
        // fallback: treat raw as text block
        return raw.split(/[.●•\n]/).map((s) => s.trim()).filter(Boolean);
    }

    return [raw];
}


export default function TwoColumnBox({ strengths, weaknesses }) {
    const strengthPoints = parsePoints(strengths);
    const weaknessPoints = parsePoints(weaknesses);

    const renderList = (items, fallback) => {
        if (!items || items.length === 0) {
            return <p className="text-sm text-gray-800">{fallback}</p>;
        }

        return (
            <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
                {items.map((item, idx) => (
                    <li key={idx}>{item}</li>
                ))}
            </ul>
        );
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1 font-semibold text-green-700">
                    <FaThumbsUp /> Strengths
                </div>
                {renderList(strengthPoints, "No strengths")}
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1 font-semibold text-red-700">
                    <FaThumbsDown /> Weaknesses
                </div>
                {renderList(weaknessPoints, "No weaknesses")}
            </div>
        </div>
    );
}
