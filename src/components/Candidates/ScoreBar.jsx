// components/candidates/ScoreBar.jsx
export default function ScoreBar({ label, score }) {
    const getColor = () => {
        if (score > 70) return "bg-green-500";
        if (score > 40) return "bg-yellow-400";
        return "bg-red-500";
    };

    return (
        <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-1">{label}</p>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                    className={`h-full ${getColor()} transition-all`}
                    style={{ width: `${score}%` }}
                ></div>
            </div>
            <p className="text-xs text-right text-gray-500 mt-1">{score}/100</p>
        </div>
    );
}
