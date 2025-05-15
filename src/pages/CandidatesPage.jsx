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
                    setCandidates([]); // fallback to empty array
                }
            })
            .finally(() => setLoading(false));
    }, [user.id]);


    if (loading) return <p className="text-white">Loading candidates...</p>;

    return (
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl text-white animate-fadeIn">
            <h1 className="text-3xl font-bold mb-6">Candidates</h1>
            <ul className="space-y-4">
                {candidates.map((c, i) => (
                    <li key={i} className="bg-white/20 p-4 rounded-xl shadow border border-white/20">
                        <p><strong>Name:</strong> {c.name}</p>
                        <p><strong>Email:</strong> {c.email}</p>
                        <p><strong>Score:</strong> {c.score}</p>
                        <p><strong>Job:</strong> {c.job_title}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
