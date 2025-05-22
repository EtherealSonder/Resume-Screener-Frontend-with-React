import React from "react";

export default function SkillWordCloudCustom({ data }) {
    const words = Array.isArray(data)
        ? data
            .filter(
                (d) =>
                    d &&
                    typeof d.skill === "string" &&
                    d.skill.trim() !== "" &&
                    typeof d.count === "number" &&
                    d.count > 0
            )
            .map(({ skill, count }) => ({
                text: skill.trim(),
                value: count,
            }))
        : [];

    if (words.length === 0) {
        return (
            <div className="bg-white p-6 rounded-xl shadow mb-6">
                <h2 className="text-xl font-semibold mb-4">Skill Frequency (Word Cloud)</h2>
                <p className="text-center text-gray-500 italic">No skills to display.</p>
            </div>
        );
    }

    const maxValue = Math.max(...words.map((w) => w.value));
    const minValue = Math.min(...words.map((w) => w.value));
    const range = maxValue - minValue || 1;

    const getFontSize = (val) => {
        const minSize = 14;
        const maxSize = 48;
        return ((val - minValue) / range) * (maxSize - minSize) + minSize;
    };

    const getColor = (text) => {
        const colors = [
            "#2563eb", "#10b981", "#f59e0b", "#f43f5e",
            "#8b5cf6", "#0ea5e9", "#e11d48", "#22c55e",
        ];
        const index = [...text].reduce((acc, c) => acc + c.charCodeAt(0), 0) % colors.length;
        return colors[index];
    };

    const shuffled = [...words].sort(() => Math.random() - 0.5);

    return (
        <div className="bg-white p-6 rounded-xl shadow mb-6 w-full">
            <h2 className="text-xl font-semibold mb-4">Skill Frequency (Word Cloud)</h2>
            <div className="relative flex flex-wrap gap-3 justify-center items-center">
                {shuffled.map((word, i) => (
                    <div
                        key={i}
                        className="relative group cursor-default"
                        style={{
                            fontSize: `${getFontSize(word.value)}px`,
                            color: getColor(word.text),
                        }}
                    >
                        {word.text}
                        <div className="absolute z-10 hidden group-hover:flex bg-black text-white text-xs px-2 py-1 rounded shadow -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                            {word.value} candidate{word.value !== 1 ? "s" : ""}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
