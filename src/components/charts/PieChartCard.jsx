import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#a0e9ff", "#ff6699", "#6366f1", "#14b8a6"];

export default function PieChartCard({
    title,
    data = [],
    nameKey = "label",
    valueKey = "value",
    showLegend = false
}) {
    if (!Array.isArray(data) || data.length === 0) {
        return (
            <div className="bg-white/20 backdrop-blur-md p-6 rounded-xl shadow-md mb-6 text-white">
                <h2 className="text-xl font-semibold mb-4">{title}</h2>
                <p className="italic text-gray-600">No data available</p>
            </div>
        );
    }

    return (
        <div className="bg-white/20 backdrop-blur-md p-6 rounded-xl shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4 text-black">{title}</h2>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        dataKey={valueKey}
                        nameKey={nameKey}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                    >
                        {data.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{ backgroundColor: "#222", borderRadius: 8, color: "white" }}
                        labelStyle={{ color: "white" }}
                        itemStyle={{ color: "white" }}
                    />
                    {showLegend && <Legend />}
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
