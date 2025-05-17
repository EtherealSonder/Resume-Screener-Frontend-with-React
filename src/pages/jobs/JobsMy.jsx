import { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import ModalOverlay from "../../components/ModalOverlay";
import ToastPortal from "../../components/ToastPortal";
import LoadingSpinner from "../../components/candidates/LoadingSpinner";
import { FaArrowDown, FaArrowUp, FaFileAlt } from "react-icons/fa";

export default function JobsMy({ selectedJob, setSelectedJob }) {
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [sortKey, setSortKey] = useState("alphabet");
    const [sortOrder, setSortOrder] = useState("asc");
    const [toast, setToast] = useState(null);
    const [toastTimerWidth, setToastTimerWidth] = useState("100%");

    const fetchJobsAndResumes = async () => {
        if (!user?.id) return;
        setLoading(true);
        try {
            const [jobRes, resumeRes] = await Promise.all([
                api.get(`/jobs?client_id=${user.id}`),
                api.get(`/resumes?client_id=${user.id}`)
            ]);
            const jobList = jobRes.data.map(job => {
                const title = job.title || job.job_title || "Untitled";
                const applicantCount = resumeRes.data.filter(r => r.job_id === job.id).length;
                return { ...job, title, applicantCount };
            });
            setJobs(jobList);
            setResumes(resumeRes.data);
        } catch (err) {
            console.error("Error fetching jobs or resumes", err);
            setJobs([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchJobsAndResumes(); }, [user]);

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

    const sortedJobs = [...jobs]
        .filter(j => j.title.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => {
            const factor = sortOrder === "asc" ? 1 : -1;
            if (sortKey === "alphabet") return factor * a.title.localeCompare(b.title);
            if (sortKey === "created") return factor * (new Date(a.created_at) - new Date(b.created_at));
            if (sortKey === "applicants") return factor * (a.applicantCount - b.applicantCount);
            return 0;
        });

    const toggleSortOrder = () => setSortOrder(prev => prev === "asc" ? "desc" : "asc");

    if (loading) return <LoadingSpinner />;

    return (
        <div className="bg-blue-50 p-6 rounded-2xl shadow-inner text-black animate-fadeIn">
            <div className="rounded-2xl bg-white/30 border border-white/10 shadow-xl backdrop-blur-md p-6 transition-all duration-300">
                <h1 className="text-3xl font-bold mb-4">Jobs</h1>

                {/* Search */}
                <input
                    type="text"
                    placeholder="Search by job title"
                    className="mb-4 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                {/* Sort Controls */}
                <div className="flex flex-wrap gap-4 mb-6 items-center">
                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">Sort by</label>
                        <select
                            value={sortKey}
                            onChange={(e) => setSortKey(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm"
                        >
                            <option value="alphabet">Title</option>
                            <option value="created">Created Date</option>
                            <option value="applicants">Applicant Count</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1 opacity-0">Order</label>
                        <button
                            onClick={toggleSortOrder}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm"
                        >
                            {sortOrder === "asc" ? <FaArrowUp /> : <FaArrowDown />}
                            {sortOrder === "asc" ? "Asc" : "Desc"}
                        </button>
                    </div>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedJobs.map((job) => (
                        <div
                            key={job.id}
                            onClick={() => setSelectedJob(job)}
                            className="bg-white text-black hover:bg-blue-50 border border-gray-200 hover:border-blue-300 transition p-5 rounded-2xl shadow-sm hover:shadow-md cursor-pointer flex flex-col gap-2"
                        >
                            <div className="flex items-center gap-3">
                                <FaFileAlt className="text-xl text-blue-500" />
                                <div>
                                    <h3 className="font-semibold text-lg text-gray-800">{job.title}</h3>
                                    <p className="text-xs text-gray-500">
                                        {job.created_at && `Created on ${new Date(job.created_at).toLocaleDateString()}`}
                                    </p>
                                </div>
                            </div>
                            <span className={`inline-block mt-2 ${job.applicantCount === 0 ? "bg-gray-100 text-gray-600" : "bg-green-100 text-green-700"
                                } text-xs px-3 py-1 rounded-full font-medium`}>
                                {job.applicantCount} Applicants
                            </span>
                        </div>
                    ))}
                </div>

                {/* Detail Modal */}
                {selectedJob && (
                    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                        <ModalOverlay
                            job={selectedJob}
                            onClose={() => setSelectedJob(null)}
                            refreshJobs={fetchJobsAndResumes}
                        />
                    </div>
                )}

                {/* Toast */}
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
        </div>
    );
}
