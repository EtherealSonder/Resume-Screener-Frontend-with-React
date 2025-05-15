import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

export default function ScatterChartCard({ title, data = [], xKey, yKey }) {
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
                <ScatterChart>
                    <CartesianGrid />
                    <XAxis dataKey={xKey} name="Experience" />
                    <YAxis dataKey={yKey} name="Score" />
                    <Tooltip
                        contentStyle={{ backgroundColor: "#222", borderRadius: 8, color: "white" }}
                        labelStyle={{ color: "white" }}
                        itemStyle={{ color: "white" }}
                    />
                    <Scatter name="Candidates" data={data} fill="#facc15" />
                </ScatterChart>
            </ResponsiveContainer>
        </div>
    );
}
