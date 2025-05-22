import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Legend,
    Tooltip,
} from "recharts";

// Helper to truncate long skill names
function truncateSkill(skill) {
    if (!skill) return "";
    return skill.length > 18 ? skill.slice(0, 16) + "…" : skill;
}

export default function RadarSkillChart({ data, selectedJobs }) {
    const isValid = data && data.length >= 3;

    return (
        <div className="bg-white p-6 rounded-xl shadow min-h-[400px] flex items-center justify-center">
            {isValid ? (
                <ResponsiveContainer width="100%" height={400}>
                    <RadarChart outerRadius="80%" data={data}>
                        <PolarGrid />
                        <PolarAngleAxis
                            dataKey="skill"
                            tick={{
                                fontSize: 11,
                                angle: 30,
                                dy: 8,
                                textAnchor: "middle",
                            }}
                            tickFormatter={truncateSkill}
                        />
                        <PolarRadiusAxis />
                        <Radar
                            name={selectedJobs[0]}
                            dataKey={selectedJobs[0]}
                            stroke="#8884d8"
                            fill="#8884d8"
                            fillOpacity={0.6}
                        />
                        <Radar
                            name={selectedJobs[1]}
                            dataKey={selectedJobs[1]}
                            stroke="#82ca9d"
                            fill="#82ca9d"
                            fillOpacity={0.6}
                        />
                        <Legend />
                        <Tooltip />
                    </RadarChart>
                </ResponsiveContainer>
            ) : (
                <p className="text-gray-500 text-center italic">
                    Not enough shared skills to generate a radar chart. Try comparing jobs with more overlap.
                </p>
            )}
        </div>
    );
}
