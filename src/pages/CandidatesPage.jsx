import { useLoaderData } from "react-router-dom";

export default function CandidatesPage() {
    const candidates = useLoaderData();

    return (
        <div className="p-6 font-sans animate-fadeIn transition-opacity duration-500">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Candidates</h1>
            <ul className="space-y-4">
                {candidates.map((c, i) => (
                    <li
                        key={i}
                        className="bg-white p-4 shadow rounded-lg border border-gray-100"
                    >
                        <p><strong>Name:</strong> {c.name}</p>
                        <p><strong>Email:</strong> {c.email}</p>
                        <p><strong>Score:</strong> {c.score}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
