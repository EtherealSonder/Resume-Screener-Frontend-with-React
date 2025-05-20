import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    Line,
} from "recharts";
import LoadingSpinner from "../candidates/LoadingSpinner";

const COLORS = [
    "#1E90FF", "#FF6347", "#32CD32", "#FFA500", "#BA55D3",
    "#20B2AA", "#FFD700", "#FF69B4", "#A52A2A", "#87CEEB"
];

export default function ScoreExperienceChart({ data, selectedJobs, onChangeJobs }) {
    const filteredData = data
        .filter(d => selectedJobs.includes(d.job_title))
        .map(d => ({
            ...d,
            candidate_name: d.candidate_name || d.name || "Unnamed",
            job_title: d.job_title || "Unknown",
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
            { experience: maxX, score: slope * maxX + intercept },
        ];
    })();

    if (!selectedJobs.length) {
        return (
            <div className="bg-white p-6 rounded-xl shadow text-black">
                <p className="italic text-gray-500">No jobs selected. Please use the filter above.</p>
            </div>
        );
    }

    if (!filteredData.length) {
        return (
            <div className="bg-white p-6 rounded-xl shadow text-black">
                <p className="italic text-gray-500">No data available for selected job(s).</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow text-black">
            <ResponsiveContainer width="100%" height={350}>
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

                    {selectedJobs.map((title, idx) => (
                        <Scatter
                            key={idx}
                            name={title}
                            data={filteredData.filter(d => d.job_title === title)}
                            fill={COLORS[idx % COLORS.length]}
                        />
                    ))}

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

                    <Legend
                        verticalAlign="bottom"
                        wrapperStyle={{ fontSize: "12px", marginTop: "12px", paddingTop: "12px" }}
                    />
                </ScatterChart>
            </ResponsiveContainer>
        </div>
    );
}
