import React, { useRef, useEffect, useState } from "react";
import ReactWordcloud from "react-wordcloud";

export default function SkillWordCloud({ data }) {
    const containerRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (containerRef.current) {
            const observer = new ResizeObserver((entries) => {
                for (const entry of entries) {
                    const { width, height } = entry.contentRect;
                    if (width && height) {
                        setDimensions({
                            width: Math.floor(width),
                            height: Math.floor(height),
                        });
                    }
                }
            });
            observer.observe(containerRef.current);
            return () => observer.disconnect();
        }
    }, []);

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

    const options = {
        rotations: 2,
        rotationAngles: [0, 0],
        fontSizes: [14, 60],
        fontFamily: "sans-serif",
        enableTooltip: true,
        padding: 2,
    };

    const shouldRender = words.length > 0 && dimensions.width > 200 && dimensions.height > 200;

    return (
        <div className="bg-white p-6 rounded-xl shadow mb-6">
            <h2 className="text-xl font-semibold mb-4">Skill Frequency (Word Cloud)</h2>
            <div ref={containerRef} style={{ width: "100%", height: "400px" }}>
                {shouldRender ? (
                    <ReactWordcloud words={words} options={options} />
                ) : (
                    <p className="text-center text-gray-500 italic">
                        No data available or container not ready.
                    </p>
                )}
            </div>
        </div>
    );
}
