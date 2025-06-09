import { useEffect, useState } from "react";
import LoadingSpinner from "../Candidates/LoadingSpinner";

export default function BottomCandidatesTable({ clientId, onSelectCandidate }) {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortField, setSortField] = useState("cover_letter_score");
    const [sortOrder, setSortOrder] = useState("asc");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/analytics/cover_letter_quality?client_id=${clientId}`);
                const data = await res.json();
                const filtered = data.bottom_candidates.filter(
                    c => c.cover_letter_score && c.cover_letter_score > 0
                );
                setCandidates(filtered);
            } catch (error) {
                console.error("Error fetching candidates:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [clientId]);

    const handleSort = (field) => {
        if (field === sortField) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortOrder("asc");
        }
    };

    const sortedCandidates = [...candidates].sort((a, b) => {
        const valA = a[sortField] || 0;
        const valB = b[sortField] || 0;
        return sortOrder === "asc" ? valA - valB : valB - valA;
    });

    const downloadCSV = () => {
        const csvContent = [
            ["Name", "Email", "Job Title", "Cover Letter Score", "Resume Quality Score", "Submitted At"],
            ...sortedCandidates.map((c) => [
                c.name, c.email, c.job_title, c.cover_letter_score, c.resume_quality_score, c.submitted_at
            ])
        ].map(e => e.join(",")).join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "bottom_candidates.csv";
        link.click();
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (sortedCandidates.length === 0) {
        return (
            <div className="text-center text-gray-500 py-6">
                No candidates with cover letters.
            </div>
        );
    }

    return (
        <div className="flex flex-col">
            <div className="mb-4">
                <button
                    onClick={downloadCSV}
                    className="inline-block px-4 py-2 bg-blue-600 text-white text-sm rounded shadow hover:bg-blue-700"
                >
                    Export CSV
                </button>
            </div>

            <table className="min-w-full text-sm border border-gray-200 rounded shadow overflow-hidden">
                <thead className="bg-gray-100 text-gray-700 font-semibold">
                    <tr>
                        <th className="p-2">No.</th>
                        <th className="p-2">Name</th>
                        <th className="p-2">Email</th>
                        <th className="p-2">Job Title</th>
                        <th
                            className="p-2 cursor-pointer hover:underline"
                            onClick={() => handleSort("cover_letter_score")}
                        >
                            Cover Letter Quality
                        </th>
                        <th
                            className="p-2 cursor-pointer hover:underline"
                            onClick={() => handleSort("resume_quality_score")}
                        >
                            Resume Quality
                        </th>
                        <th className="p-2">Submitted On</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedCandidates.map((c, idx) => (
                        <tr key={c.id || idx} className="border-b hover:bg-gray-50">
                            <td className="p-2">{idx + 1}</td>
                            <td
                                className="p-2 text-blue-600 cursor-pointer underline"
                                onClick={() => onSelectCandidate && onSelectCandidate(c)}
                            >
                                {c.name}
                            </td>
                            <td className="p-2">{c.email}</td>
                            <td className="p-2">{c.job_title}</td>
                            <td className="p-2">
                                <span
                                    className={`inline-block px-2 py-1 rounded ${c.cover_letter_score < 40
                                            ? "bg-red-200"
                                            : c.cover_letter_score < 70
                                                ? "bg-yellow-200"
                                                : "bg-green-200"
                                        }`}
                                >
                                    {c.cover_letter_score}
                                </span>
                            </td>
                            <td className="p-2">
                                <span
                                    className={`inline-block px-2 py-1 rounded ${c.resume_quality_score < 40
                                            ? "bg-red-200"
                                            : c.resume_quality_score < 70
                                                ? "bg-yellow-200"
                                                : "bg-green-200"
                                        }`}
                                >
                                    {c.resume_quality_score}
                                </span>
                            </td>
                            <td className="p-2">{new Date(c.submitted_at).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
