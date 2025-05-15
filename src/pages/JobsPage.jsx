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
                    setJobs([]); // fallback to empty array
                }
            })
            .finally(() => setLoading(false));
    }, [user.id]);


    if (loading) return <p className="text-white">Loading jobs...</p>;

    return (
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl text-white animate-fadeIn">
            <h1 className="text-3xl font-bold mb-4">Jobs</h1>
            <ul className="space-y-3">
                {jobs.map((job, i) => (
                    <li key={i} className="bg-white/20 text-white p-4 rounded-xl border border-white/10">
                        <p><strong>Title:</strong> {job.title}</p>
                        <p><strong>Description:</strong> {job.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
