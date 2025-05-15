import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

export default function ScatterChartCard({ title, data, xKey, yKey }) {
    return (
        <div className="bg-white/20 backdrop-blur-md p-6 rounded-xl shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4 text-white">{title}</h2>
            <ResponsiveContainer width="100%" height={300}>
                <ScatterChart>
                    <CartesianGrid />
                    <XAxis dataKey={xKey} stroke="#fff" name="Score" />
                    <YAxis dataKey={yKey} stroke="#fff" name="Experience" />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: "#222", borderRadius: 8 }} />
                    <Scatter name="Candidates" data={data} fill="#facc15" />
                </ScatterChart>
            </ResponsiveContainer>
        </div>
    );
}
