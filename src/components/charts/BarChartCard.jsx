import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
    Label,
    Cell
} from "recharts";

export default function BarChartCard({
    title,
    data = [],
    dataKey,
    xKey,
    xLabel = "",
    yLabel = "",
    barColors = [],
    tooltipFormatter = null
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
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={xKey} stroke="#000" height={50} interval={0} angle={0} tickMargin={10}>
                        {xLabel && <Label value={xLabel} position="insideBottom" offset={-2} style={{ fill: "#000", fontSize: 12 }} />}
                    </XAxis>
                    <YAxis stroke="#000" width={80}>
                        {yLabel && <Label value={yLabel} angle={-90} position="insideLeft" offset={10} style={{ fill: "#000", fontSize: 12 }} />}
                    </YAxis>
                    {tooltipFormatter ? (
                        <Tooltip
                            formatter={tooltipFormatter}
                            contentStyle={{ backgroundColor: "#222", borderRadius: 8, color: "white" }}
                            labelStyle={{ color: "white" }}
                            itemStyle={{ color: "white" }}
                        />
                    ) : (
                        <Tooltip
                            contentStyle={{ backgroundColor: "#222", borderRadius: 8, color: "white" }}
                            labelStyle={{ color: "white" }}
                            itemStyle={{ color: "white" }}
                        />
                    )}
                    <Bar dataKey={dataKey} radius={[4, 4, 0, 0]}>
                        {data.map((_, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={barColors[index % barColors.length] || "#38bdf8"}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
