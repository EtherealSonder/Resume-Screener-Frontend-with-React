import { ResponsiveContainer, LineChart, Line } from "recharts";

export default function MiniMetricCard({ icon, title, value, percentageChange, miniGraphData }) {
    // Determine line color and percentage text color based on change
    const isPositive = percentageChange >= 0;
    const lineColor = isPositive ? "#22c55e" : "#ef4444"; // green/red
    const pctTextColor = isPositive ? "text-green-600" : "text-red-600";
    const pctPrefix = isPositive ? "+" : ""; // show "+" for positive change

    return (
        <div className="bg-white p-4 rounded-xl shadow border border-gray-300 flex flex-col gap-2">
            <div className="flex items-center gap-2">
                {icon}
                <div>
                    <p className="text-xs text-gray-500">{title}</p>
                    <p className="text-xl font-bold text-gray-800">{value}</p>
                </div>
            </div>
            <div className="h-12">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={miniGraphData}>
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke={lineColor}
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <p className={`text-xs ${pctTextColor}`}>
                {pctPrefix}{percentageChange.toFixed(1)}% since last week
            </p>
        </div>
    );
}
