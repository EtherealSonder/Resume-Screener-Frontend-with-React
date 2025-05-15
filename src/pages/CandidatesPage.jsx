import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function CandidatesPage() {
    const { user } = useAuth();
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://localhost:5000/candidates?client_id=${user.id}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setCandidates(data);
                } else {
                    console.error("Expected array, got:", data);
                    setCandidates([]);
                }
            })
            .finally(() => setLoading(false));
    }, [user.id]);

    if (loading) return <p className="text-black">Loading candidates...</p>;

    return (
        <div className="bg-blue-50 p-6 rounded-2xl shadow-inner text-black animate-fadeIn">
            <div className="bg-white p-6 rounded-xl shadow">
                <h1 className="text-3xl font-bold mb-6">Candidates</h1>
                <ul className="space-y-4">
                    {candidates.map((c, i) => (
                        <li key={i} className="bg-gray-100 text-black p-4 rounded-xl border border-gray-300">
                            <p><strong>Name:</strong> {c.name}</p>
                            <p><strong>Email:</strong> {c.email}</p>
                            <p><strong>Score:</strong> {c.score}</p>
                            <p><strong>Job:</strong> {c.job_title}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
