import { useState, useEffect } from "react";

export default function FilterPanel({ jobTitles = [], onFilterChange }) {
    const [filters, setFilters] = useState({
        jobTitle: "",
        minScore: 0,
        maxScore: 100,
        minExp: 0,
        maxExp: 20,
        fromDate: "",
        toDate: ""
    });

    useEffect(() => {
        onFilterChange(filters);
    }, [filters]);

    const update = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="bg-white/20 p-4 rounded-xl shadow flex flex-wrap gap-4 mb-6 text-white">
            <div>
                <label className="block text-sm">Job Title</label>
                <select
                    value={filters.jobTitle}
                    onChange={e => update("jobTitle", e.target.value)}
                    className="text-black rounded px-2 py-1"
                >
                    <option value="">All</option>
                    {jobTitles.map((job, idx) => (
                        <option key={idx} value={job}>{job}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm">Score Range</label>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={filters.maxScore}
                    onChange={e => update("maxScore", parseInt(e.target.value))}
                    className="w-40"
                />
                <div className="text-xs">0 – {filters.maxScore}</div>
            </div>

            <div>
                <label className="block text-sm">Experience (Years)</label>
                <input
                    type="range"
                    min="0"
                    max="20"
                    value={filters.maxExp}
                    onChange={e => update("maxExp", parseInt(e.target.value))}
                    className="w-40"
                />
                <div className="text-xs">0 – {filters.maxExp}</div>
            </div>

            <div>
                <label className="block text-sm">From Date</label>
                <input
                    type="date"
                    value={filters.fromDate}
                    onChange={e => update("fromDate", e.target.value)}
                    className="text-black px-2 py-1 rounded"
                />
            </div>

            <div>
                <label className="block text-sm">To Date</label>
                <input
                    type="date"
                    value={filters.toDate}
                    onChange={e => update("toDate", e.target.value)}
                    className="text-black px-2 py-1 rounded"
                />
            </div>
        </div>
    );
}
