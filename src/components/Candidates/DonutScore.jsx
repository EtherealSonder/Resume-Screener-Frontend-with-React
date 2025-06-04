import React, { useState, useRef, useEffect } from "react";
import { PieChart, Pie, Cell } from "recharts";
import HoverBreakdownCard from "./HoverBreakdownCard";

export default function DonutScore({ label, score, breakdown = {} }) {
    const size = 140;
    const strokeWidth = 22;
    const [isHovered, setIsHovered] = useState(false);
    const [position, setPosition] = useState("center");
    const ref = useRef(null);

    const numericScore = Number(score);
    const safeScore =
        !isNaN(numericScore) && numericScore >= 0 && numericScore <= 100
            ? numericScore
            : null;

    const displayScore =
        safeScore !== null
            ? numericScore.toFixed(2).replace(/\.00$/, "").replace(/(\.\d{2})\d+/, "$1")
            : "–";

    const data =
        safeScore !== null
            ? [
                { name: "Score", value: safeScore },
                { name: "Remaining", value: 100 - safeScore },
            ]
            : [
                { name: "Score", value: 0 },
                { name: "Remaining", value: 100 },
            ];

    const getColor = (value) => {
        let r = 0,
            g = 0,
            b = 0;
        if (value <= 30) {
            r = 239;
            g = Math.round(68 * (value / 30));
            b = Math.round(68 * (value / 30));
        } else if (value <= 60) {
            const pct = (value - 30) / 30;
            r = 239;
            g = Math.round(68 + 187 * pct);
            b = 0;
        } else {
            const pct = (value - 60) / 40;
            r = Math.round(239 - 239 * pct);
            g = 255;
            b = 0;
        }
        return `rgb(${r}, ${g}, ${b})`;
    };

    const color = getColor(safeScore ?? 0); // fallback to red for visual consistency

    useEffect(() => {
        let initial = "center";
        if (label === "Candidate Match") initial = "right";
        else if (label === "Resume Quality") initial = "left";
        setPosition(initial);

        if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            const padding = 280;
            if (rect.left < padding) setPosition("right");
            else if (window.innerWidth - rect.right < padding) setPosition("left");
        }
    }, [isHovered, label]);

    return (
        <div
            ref={ref}
            className="relative flex flex-col items-center justify-center bg-white rounded-2xl shadow-md p-5 w-[180px] h-[220px]"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative w-[140px] h-[140px] flex items-center justify-center">
                <PieChart width={size} height={size}>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={size / 2 - strokeWidth}
                        outerRadius={size / 2}
                        startAngle={90}
                        endAngle={-270}
                        dataKey="value"
                        stroke="none"
                    >
                        <Cell key="score" fill={color} />
                        <Cell key="rest" fill="#e5e7eb" />
                    </Pie>
                </PieChart>

                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="text-4xl font-extrabold text-black leading-none">
                        {displayScore}
                    </div>
                </div>
            </div>

            <div className="mt-4 text-base font-semibold text-gray-600 text-center">
                {label}
            </div>

            {/* Hover Breakdown Card */}
            <div
                className={`absolute z-50 w-[250px] max-w-sm transition-opacity duration-300 ${isHovered ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    } ${position === "center"
                        ? "top-[110%] left-1/2 -translate-x-1/2"
                        : position === "left"
                            ? "top-[30%] right-[calc(100%+12px)]"
                            : "top-[30%] left-[calc(100%+12px)]"
                    }`}
            >
                <div className="relative">
                    <div className="absolute w-3 h-3 rotate-45 bg-gray-800 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[-1]" />
                    <HoverBreakdownCard breakdown={breakdown} />
                </div>
            </div>
        </div>
    );
}
