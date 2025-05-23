// src/components/candidates/CandidateCard.jsx
import { FaUserCircle } from "react-icons/fa";

export default function CandidateCard({ candidate, onClick }) {
    return (
        <div
            className="bg-graylupa-surface hover:bg-gray-100 border border-graylupa-border transition p-5 rounded-2xl shadow-sm hover:shadow-md cursor-pointer flex flex-col gap-2"

            onClick={onClick}
        >
            <div className="flex items-center gap-3">
                <FaUserCircle className="text-3xl text-gray-500" />
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">{candidate.name}</h2>
                    <p className="text-sm text-gray-500">{candidate.email}</p>
                </div>
            </div>

            <div className="flex justify-between items-center mt-2">
                <span className="inline-block bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">
                    Score: {candidate.score}
                </span>
                <span className="text-xs text-gray-400">{candidate.job_title}</span>
            </div>
        </div>
    );
}
