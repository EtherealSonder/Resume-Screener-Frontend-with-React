// src/components/candidates/ControlsBar.jsx
import { useEffect, useState } from "react";

export default function ControlsBar({
    filterJob,
    setFilterJob,
    sortKey,
    setSortKey,
    sortOrder,
    toggleSortOrder,
    clientId,
}) {
    const [jobOptions, setJobOptions] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:5000/jobs?client_id=${clientId}`)
            .then((res) => res.json())
            .then((data) => {
                const titles = data.map((j) => j.title);
                setJobOptions(titles);
            });
    }, [clientId]);

    return (
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            {/* Filter by Job */}
            <div className="w-full lg:w-1/3">
                <label className="text-sm font-semibold block mb-1 text-gray-700">
                    Filter by Job
                </label>
                <select
                    value={filterJob}
                    onChange={(e) => setFilterJob(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded"
                >
                    <option value="">All Jobs</option>
                    {jobOptions.map((job, i) => (
                        <option key={i} value={job}>
                            {job}
                        </option>
                    ))}
                </select>
            </div>

            {/* Sort by */}
            <div className="w-full lg:w-1/2 flex items-end gap-4">
                <div className="flex-1">
                    <label className="text-sm font-semibold block mb-1 text-gray-700">
                        Sort by
                    </label>
                    <select
                        value={sortKey}
                        onChange={(e) => setSortKey(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                    >
                        <option value="application_date">Submission Date</option>
                        <option value="name">Alphabetical (Name)</option>
                        <option value="score">Score</option>
                    </select>
                </div>
                <button
                    onClick={toggleSortOrder}
                    className="mb-1 px-4 py-2 border border-gray-300 rounded bg-white hover:bg-gray-100"
                >
                    {sortOrder === "asc" ? "↑ Asc" : "↓ Desc"}
                </button>
            </div>
        </div>
    );
}
