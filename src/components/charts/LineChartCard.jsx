import {
    LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Dot
} from "recharts";

export default function LineChartCard({ title, data = [], xKey, yKey, highlightPoint }) {
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
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={xKey} stroke="#000" />
                    <YAxis stroke="#000" />
                    <Tooltip
                        contentStyle={{ backgroundColor: "#222", borderRadius: 8, color: "white" }}
                        labelStyle={{ color: "white" }}
                        itemStyle={{ color: "white" }}
                    />
                    <Line
                        type="monotone"
                        dataKey={yKey}
                        stroke="#00f5d4"
                        strokeWidth={2}
                        dot={(props) => {
                            const { cx, cy, payload } = props;
                            if (highlightPoint && payload.date === highlightPoint.date) {
                                return (
                                    <circle cx={cx} cy={cy} r={6} fill="#ff4d4d" stroke="#000" strokeWidth={1.5} />
                                );
                            }
                            return <Dot {...props} r={3} fill="#00f5d4" />;
                        }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
