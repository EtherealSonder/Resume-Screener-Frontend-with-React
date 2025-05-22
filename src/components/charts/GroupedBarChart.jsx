import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function GroupedBarChart({ data }) {
    const jobKeys = Object.keys(data[0] || {}).filter((key) => key !== "skill");

    return (
        <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4">Skill Frequency by Job</h2>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart
                    layout="vertical"
                    data={data}
                    margin={{ top: 10, right: 30, left: 50, bottom: 5 }}
                >
                    <XAxis type="number" />
                    <YAxis dataKey="skill" type="category" width={150} />
                    <Tooltip />
                    <Legend />
                    {jobKeys.map((key, i) => (
                        <Bar
                            key={key}
                            dataKey={key}
                            fill={`hsl(${(i * 60) % 360}, 70%, 60%)`}
                            barSize={20}
                        />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
