import { useState, useEffect, useRef } from "react";
import ExportButtons from "../ExportButtons";
import LoadingSpinner from "../candidates/LoadingSpinner";

function getScoreColor(score) {
    if (score >= 70) return "bg-green-200 text-green-800";
    if (score >= 40) return "bg-yellow-200 text-yellow-800";
    return "bg-red-200 text-red-800";
}

export default function TopCandidatesTable({
    candidates,
    jobOptions = [],
    selectedJobs,
    onChangeJobs,
    onSelectCandidate
}) {
    const [sortField, setSortField] = useState("score");
    const [sortOrder, setSortOrder] = useState("desc");
    const [topN, setTopN] = useState(5);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const tableRef = useRef();

    useEffect(() => {
        setLoading(true);
        let data = [...candidates];

        // ✅ Only show data if selectedJobs has entries
        if (selectedJobs.length > 0) {
            data = data.filter(c => selectedJobs.includes(c.job_title));
        } else {
            data = [];
        }

        data.sort((a, b) => {
            const valA = a[sortField] ?? 0;
            const valB = b[sortField] ?? 0;
            return sortOrder === "asc" ? valA - valB : valB - valA;
        });

        setFiltered(data.slice(0, topN));
        setLoading(false);
    }, [sortField, sortOrder, topN, selectedJobs, candidates]);

    const handleSort = (field) => {
        if (sortField === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortOrder("desc");
        }
    };

    if (loading) return <LoadingSpinner />;

    if (!selectedJobs.length) {
        return (
            <div className="text-gray-500 italic p-4">
                No jobs selected. Please use the job filter above.
            </div>
        );
    }

    if (!filtered.length) {
        return (
            <div className="text-gray-500 italic p-4">
                No top candidates found for the selected job(s).
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow text-black">
            <div className="flex flex-wrap justify-between items-center mb-4">
                <label className="text-sm">Show Top Candidates:</label>
                <input
                    type="number"
                    min="1"
                    value={topN}
                    onChange={(e) => setTopN(parseInt(e.target.value))}
                    className="w-20 px-2 py-1 border rounded"
                />

                <ExportButtons data={filtered} fileName="TopCandidates" targetRef={tableRef} />
            </div>

            <div ref={tableRef} className="overflow-auto max-h-[500px] rounded border border-gray-300">
                <table className="w-full text-sm table-auto border-collapse">
                    <thead className="bg-gray-100 sticky top-0 z-10">
                        <tr className="text-left text-black">
                            <th className="px-3 py-2">#</th>
                            <th className="px-3 py-2">Name</th>
                            <th className="px-3 py-2">Job Title</th>
                            <th className="px-3 py-2 cursor-pointer hover:underline" onClick={() => handleSort("score")}>
                                Score {sortField === "score" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                            </th>
                            <th className="px-3 py-2 cursor-pointer hover:underline" onClick={() => handleSort("resume_quality_score")}>
                                Resume Quality {sortField === "resume_quality_score" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                            </th>
                            <th className="px-3 py-2 cursor-pointer hover:underline" onClick={() => handleSort("experience")}>
                                Experience (Years) {sortField === "experience" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                            </th>
                            <th className="px-3 py-2 cursor-pointer hover:underline" onClick={() => handleSort("skill_match")}>
                                Skill Match % {sortField === "skill_match" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                            </th>
                            <th className="px-3 py-2">Summary</th>
                            <th className="px-3 py-2">Submitted At</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-800">
                        {filtered.map((c, idx) => (
                            <tr key={idx} className="border-t border-gray-200 hover:bg-gray-50">
                                <td className="px-3 py-2 font-medium">{idx + 1}</td>
                                <td className="px-3 py-2">
                                    <button
                                        className="text-blue-600 underline font-medium hover:text-blue-800"
                                        onClick={() => onSelectCandidate?.(c)}
                                    >
                                        {c.name}
                                    </button>
                                </td>
                                <td className="px-3 py-2">{c.job_title}</td>
                                <td className="px-3 py-2">
                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getScoreColor(c.score ?? 0)}`}>
                                        {c.score ?? 0}
                                    </span>
                                </td>
                                <td className="px-3 py-2">{c.resume_quality_score ?? 0}</td>
                                <td className="px-3 py-2">{c.experience ?? 0}</td>
                                <td className="px-3 py-2">{c.skill_match ?? 0}</td>
                                <td className="px-3 py-2 whitespace-pre-wrap max-w-xs">{c.summary || "—"}</td>
                                <td className="px-3 py-2">
                                    {c.submitted_at ? new Date(c.submitted_at).toLocaleDateString() : "—"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
