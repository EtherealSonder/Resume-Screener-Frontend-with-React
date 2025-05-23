import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import CreateSuccessModal from "../../components/CreateSuccessModal";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

export default function JobsCreate() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [createdJobId, setCreatedJobId] = useState(null);
    const [existingJobs, setExistingJobs] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);

    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.id) {
            api
                .get(`/jobs?client_id=${user.id}`)
                .then((res) => setExistingJobs(res.data || []))
                .catch((err) => console.error("Failed to fetch jobs", err));
        }
    }, [user]);

    const handleSubmit = async () => {
        if (!title || !description) return;

        const titleExists = existingJobs.some(
            (job) =>
                job.title.trim().toLowerCase() === title.trim().toLowerCase()
        );

        if (titleExists) {
            setErrorMessage(`"${title}" already exists.`);
            return;
        }

        setLoading(true);
        try {
            const res = await api.post("/jobs/create", {
                title,
                description,
                client_id: user.id,
            });
            setCreatedJobId(res.data.job_id);
            setShowSuccessModal(true);
            setErrorMessage(null);
        } catch (err) {
            alert("Failed to create job.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setShowSuccessModal(false);
        setTitle("");
        setDescription("");
        setErrorMessage(null);
    };

    return (
        <div className="min-h-screen bg-graylupa-bg px-6 py-12 text-graylupa-text animate-fadeIn">
            <div className="max-w-2xl mx-auto bg-graylupa-surface border border-graylupa-border rounded-2xl shadow-xl p-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-3xl font-bold">Create New Job</h1>
                    <button
                        onClick={() => navigate("/dashboard/jobs")}
                        className="text-sm px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 flex items-center gap-2"
                    >
                        <FaArrowLeft />
                        Back
                    </button>
                </div>
                <p className="text-graylupa-muted mb-6">
                    Add a new job posting with a clear title and description.
                </p>

                {/* Form */}
                <input
                    className="w-full px-4 py-2 mb-4 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                    placeholder="Job Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                    className="w-full px-4 py-3 mb-4 border border-gray-300 rounded shadow-sm h-40 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    placeholder="Job Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                {/* Actions */}
                {loading ? (
                    <div className="flex justify-center my-4">
                        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        <button
                            onClick={handleSubmit}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md shadow-sm transition"
                        >
                            Create
                        </button>

                        {errorMessage && (
                            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded text-sm">
                                {errorMessage}{" "}
                                <button
                                    onClick={() => navigate("/dashboard/jobs/my")}
                                    className="underline text-blue-600 hover:text-blue-800"
                                >
                                    Go to My Jobs page
                                </button>{" "}
                                to delete or edit the job.
                            </div>
                        )}
                    </div>
                )}
            </div>

            {showSuccessModal && (
                <CreateSuccessModal
                    jobTitle={title}
                    jobId={createdJobId}
                    onReset={handleReset}
                    onClose={() => setShowSuccessModal(false)}
                />
            )}
        </div>
    );
}
