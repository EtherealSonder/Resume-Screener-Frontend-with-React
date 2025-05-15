import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import CreateSuccessModal from "../../components/CreateSuccessModal";
import { useNavigate } from "react-router-dom";

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

    // Fetch all existing jobs for this user
    useEffect(() => {
        if (user?.id) {
            api.get(`/jobs?client_id=${user.id}`)
                .then((res) => setExistingJobs(res.data || []))
                .catch((err) => console.error("Failed to fetch jobs", err));
        }
    }, [user]);

    const handleSubmit = async () => {
        if (!title || !description) return;

        // Check for duplicate title
        const titleExists = existingJobs.some(
            (job) => job.title.trim().toLowerCase() === title.trim().toLowerCase()
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
            setErrorMessage(null); // Clear any previous error
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
        <div className="min-h-screen bg-white/10 backdrop-blur-md p-10 text-black relative flex items-center justify-center">
            <div className="max-w-xl w-full animate-fadeIn">
                {/* Header with back button */}
                <div className="flex items-center gap-3 mb-6">
                    <button
                        onClick={() => navigate("/dashboard/jobs")}
                        className="text-black hover:text-blue-600 text-2xl font-medium"
                    >
                        ←
                    </button>
                    <h2 className="text-2xl font-bold">Create New Job</h2>
                </div>

                {/* Form */}
                <input
                    className="w-full px-4 py-2 mb-4 border rounded text-black"
                    placeholder="Job Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                    className="w-full px-4 py-4 mb-4 border rounded h-64 text-black"
                    placeholder="Job Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                {loading ? (
                    <div className="flex justify-center my-4">
                        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        <button
                            onClick={handleSubmit}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
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
