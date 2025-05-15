import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

export default function LineChartCard({ title, data = [], xKey, yKey }) {
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
                    <Line type="monotone" dataKey={yKey} stroke="#00f5d4" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
