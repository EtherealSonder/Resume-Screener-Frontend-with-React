import { useState, useEffect, useRef } from "react";
import ExportButtons from "../ExportButtons";
import LoadingSpinner from "../candidates/LoadingSpinner";
import CandidateDetail from "../candidates/CandidateDetail";

function getScoreColor(score) {
    if (score >= 70) return "bg-green-200 text-green-800";
    if (score >= 40) return "bg-yellow-200 text-yellow-800";
    return "bg-red-200 text-red-800";
}

export default function TopCandidatesTable({
    candidates,
    selectedJobs,
    onChangeJobs
}) {
    const [sortField, setSortField] = useState("score");
    const [sortOrder, setSortOrder] = useState("desc");
    const [topN, setTopN] = useState(5);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const tableRef = useRef();

    const jobTitles = Array.from(new Set(candidates.map((c) => c.job_title)));

    // Default to "All Jobs"
    useEffect(() => {
        if (selectedJobs.length === 0 && jobTitles.length > 0) {
            onChangeJobs(["All Jobs"]);
        }
    }, [jobTitles, selectedJobs, onChangeJobs]);

    useEffect(() => {
        setLoading(true);
        let data = [...candidates];

        if (selectedJobs[0] !== "All Jobs") {
            data = data.filter(c => c.job_title === selectedJobs[0]);
        }

        data.sort((a, b) => {
            const valA = a[sortField] ?? 0;
            const valB = b[sortField] ?? 0;
            return sortOrder === "asc" ? valA - valB : valB - valA;
        });

        setFiltered(data.slice(0, topN));
        setLoading(false);

        console.log("Filtered Top Candidates:", data.slice(0, topN));
    }, [sortField, sortOrder, topN, selectedJobs, candidates]);

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
            <h2 className="text-xl font-semibold text-gray-800">Top Candidates Table</h2>
            <p className="text-sm text-gray-600">Displays top performing candidates across job roles.</p>

            {/* Single-Select Filter */}
            <div className="flex flex-wrap justify-between items-center gap-4">
                <div className="flex flex-col space-y-1 w-64">
                    <label className="text-sm font-medium text-gray-700">Filter by Job:</label>
                    <select
                        value={selectedJobs[0] || "All Jobs"}
                        onChange={(e) => onChangeJobs([e.target.value])}
                        className="border rounded px-3 py-2 text-sm"
                    >
                        <option value="All Jobs">All Jobs</option>
                        {jobTitles.map((title, idx) => (
                            <option key={idx} value={title}>{title}</option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-2">
                    <label className="text-sm">Show Top N:</label>
                    <input
                        type="number"
                        min="1"
                        value={topN}
                        onChange={(e) => setTopN(parseInt(e.target.value))}
                        className="w-20 px-2 py-1 border rounded text-sm"
                    />
                </div>

                <ExportButtons data={filtered} fileName="TopCandidates" targetRef={tableRef} exportCSVOnly />
            </div>

            {/* Table */}
            {loading ? (
                <LoadingSpinner />
            ) : filtered.length === 0 ? (
                <p className="italic text-gray-500">No top candidates found for the selected job.</p>
            ) : (
                <div ref={tableRef} className="overflow-auto max-h-[500px] rounded border border-gray-300">
                    <table className="w-full text-sm table-auto border-collapse">
                        <thead className="bg-gray-100 sticky top-0 z-10">
                            <tr className="text-left text-black">
                                <th className="px-3 py-2">#</th>
                                <th className="px-3 py-2">Name</th>
                                <th className="px-3 py-2">Job Title</th>
                                <th
                                    className="px-3 py-2 cursor-pointer hover:underline"
                                    onClick={() => handleSort("score")}
                                >
                                    Score {sortField === "score" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                                </th>
                                <th
                                    className="px-3 py-2 cursor-pointer hover:underline"
                                    onClick={() => handleSort("resume_quality_score")}
                                >
                                    Resume Quality {sortField === "resume_quality_score" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                                </th>
                                <th
                                    className="px-3 py-2 cursor-pointer hover:underline"
                                    onClick={() => handleSort("experience")}
                                >
                                    Experience (Years) {sortField === "experience" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                                </th>
                                <th
                                    className="px-3 py-2 cursor-pointer hover:underline"
                                    onClick={() => handleSort("skill_match")}
                                >
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
                                            onClick={() => setSelectedCandidate(c)}
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
            )}

            {/* Candidate Detail Modal */}
            {selectedCandidate && (
                <CandidateDetail candidate={selectedCandidate} onClose={() => setSelectedCandidate(null)} />
            )}
        </div>
    );
}
