import { useEffect, useState, useRef } from "react";
import {
    ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Legend, Line
} from "recharts";
import LoadingSpinner from "../candidates/LoadingSpinner";
import ExportButtons from "../ExportButtons";

const COLORS = [
    "#1E90FF", "#FF6347", "#32CD32", "#FFA500", "#BA55D3",
    "#20B2AA", "#FFD700", "#FF69B4", "#A52A2A", "#87CEEB"
];

export default function ScoreExperienceChart({
    data,
    selectedJobs,
    onChangeJobs
}) {
    const chartRef = useRef();
    const jobTitles = Array.from(new Set(data.map((d) => d.job_title)));

    // Default to "All Jobs"
    useEffect(() => {
        if (selectedJobs.length === 0 && jobTitles.length > 0) {
            onChangeJobs(["All Jobs"]);
        }
    }, [jobTitles, selectedJobs, onChangeJobs]);

    const filteredData = data
        .filter(d => selectedJobs[0] === "All Jobs" || d.job_title === selectedJobs[0])
        .map(d => ({
            ...d,
            candidate_name: d.candidate_name || d.name || "Unnamed",
            job_title: d.job_title || "Unknown"
        }));

    const trendData = (() => {
        if (filteredData.length < 2) return [];
        const n = filteredData.length;
        const sumX = filteredData.reduce((acc, d) => acc + d.experience, 0);
        const sumY = filteredData.reduce((acc, d) => acc + d.score, 0);
        const sumXY = filteredData.reduce((acc, d) => acc + d.experience * d.score, 0);
        const sumXX = filteredData.reduce((acc, d) => acc + d.experience * d.experience, 0);

        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX || 1);
        const intercept = (sumY - slope * sumX) / n;

        const xVals = filteredData.map(d => d.experience);
        const minX = Math.min(...xVals);
        const maxX = Math.max(...xVals);

        return [
            { experience: minX, score: slope * minX + intercept },
            { experience: maxX, score: slope * maxX + intercept }
        ];
    })();

    return (
        <div className="space-y-4 fade-in">
            <h2 className="text-xl font-semibold text-gray-800">Score vs Experience</h2>
            <p className="text-sm text-gray-600">Shows how candidate experience correlates with resume scores across job roles.</p>

            {/* Single-Select Filter */}
            <div className="flex flex-wrap justify-between items-center gap-4">
                <div className="flex flex-col space-y-1 w-64">
                    <label className="text-sm font-medium text-gray-700">Filter by Job:</label>
                    <select
                        value={selectedJobs[0] || "All Jobs"}
                        onChange={(e) => onChangeJobs([e.target.value])}
                        className="border rounded px-3 py-2 text-sm"
                    >
                        <option value="All Jobs">All Jobs</option>
                        {jobTitles.map((title, idx) => (
                            <option key={idx} value={title}>{title}</option>
                        ))}
                    </select>
                </div>

                <ExportButtons targetRef={chartRef} fileName="Score_vs_Experience" exportPNGOnly />
            </div>

            {!selectedJobs.length ? (
                <p className="italic text-gray-500">No jobs selected. Please use the filter above.</p>
            ) : !filteredData.length ? (
                <p className="italic text-gray-500">No data available for selected job.</p>
            ) : (
                <div ref={chartRef} className="w-full h-[400px] bg-gray-100 p-6 rounded-xl shadow animate-fadeIn">
                    <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 20, right: 30, bottom: 40, left: 10 }}>
                            <CartesianGrid />
                            <XAxis
                                type="number"
                                dataKey="experience"
                                stroke="#000"
                                label={{ value: "Experience (Years)", position: "bottom", offset: 0 }}
                            />
                            <YAxis
                                type="number"
                                dataKey="score"
                                stroke="#000"
                                label={{ value: "Resume Score", angle: -90, position: "insideLeft" }}
                            />
                            <Tooltip
                                cursor={{ strokeDasharray: "3 3" }}
                                content={({ active, payload }) => {
                                    if (active && payload?.length) {
                                        const { candidate_name, job_title, score, experience } = payload[0].payload;
                                        return (
                                            <div className="bg-gray-800 text-white text-sm border border-gray-600 rounded shadow px-4 py-2">
                                                <div className="font-bold">{candidate_name}</div>
                                                <div className="text-sm">Job: {job_title}</div>
                                                <div className="text-sm">Score: {score}</div>
                                                <div className="text-sm">Experience: {experience} yrs</div>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />

                            {selectedJobs[0] === "All Jobs" ? (
                                jobTitles.map((title, idx) => (
                                    <Scatter
                                        key={idx}
                                        name={title}
                                        data={filteredData.filter(d => d.job_title === title)}
                                        fill={COLORS[idx % COLORS.length]}
                                    />
                                ))
                            ) : (
                                <Scatter name={selectedJobs[0]} data={filteredData} fill={COLORS[0]} />
                            )}

                            {trendData.length === 2 && (
                                <Line
                                    type="linear"
                                    dataKey="score"
                                    data={trendData}
                                    stroke="#333"
                                    strokeDasharray="4 2"
                                    dot={false}
                                />
                            )}

                            <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: "12px", marginTop: "12px", paddingTop: "12px" }} />
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}
