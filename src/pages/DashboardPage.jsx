import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function DashboardPage() {
    const { user } = useAuth();
    const [data, setData] = useState({ totalCandidates: 0, averageScore: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://localhost:5000/dashboard?client_id=${user.id}`)
            .then(res => res.json())
            .then(setData)
            .finally(() => setLoading(false));
    }, [user.id]);

    if (loading) return <p className="text-white">Loading dashboard...</p>;

    return (
        <div className="p-8 rounded-2xl shadow-xl backdrop-blur-md bg-white/50 text-black animate-fadeIn">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            <div className="space-y-3 text-lg">
                <p>Total Candidates: <span className="font-semibold">{data.totalCandidates}</span></p>
            </div>
        </div>
    );
}
