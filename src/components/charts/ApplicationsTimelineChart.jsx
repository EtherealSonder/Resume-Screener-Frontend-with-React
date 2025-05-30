import React, { useMemo, useState } from "react";
import {
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Brush,
} from "recharts";

const formatDateLabel = (dateStr, viewMode) => {
    const date = new Date(dateStr);
    if (viewMode === "monthly") {
        return date.toLocaleString("default", { month: "short" });
    } else if (viewMode === "weekly") {
        const start = new Date(dateStr);
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        return `${start.getDate()} ${start.toLocaleString("default", { month: "short" })} - ${end.getDate()} ${end.toLocaleString("default", { month: "short" })}`;
    } else {
        return date.toLocaleDateString("default", { month: "short", day: "numeric" });
    }
};

export default function ApplicationsTimelineChart({ data = [], jobs = [] }) {
    const [selectedJob, setSelectedJob] = useState("All Jobs");
    const [viewMode, setViewMode] = useState("daily");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const filteredData = useMemo(() => {
        let filtered = data;
        if (selectedJob !== "All Jobs" && data[0]?.job_title) {
            filtered = data.filter((d) => d.job_title === selectedJob);
        }
        if (startDate) filtered = filtered.filter((d) => d.date >= startDate);
        if (endDate) filtered = filtered.filter((d) => d.date <= endDate);
        return filtered;
    }, [data, selectedJob, startDate, endDate]);

    const dailyAggregated = useMemo(() => {
        const map = {};
        filteredData.forEach((d) => {
            if (!map[d.date]) map[d.date] = 0;
            map[d.date] += d.count;
        });
        return map;
    }, [filteredData]);

    const buildChartData = () => {
        const today = new Date();
        const dataPoints = [];

        if (viewMode === "daily") {
            for (let i = 29; i >= 0; i--) {
                const d = new Date(today);
                d.setDate(today.getDate() - i);
                const dateStr = d.toISOString().slice(0, 10);
                dataPoints.push({
                    date: dateStr,
                    count: dailyAggregated[dateStr] || 0,
                });
            }
        } else if (viewMode === "weekly") {
            for (let i = 3; i >= 0; i--) {
                const start = new Date(today);
                start.setDate(today.getDate() - i * 7 - 6);
                const end = new Date(start);
                end.setDate(start.getDate() + 6);

                let count = 0;
                Object.keys(dailyAggregated).forEach((d) => {
                    const day = new Date(d);
                    if (day >= start && day <= end) {
                        count += dailyAggregated[d];
                    }
                });

                dataPoints.push({
                    date: start.toISOString().slice(0, 10),
                    count,
                });
            }
        } else {
            // Monthly
            const year = today.getFullYear();
            for (let i = 0; i < 12; i++) {
                const monthDate = new Date(year, i + 1, 0); // end of month to get correct month
                let count = 0;
                Object.keys(dailyAggregated).forEach((d) => {
                    const day = new Date(d);
                    if (day.getMonth() === i && day.getFullYear() === year) {
                        count += dailyAggregated[d];
                    }
                });
                dataPoints.push({
                    date: monthDate.toISOString().slice(0, 10),
                    count,
                });
            }
        }
        return dataPoints;
    };

    const chartData = useMemo(buildChartData, [viewMode, dailyAggregated]);

    const peakPoint = useMemo(() => {
        return chartData.reduce((max, curr) => (curr.count > max.count ? curr : max), { count: 0 });
    }, [chartData]);

    const maxCount = useMemo(() => {
        return Math.max(...chartData.map((d) => d.count || 0), 0);
    }, [chartData]);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const point = payload[0].payload;
            return (
                <div className="bg-white p-2 border rounded shadow text-xs">
                    <p><strong>Date:</strong> {formatDateLabel(label, viewMode)}</p>
                    <p><strong>Applications:</strong> {Math.round(point.count)}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-gray-100 p-4 rounded-xl shadow flex flex-col gap-4 fade-in">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Filter by Job:</label>
                    <select
                        className="border px-3 py-2 rounded text-sm"
                        value={selectedJob}
                        onChange={(e) => setSelectedJob(e.target.value)}
                    >
                        <option>All Jobs</option>
                        {jobs.map((title, idx) => (
                            <option key={idx}>{title}</option>
                        ))}
                    </select>
                </div>
                <div className="flex gap-2 text-sm items-center">
                    <label>From:</label>
                    <input
                        type="date"
                        className="border px-2 py-1 rounded"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                    <label>To:</label>
                    <input
                        type="date"
                        className="border px-2 py-1 rounded"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    {["daily", "weekly", "monthly"].map((mode) => (
                        <button
                            key={mode}
                            onClick={() => setViewMode(mode)}
                            className={`px-3 py-1 rounded border text-sm ${viewMode === mode ? "bg-gray-700 text-white" : "bg-white text-black border-gray-400"
                                }`}
                        >
                            {mode.charAt(0).toUpperCase() + mode.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Chart */}
            <div className="p-2">
                <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={chartData} margin={{ bottom: 50, left: 50 }}>
                        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                        <XAxis
                            dataKey="date"
                            tickFormatter={(dateStr) => formatDateLabel(dateStr, viewMode)}
                            angle={viewMode === "daily" ? -90 : 0}
                            textAnchor={viewMode === "daily" ? "end" : "middle"}
                            height={viewMode === "daily" ? 70 : 30}
                            interval={0}
                        />
                        <YAxis allowDecimals={false} domain={[0, Math.ceil(maxCount + 2)]} />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                            type="monotone"
                            dataKey="count"
                            stroke="#06b6d4"
                            strokeWidth={2}
                            dot={(props) => {
                                const { cx, cy, payload } = props;
                                const color = payload.date === peakPoint.date ? "red" : "#06b6d4";
                                return (
                                    <circle
                                        cx={cx}
                                        cy={cy}
                                        r={payload.date === peakPoint.date ? 4 : 2}
                                        fill={color}
                                    />
                                );
                            }}
                            activeDot={{ r: 4, fill: "#06b6d4" }}
                        />
                        <text
                            x="50%"
                            y="100%"
                            textAnchor="middle"
                            dy={40}
                            className="text-xs fill-gray-500"
                        >
                            Date
                        </text>
                        <Brush
                            dataKey="date"
                            height={20}
                            stroke="#888"
                            travellerWidth={10}
                            y={330}
                            fillOpacity={1}
                            fill="#fff"
                            strokeOpacity={0.5}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
