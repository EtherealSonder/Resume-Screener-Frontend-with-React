import { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import ModalOverlay from "../../components/ModalOverlay";
import ToastPortal from "../../components/ToastPortal";

export default function JobsMy({ selectedJob, setSelectedJob }) {
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);
    const [toastTimerWidth, setToastTimerWidth] = useState("100%");

    const fetchJobs = () => {
        if (user?.id) {
            setLoading(true);
            api
                .get(`/jobs?client_id=${user.id}`)
                .then((res) => setJobs(Array.isArray(res.data) ? res.data : []))
                .catch((err) => {
                    console.error("Failed to fetch jobs:", err);
                    setJobs([]);
                })
                .finally(() => setLoading(false));
        }
    };

    useEffect(() => {
        fetchJobs();
    }, [user]);

    useEffect(() => {
        const toastData = localStorage.getItem("job_toast");
        if (toastData) {
            const { message, color, time } = JSON.parse(toastData);
            const age = Date.now() - time;
            if (age < 5000) {
                setToast({ message, color });
                setToastTimerWidth("100%");
                setTimeout(() => setToastTimerWidth("0%"), 10);
                setTimeout(() => setToast(null), 5000);
            }
            localStorage.removeItem("job_toast");
        }
    }, [jobs]);

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

            <div className="bg-white/80 border border-gray-300 rounded-xl p-4 mb-6 text-sm font-medium text-gray-800 shadow">
                Here are your jobs. Click to view, edit, or delete them. Each job card includes an application form URL you can use on your job portals.
            </div>

            {loading ? (
                <div className="text-gray-600 text-center text-lg">Loading jobs...</div>
            ) : jobs.length === 0 ? (
                <div className="text-center text-gray-600 text-lg mt-10">
                    There are no jobs. {" "}
                    <a
                        href="/dashboard/jobs/create"
                        className="text-blue-600 underline hover:text-blue-800"
                    >
                        Create Job
                    </a>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {jobs.map((job) => (
                        <div
                            key={job.id}
                            onClick={() => setSelectedJob(job)}
                            className="bg-white text-black hover:bg-blue-100 hover:scale-105 transform transition-all duration-300 cursor-pointer p-6 rounded-3xl shadow-md"
                        >
                            <h3 className="font-bold text-lg">{job.title}</h3>
                        </div>
                    ))}
                </div>
            )}

            {selectedJob && (
                <ModalOverlay
                    job={selectedJob}
                    onClose={() => setSelectedJob(null)}
                    refreshJobs={fetchJobs}
                />
            )}

            {toast && (
                <ToastPortal>
                    <div
                        className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 w-[90%] max-w-md px-6 py-3 text-white rounded-xl shadow-xl z-[2000] ${toast.color === "green" ? "bg-green-600" : "bg-red-600"}`}
                    >
                        <span>{toast.message}</span>
                        <div className="h-1 bg-white mt-2 rounded-full overflow-hidden">
                            <div
                                className="h-1 bg-white transition-all duration-[5000ms]"
                                style={{ width: toastTimerWidth }}
                            ></div>
                        </div>
                    </div>
                </ToastPortal>
            )}
        </div>
    );
}
