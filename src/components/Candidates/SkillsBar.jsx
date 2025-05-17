// components/candidates/SkillsBar.jsx

export default function SkillsBar({ percentage }) {
    const getColor = () => {
        if (percentage > 70) return "bg-green-500";
        if (percentage > 40) return "bg-yellow-400";
        return "bg-red-500";
    };

    return (
        <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-1">Skill Match</p>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                    className={`h-full ${getColor()} transition-all`}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
            <p className="text-xs text-right text-gray-500 mt-1">{percentage}% match</p>
        </div>
    );
}
