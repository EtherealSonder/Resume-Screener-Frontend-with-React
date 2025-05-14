import { useLoaderData } from "react-router-dom";

export default function DashboardPage() {
    const data = useLoaderData(); // { totalCandidates, averageScore }

    return (
        <div className="text-center mt-10 text-xl font-sans animate-fadeIn transition-opacity duration-500">
            <h1 className="text-3xl font-bold mb-4 text-gray-800">Dashboard</h1>
            <div className="space-y-2">
                <p>Total Candidates: <span className="font-medium">{data.totalCandidates}</span></p>
                <p>Average Score: <span className="font-medium">{data.averageScore}</span></p>
            </div>
        </div>
    );
}
