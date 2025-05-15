import { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function JobsMy({ selectedJob, setSelectedJob }) {
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.id) {
            api.get(`/jobs?client_id=${user.id}`)
                .then((res) => setJobs(Array.isArray(res.data) ? res.data : []))
                .catch((err) => {
                    console.error("Failed to fetch jobs:", err);
                    setJobs([]);
                })
                .finally(() => setLoading(false));
        }
    }, [user]);

    return (
        <div className="animate-fadeIn relative z-10">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => window.history.back()}
                        className="text-black hover:text-blue-600 text-2xl font-medium"
                    >
                        ←
                    </button>
                    <h2 className="text-2xl font-semibold text-black">Your Jobs</h2>
                </div>
            </div>

            {loading ? (
                <div className="text-gray-600 text-center text-lg">Loading jobs...</div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {jobs.map((job) => (
                        <div
                            key={job.id}
                            onClick={() => {
                                console.log("Clicked job:", job);
                                setSelectedJob(job);
                            }}
                            className="bg-white text-black hover:bg-blue-100 hover:scale-105 transform transition-all duration-300 cursor-pointer p-6 rounded-3xl shadow-md"
                        >
                            <h3 className="font-bold text-lg">{job.title}</h3>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
