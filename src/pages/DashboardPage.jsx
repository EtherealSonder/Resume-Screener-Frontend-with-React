import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import LineChartCard from "../components/charts/LineChartCard";

export default function DashboardPage() {
    const { user } = useAuth();
    const [trendData, setTrendData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://localhost:5000/statistics?client_id=${user.id}`)
            .then(res => res.json())
            .then(data => {
                if (data.applicationTrends) {
                    setTrendData(data.applicationTrends);
                }
            })
            .finally(() => setLoading(false));
    }, [user.id]);

    if (loading) return <p className="text-white">Loading dashboard...</p>;

    return (
        <div className="p-8 rounded-2xl shadow-xl backdrop-blur-md bg-white/50 text-black animate-fadeIn">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

            <div className="grid md:grid-cols-2 gap-6">
                <LineChartCard
                    title="Daily/Weekly Application Volume"
                    data={trendData}
                    xKey="date"
                    yKey="count"
                />
                <LineChartCard
                    title="Avg. Time Since Application"
                    data={trendData.map(d => ({
                        ...d,
                        daysAgo: Math.round((new Date() - new Date(d.date)) / (1000 * 60 * 60 * 24))
                    }))}
                    xKey="date"
                    yKey="daysAgo"
                />
            </div>
        </div>
    );
}
