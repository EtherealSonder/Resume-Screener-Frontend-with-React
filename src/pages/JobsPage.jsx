import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function JobsPage() {
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://localhost:5000/jobs?client_id=${user.id}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setJobs(data);
                } else {
                    console.error("Expected array, got:", data);
                    setJobs([]);
                }
            })
            .finally(() => setLoading(false));
    }, [user.id]);

    if (loading) return <p className="text-black">Loading jobs...</p>;

    return (
        <div className="bg-blue-50 p-6 rounded-2xl shadow-inner text-black animate-fadeIn">
            <div className="bg-white p-6 rounded-xl shadow">
                <h1 className="text-3xl font-bold mb-4">Jobs</h1>
                {jobs.length === 0 ? (
                    <p className="text-gray-600">No jobs available.</p>
                ) : (
                    <ul className="space-y-3">
                        {jobs.map((job, i) => (
                            <li key={i} className="bg-gray-100 text-black p-4 rounded-xl border border-gray-300">
                                <p><strong>Title:</strong> {job.title}</p>
                                <p><strong>Description:</strong> {job.description || "N/A"}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
