import { useState } from "react";
import { ResponsiveContainer, Treemap, Tooltip } from "recharts";

export default function SkillGridHeatmap({ data }) {
    const [selectedJob, setSelectedJob] = useState(null);

    const validData = Array.isArray(data) ? data : [];

    const nested = Object.values(
        validData.reduce((acc, { job_title, skill, count }) => {
            if (!job_title || !skill || typeof count !== "number") return acc;
            if (!acc[job_title]) acc[job_title] = { name: job_title, children: [] };
            acc[job_title].children.push({
                name: skill,
                size: count,
                skill,
                job_title,
            });
            return acc;
        }, {})
    );

    const filtered = selectedJob
        ? nested.filter((j) => j.name === selectedJob)
        : nested;

    const hasData = filtered.length > 0 && filtered.some(j => j.children?.length > 0);

    return (
        <div className="bg-white p-6 rounded-xl shadow mb-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Skill by Job Title (Grid Heatmap)</h2>
                {selectedJob && (
                    <button
                        onClick={() => setSelectedJob(null)}
                        className="text-sm px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                        Clear Filter
                    </button>
                )}
            </div>

            {!hasData ? (
                <p className="text-center text-gray-500 italic">
                    No heatmap data available.
                </p>
            ) : (
                <ResponsiveContainer width="100%" height={400}>
                    <Treemap
                        data={filtered}
                        dataKey="size"
                        nameKey="name"
                        stroke="#fff"
                        fill="#60a5fa"
                        onClick={(node) => {
                            if (node.depth === 1) {
                                setSelectedJob(node.name);
                            }
                        }}
                    >
                        <Tooltip content={<CustomTreemapTooltip />} />
                    </Treemap>
                </ResponsiveContainer>
            )}
        </div>
    );
}

function CustomTreemapTooltip({ active, payload }) {
    if (!active || !payload || !payload[0] || !payload[0].payload) return null;
    const { job_title, skill, size } = payload[0].payload;
    return (
        <div className="bg-white border border-gray-300 p-2 rounded text-sm shadow-lg">
            <div><strong>Skill:</strong> {skill}</div>
            <div><strong>Job:</strong> {job_title}</div>
            <div><strong>Count:</strong> {size} candidate{size !== 1 ? "s" : ""}</div>
        </div>
    );
}
