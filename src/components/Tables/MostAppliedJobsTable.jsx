import { useState, useMemo } from "react";
import ExportButtons from "../ExportButtons";

// Color box for Top Score
function getScoreColor(score) {
    if (score >= 70) return "bg-green-200 text-green-800";
    if (score >= 40) return "bg-yellow-200 text-yellow-800";
    return "bg-red-200 text-red-800";
}

export default function MostAppliedJobsTable({ data = [] }) {
    const [sortField, setSortField] = useState("application_count");
    const [sortOrder, setSortOrder] = useState("desc");

    const sortedData = useMemo(() => {
        const sorted = [...data];
        sorted.sort((a, b) => {
            const valA = a[sortField] ?? 0;
            const valB = b[sortField] ?? 0;
            return sortOrder === "asc" ? valA - valB : valB - valA;
        });
        return sorted;
    }, [data, sortField, sortOrder]);

    const maxApplications = Math.max(...data.map(d => d.application_count), 1);

    const handleSort = (field) => {
        if (sortField === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortOrder("desc");
        }
    };

    return (
        <div className="space-y-4 fade-in">
            <h2 className="text-xl font-semibold text-gray-800">Most Applied Jobs</h2>
            <p className="text-sm text-gray-600">Breakdown of application volume per job title.</p>

            <div className="flex justify-end">
                <ExportButtons data={sortedData} fileName="MostAppliedJobs" exportCSVOnly />
            </div>

            {data.length === 0 ? (
                <p className="italic text-gray-500">No job data available.</p>
            ) : (
                <div className="overflow-auto max-h-[500px] rounded border border-gray-300">
                    <table className="w-full text-sm table-auto border-collapse">
                        <thead className="bg-gray-100 sticky top-0 z-10">
                            <tr className="text-left text-black">
                                <th className="px-3 py-2">#</th>
                                <th className="px-3 py-2">Job Title</th>
                                <th
                                    className="px-3 py-2 cursor-pointer hover:underline"
                                    onClick={() => handleSort("application_count")}
                                >
                                    Applications {sortField === "application_count" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                                </th>
                                <th
                                    className="px-3 py-2 cursor-pointer hover:underline"
                                    onClick={() => handleSort("avg_score")}
                                >
                                    Avg Score {sortField === "avg_score" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                                </th>
                                <th className="px-3 py-2">Top Candidate</th>
                                <th
                                    className="px-3 py-2 cursor-pointer hover:underline"
                                    onClick={() => handleSort("top_candidate_score")}
                                >
                                    Top Score {sortField === "top_candidate_score" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                                </th>
                                <th className="px-3 py-2">Posted On</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-800">
                            {sortedData.map((job, idx) => (
                                <tr key={idx} className="border-t border-gray-200 hover:bg-gray-50">
                                    <td className="px-3 py-2 font-medium">{idx + 1}</td>
                                    <td className="px-3 py-2">{job.job_title}</td>

                                    {/* Applications + sparkline bar */}
                                    <td className="px-3 py-2">
                                        <div className="flex items-center gap-2">
                                            <span>{job.application_count}</span>
                                            <div className="w-24 h-2 bg-gray-200 rounded">
                                                <div
                                                    className="h-2 bg-blue-500 rounded"
                                                    style={{
                                                        width: `${Math.round((job.application_count / maxApplications) * 100)}%`
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-3 py-2">{job.avg_score}</td>
                                    <td className="px-3 py-2">{job.top_candidate_name || "—"}</td>

                                    <td className="px-3 py-2">
                                        <span
                                            className={`px-2 py-1 rounded text-xs font-semibold ${getScoreColor(job.top_candidate_score ?? 0)}`}
                                        >
                                            {job.top_candidate_score ?? 0}
                                        </span>
                                    </td>

                                    <td className="px-3 py-2">
                                        {job.created_at ? new Date(job.created_at).toLocaleDateString() : "—"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
