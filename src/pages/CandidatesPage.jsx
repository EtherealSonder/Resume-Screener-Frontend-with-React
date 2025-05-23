import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import CandidateCard from "../components/candidates/CandidateCard";
import CandidateDetail from "../components/candidates/CandidateDetail";
import LoadingSpinner from "../components/candidates/LoadingSpinner";
import ControlsBar from "../components/candidates/ControlsBar";

export default function CandidatesPage() {
    const { user } = useAuth();
    const [candidates, setCandidates] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [selected, setSelected] = useState(null);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [filterJob, setFilterJob] = useState("");
    const [sortKey, setSortKey] = useState("application_date");
    const [sortOrder, setSortOrder] = useState("desc");

    useEffect(() => {
        fetch(`http://localhost:5000/candidates?client_id=${user.id}`)
            .then((res) => res.json())
            .then((data) => {
                setCandidates(data);
                setFiltered(data);
            })
            .finally(() => setLoading(false));
    }, [user.id]);

    useEffect(() => {
        let list = [...candidates];

        // Apply search
        if (search) {
            list = list.filter((c) =>
                (c.name + c.email).toLowerCase().includes(search.toLowerCase())
            );
        }

        // Apply filter
        if (filterJob) {
            list = list.filter((c) => c.job_title === filterJob);
        }

        // Apply sort
        list.sort((a, b) => {
            const aVal = a[sortKey] || "";
            const bVal = b[sortKey] || "";

            if (sortKey === "score" || sortKey === "application_date") {
                const aComp = sortKey === "application_date" ? new Date(aVal) : parseFloat(aVal);
                const bComp = sortKey === "application_date" ? new Date(bVal) : parseFloat(bVal);
                return sortOrder === "asc" ? aComp - bComp : bComp - aComp;
            } else {
                return sortOrder === "asc"
                    ? aVal.localeCompare(bVal)
                    : bVal.localeCompare(aVal);
            }
        });

        setFiltered(list);
    }, [search, filterJob, sortKey, sortOrder, candidates]);

    const toggleSortOrder = () =>
        setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));

    if (loading) return <LoadingSpinner />;

    return (
        <div className="bg-graylupa-bg p-6 rounded-2xl text-graylupa-text animate-fadeIn">
            <div className="rounded-2xl bg-graylupa-surface border border-graylupa-border shadow p-6 transition-all duration-300">


                <h1 className="text-3xl font-bold mb-4">Candidates</h1>

                {/* Search */}
                <input
                    type="text"
                    placeholder="Search by name or email"
                    className="mb-4 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                {/* Filter + Sort */}
                <ControlsBar
                    filterJob={filterJob}
                    setFilterJob={setFilterJob}
                    sortKey={sortKey}
                    setSortKey={setSortKey}
                    sortOrder={sortOrder}
                    toggleSortOrder={toggleSortOrder}
                    clientId={user.id}
                />

                {/* Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {filtered.map((candidate, index) => (
                        <CandidateCard
                            key={index}
                            candidate={candidate}
                            onClick={() => setSelected(candidate)}
                        />
                    ))}
                </div>

                {/* Expanded View */}
                {selected && (
                    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                        <CandidateDetail candidate={selected} onClose={() => setSelected(null)} />
                    </div>
                )}
            </div>
        </div>
    );
}
