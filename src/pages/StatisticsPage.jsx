import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function StatisticsPage() {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://localhost:5000/dashboard?client_id=${user.id}`)
            .then(res => res.json())
            .then(setStats)
            .finally(() => setLoading(false));
    }, [user.id]);

    if (loading) return <p className="text-white">Loading statistics...</p>;

    return (
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl text-white animate-fadeIn">
            <h1 className="text-3xl font-bold mb-4">Statistics</h1>
            <pre className="text-white/80">{JSON.stringify(stats, null, 2)}</pre>
        </div>
    );
}
