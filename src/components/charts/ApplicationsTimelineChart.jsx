import { useMemo, useState } from "react";
import LineChartCard from "./LineChartCard";

const groupBy = (data, keyFn) => {
    const result = {};
    data.forEach(item => {
        const key = keyFn(item.date);
        result[key] = (result[key] || 0) + item.count;
    });
    return Object.entries(result).map(([date, count]) => ({ date, count }));
};

export default function ApplicationsTimelineChart({ data = [], jobs = [] }) {
    const [selectedJob, setSelectedJob] = useState("All Jobs");
    const [viewMode, setViewMode] = useState("daily");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // Filter by selected job
    const filteredData = useMemo(() => {
        let filtered = [...data];
        if (selectedJob !== "All Jobs" && data[0]?.job_title) {
            filtered = filtered.filter(d => d.job_title === selectedJob);
        }
        if (startDate) filtered = filtered.filter(d => d.date >= startDate);
        if (endDate) filtered = filtered.filter(d => d.date <= endDate);
        return filtered;
    }, [data, selectedJob, startDate, endDate]);

    // Group by mode (daily, weekly, monthly)
    const groupedData = useMemo(() => {
        if (viewMode === "weekly") {
            return groupBy(filteredData, date => {
                const d = new Date(date);
                const start = new Date(d);
                start.setDate(d.getDate() - d.getDay());
                return start.toISOString().slice(0, 10);
            });
        } else if (viewMode === "monthly") {
            return groupBy(filteredData, date => date.slice(0, 7));
        }
        return filteredData;
    }, [filteredData, viewMode]);

    const peak = useMemo(() => {
        return groupedData.reduce((max, curr) => (curr.count > max.count ? curr : max), { count: 0 });
    }, [groupedData]);

    return (
        <div className="bg-gray-100 p-6 rounded-xl shadow text-black space-y-4 fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-semibold text-amber-700">Applications Timeline</h2>
                    <p className="text-sm text-gray-700">Tracks the volume of applications over time with filters by job and date range.</p>
                </div>
            </div>

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

                <div className="flex gap-2">
                    {["daily", "weekly", "monthly"].map((mode) => (
                        <button
                            key={mode}
                            onClick={() => setViewMode(mode)}
                            className={`px-3 py-1 rounded border text-sm ${viewMode === mode ? "bg-blue-600 text-white" : "bg-white text-gray-700 border-gray-300"}`}
                        >
                            {mode.charAt(0).toUpperCase() + mode.slice(1)}
                        </button>
                    ))}
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
            </div>

            <LineChartCard
                title="Applications Over Time"
                data={groupedData}
                xKey="date"
                yKey="count"
                highlightPoint={peak}
            />
        </div>
    );
}
