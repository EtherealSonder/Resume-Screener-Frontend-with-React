import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import CreateSuccessModal from "../../components/CreateSuccessModal";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

export default function JobsCreate() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [jobType, setJobType] = useState("");
    const [experienceLevel, setExperienceLevel] = useState("");
    const [jobLocationCountry, setJobLocationCountry] = useState("");
    const [jobLocationCity, setJobLocationCity] = useState("");
    const [otherCity, setOtherCity] = useState("");
    const [applicationDeadline, setApplicationDeadline] = useState("");
    const [loading, setLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [createdJobId, setCreatedJobId] = useState(null);
    const [existingJobs, setExistingJobs] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);

    const { user } = useAuth();
    const navigate = useNavigate();

    const countryOptions = ["USA", "UK", "India", "Germany"]; // Example countries
    const cityOptions = {
        USA: ["New York", "Los Angeles", "Chicago", "Other"],
        UK: ["London", "Manchester", "Birmingham", "Other"],
        India: ["Mumbai", "Bangalore", "Delhi", "Other"],
        Germany: ["Berlin", "Munich", "Hamburg", "Other"],
    };
    const jobTypes = ["Full-time", "Part-time", "Contract", "Temporary", "Internship"];
    const experienceLevels = [
        "Entry-Level / Intern / Trainee",
        "Junior / Associate",
        "Mid-Level / Intermediate / Specialist",
        "Senior / Lead",
        "Principal / Expert / Consultant",
    ];

    useEffect(() => {
        if (user?.id) {
            api
                .get(`/jobs?client_id=${user.id}`)
                .then((res) => setExistingJobs(res.data || []))
                .catch((err) => console.error("Failed to fetch jobs", err));
        }
    }, [user]);

    const handleSubmit = async () => {
        setErrorMessage(null);

        if (!title.trim()) {
            setErrorMessage("Job title cannot be empty.");
            return;
        }
        if (!jobLocationCountry || !jobLocationCity || (jobLocationCity === "Other" && !otherCity.trim())) {
            setErrorMessage("Location cannot be empty.");
            return;
        }
        if (!description.trim()) {
            setErrorMessage("Job description cannot be empty.");
            return;
        }
        if (!applicationDeadline) {
            setErrorMessage("Application deadline cannot be empty.");
            return;
        }

        const titleExists = existingJobs.some(
            (job) => job.title.trim().toLowerCase() === title.trim().toLowerCase()
        );
        if (titleExists) {
            setErrorMessage(`"${title}" already exists.`);
            return;
        }

        const finalCity = jobLocationCity === "Other" ? otherCity : jobLocationCity;

        setLoading(true);
        try {
            const res = await api.post("/jobs/create", {
                title,
                description,
                client_id: user.id,
                job_type: jobType || "",
                experience_level: experienceLevel || "No expectation on experience",
                job_location_country: jobLocationCountry,
                job_location_city: finalCity,
                application_deadline: applicationDeadline,
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
        setJobType("");
        setExperienceLevel("");
        setJobLocationCountry("");
        setJobLocationCity("");
        setOtherCity("");
        setApplicationDeadline("");
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
                    Add a new job posting with a clear title, description, and expected details.
                </p>

                {/* Form */}
                <input
                    className="w-full px-4 py-2 mb-4 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                    placeholder="Job Title *"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Job Location *</label>
                    <select
                        value={jobLocationCountry}
                        onChange={(e) => {
                            setJobLocationCountry(e.target.value);
                            setJobLocationCity("");
                            setOtherCity("");
                        }}
                        className="w-full px-4 py-2 mb-2 border border-gray-300 rounded shadow-sm"
                    >
                        <option value="">Select a country</option>
                        {countryOptions.map((c) => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                    {jobLocationCountry && (
                        <select
                            value={jobLocationCity}
                            onChange={(e) => setJobLocationCity(e.target.value)}
                            className="w-full px-4 py-2 mb-2 border border-gray-300 rounded shadow-sm"
                        >
                            <option value="">Select a city</option>
                            {cityOptions[jobLocationCountry]?.map((city) => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                    )}
                    {jobLocationCity === "Other" && (
                        <input
                            type="text"
                            placeholder="Enter other city"
                            value={otherCity}
                            onChange={(e) => setOtherCity(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded shadow-sm"
                        />
                    )}
                </div>

                <select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                    className="w-full px-4 py-2 mb-4 border border-gray-300 rounded shadow-sm"
                >
                    <option value="">Select Job Type (optional)</option>
                    {jobTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>

                <select
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    className="w-full px-4 py-2 mb-4 border border-gray-300 rounded shadow-sm"
                >
                    <option value="">Select Experience Level (optional)</option>
                    {experienceLevels.map((level) => (
                        <option key={level} value={level}>{level}</option>
                    ))}
                </select>

                <label className="block text-sm font-medium mb-1">Job Description *</label>
                <textarea
                    className="w-full px-4 py-3 mb-4 border border-gray-300 rounded shadow-sm h-40 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    placeholder="Paste the full job description, responsibilities, requirements, and any nice-to-have skills here."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <label className="block text-sm font-medium mb-1">Application Deadline *</label>
                <input
                    type="date"
                    value={applicationDeadline}
                    onChange={(e) => setApplicationDeadline(e.target.value)}
                    className="w-full px-4 py-2 mb-4 border border-gray-300 rounded shadow-sm"
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
                                {errorMessage}
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
