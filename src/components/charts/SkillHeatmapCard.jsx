import { ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, BarChart, Bar, Cell } from "recharts";

export default function SkillHeatmapCard({ title, data = [] }) {
    const colors = [
        "#fef3c7", "#fde68a", "#fcd34d", "#fbbf24", "#f59e0b",
        "#d97706", "#b45309", "#92400e", "#78350f", "#451a03"
    ];

    if (!data.length) {
        return (
            <div className="bg-white/20 backdrop-blur-md p-6 rounded-xl shadow-md mb-6 text-white">
                <h2 className="text-xl font-semibold mb-4">{title}</h2>
                <p className="italic text-gray-600">No data available</p>
            </div>
        );
    }

    const maxCount = Math.max(...data.map(d => d.count));
    const getColor = (count) => {
        const index = Math.floor((count / maxCount) * (colors.length - 1));
        return colors[index];
    };

    return (
        <div className="bg-white/20 backdrop-blur-md p-6 rounded-xl shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4 text-black">{title}</h2>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 50, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" stroke="#000" />
                    <YAxis dataKey="skill" type="category" stroke="#000" width={120} />
                    <Tooltip
                        formatter={(value) => `${value} candidates`}
                        contentStyle={{ backgroundColor: "#222", borderRadius: 8, color: "white" }}
                        itemStyle={{ color: "white" }}
                        labelStyle={{ color: "white" }}
                    />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={getColor(entry.count)} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
