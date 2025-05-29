import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

export default function BarChartCard({
    data,
    xKey,
    dataKey,
    xLabel,
    yLabel,
    tooltipFormatter
}) {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data} margin={{ top: 20, right: 30, bottom: 40, left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey={xKey}
                    label={{
                        value: xLabel,
                        position: "insideBottom",
                        offset: -5
                    }}
                    stroke="#000"
                />
                <YAxis
                    label={{
                        value: yLabel,
                        angle: -90,
                        position: "insideLeft",
                        offset: 0,
                        style: { textAnchor: "middle" }
                    }}
                    stroke="#000"
                />
                <Tooltip formatter={tooltipFormatter} />
                <Bar dataKey={dataKey} isAnimationActive={false} />
            </BarChart>
        </ResponsiveContainer>
    );
}
