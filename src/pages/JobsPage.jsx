import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { FaBriefcase, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function JobsPage() {
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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

    const handleNavigate = (path) => navigate(path);

    return (
        <div className="bg-graylupa-bg p-6 text-graylupa-text animate-fadeIn min-h-[80vh]">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                    <FaBriefcase className="text-graylupa-accent" />
                    Job Management
                </h1>
                <p className="text-graylupa-muted text-sm">
                    View and manage your job postings, or create a new one.
                </p>
            </div>

            <div className="flex flex-wrap gap-6">
                {/* My Jobs Card */}
                <button
                    onClick={() => handleNavigate("/dashboard/jobs/my")}
                    className="flex flex-col justify-center items-center w-60 h-48 bg-graylupa-surface rounded-2xl border border-graylupa-border hover:shadow-md hover:bg-gray-100 transition-all"
                >
                    <div className="bg-gray-700 text-white rounded-full p-4 mb-3">
                        <FaBriefcase className="w-6 h-6" />
                    </div>
                    <p className="text-lg font-semibold text-graylupa-text">My Jobs</p>
                </button>

                {/* Create Job Card */}
                <button
                    onClick={() => handleNavigate("/dashboard/jobs/create")}
                    className="flex flex-col justify-center items-center w-60 h-48 bg-graylupa-surface rounded-2xl border border-graylupa-border hover:shadow-md hover:bg-gray-100 transition-all"
                >
                    <div className="bg-gray-700 text-white rounded-full p-4 mb-3">
                        <FaPlus className="w-6 h-6" />
                    </div>
                    <p className="text-lg font-semibold text-graylupa-text">Create Job</p>
                </button>
            </div>

            {/* Optional: Job List Preview */}
            {jobs.length > 0 && (
                <div className="mt-10">
                    <h2 className="text-xl font-semibold mb-4">Recent Jobs</h2>
                    <ul className="space-y-3">
                        {jobs.map((job, i) => (
                            <li key={i} className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                                <p className="text-lg font-bold">{job.title}</p>
                                <p className="text-gray-600">{job.description || "No description provided"}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
