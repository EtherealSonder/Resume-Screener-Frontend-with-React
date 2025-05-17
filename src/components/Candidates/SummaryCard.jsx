// components/candidates/SummaryCard.jsx
import { FaStickyNote } from "react-icons/fa";

export default function SummaryCard({ summary }) {
    return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 mb-2 text-blue-700 font-semibold">
                <FaStickyNote />
                Summary
            </div>
            <p className="text-sm text-gray-700">{summary}</p>
        </div>
    );
}
