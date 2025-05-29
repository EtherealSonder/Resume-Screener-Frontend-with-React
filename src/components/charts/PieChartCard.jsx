import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

export default function PieChartCard({
    data,
    nameKey,
    valueKey,
    showLegend = false
}) {
    const COLORS = ["#2563eb", "#059669", "#d97706", "#dc2626", "#6d28d9", "#3b82f6", "#14b8a6", "#facc15"];

    return (
        <ResponsiveContainer width="100%" height={350}>
            <PieChart>
                <Pie
                    data={data}
                    dataKey={valueKey}
                    nameKey={nameKey}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                {showLegend && <Legend verticalAlign="bottom" height={36} />}
            </PieChart>
        </ResponsiveContainer>
    );
}
