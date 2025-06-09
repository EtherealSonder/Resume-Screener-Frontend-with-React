import { useState, useEffect } from "react";
import { FaEdit, FaTimes, FaTrash, FaCalendarAlt, FaUsers, FaExternalLinkAlt } from "react-icons/fa";
import { updateJob, deleteJob } from "../services/api";
import ModalPortal from "./ModalPortal";

export default function ModalOverlay({ job, onClose, refreshJobs }) {
    const [isClosing, setIsClosing] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const [title, setTitle] = useState(job.title || "");
    const [description, setDescription] = useState(job.description || "");
    const [jobType, setJobType] = useState(job.job_type || "");
    const [experienceLevel, setExperienceLevel] = useState(job.experience_level || "");
    const [jobLocationCountry, setJobLocationCountry] = useState(job.job_location_country || "");
    const [jobLocationCity, setJobLocationCity] = useState(job.job_location_city || "");
    const [applicationDeadline, setApplicationDeadline] = useState(job.application_deadline || "");

    const frontendUrl = import.meta.env.VITE_FRONTEND_URL;

    const countryOptions = ["USA", "UK", "India", "Germany"];
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

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
            setIsClosing(false);
        }, 250);
    };

    const handleUpdate = async () => {
        setIsLoading(true);
        try {
            await updateJob(job.id, {
                title: title.trim(),
                description: description.trim(),
                job_type: jobType,
                experience_level: experienceLevel,
                job_location_country: jobLocationCountry,
                job_location_city: jobLocationCity,
                application_deadline: applicationDeadline,
            });
            refreshJobs();
            setIsEditing(false);
            handleClose();
            localStorage.setItem("job_toast", JSON.stringify({ message: `"${title}" updated successfully`, color: "green", time: Date.now() }));
        } catch (err) {
            console.error("Update failed:", err);
            alert("Update failed. See console.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        setIsLoading(true);
        try {
            await deleteJob(job.id);
            refreshJobs();
            handleClose();
            localStorage.setItem("job_toast", JSON.stringify({ message: "Job deleted", color: "red", time: Date.now() }));
        } catch (err) {
            console.error("Delete failed:", err);
            alert("Delete failed. See console.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") handleClose();
        };
        document.addEventListener("keydown", handleEsc);
        return () => document.removeEventListener("keydown", handleEsc);
    }, []);

    return (
        <ModalPortal>
            <>
                <div
                    className={`fixed inset-0 z-[1000] bg-black/70 backdrop-blur-sm transition-opacity duration-200 ${isClosing ? "opacity-0" : "opacity-100"}`}
                    onClick={!isLoading ? handleClose : null}
                />
                <div className="fixed inset-0 z-[1010] flex items-center justify-center p-4">
                    <div className={`bg-white text-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-y-auto max-h-[90vh] relative ${isClosing ? "animate-fade-out-scale" : "animate-fade-scale"}`}>
                        {/* Top Actions */}
                        <div className="absolute right-4 top-4 flex gap-3">
                            {!isEditing && (
                                <>
                                    <button onClick={() => setIsEditing(true)} className="text-gray-500 hover:text-blue-600" disabled={isLoading}>
                                        <FaEdit />
                                    </button>
                                    <button onClick={() => setShowDeleteConfirm(true)} className="text-gray-500 hover:text-red-600" disabled={isLoading}>
                                        <FaTrash />
                                    </button>
                                </>
                            )}
                            <button onClick={handleClose} className="text-gray-500 hover:text-red-600" disabled={isLoading}>
                                <FaTimes />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            {isEditing ? (
                                <>
                                    <input
                                        className="w-full px-4 py-2 border border-gray-300 rounded shadow-sm"
                                        placeholder="Job Title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        disabled={isLoading}
                                    />
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Job Location</label>
                                        <select
                                            value={jobLocationCountry}
                                            onChange={(e) => {
                                                setJobLocationCountry(e.target.value);
                                                setJobLocationCity("");
                                            }}
                                            className="w-full px-4 py-2 mb-2 border border-gray-300 rounded shadow-sm"
                                            disabled={isLoading}
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
                                                disabled={isLoading}
                                            >
                                                <option value="">Select a city</option>
                                                {cityOptions[jobLocationCountry]?.map((city) => (
                                                    <option key={city} value={city}>{city}</option>
                                                ))}
                                            </select>
                                        )}
                                    </div>
                                    <select
                                        value={jobType}
                                        onChange={(e) => setJobType(e.target.value)}
                                        className="w-full px-4 py-2 mb-2 border border-gray-300 rounded shadow-sm"
                                        disabled={isLoading}
                                    >
                                        <option value="">Select Job Type (optional)</option>
                                        {jobTypes.map((type) => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                    <select
                                        value={experienceLevel}
                                        onChange={(e) => setExperienceLevel(e.target.value)}
                                        className="w-full px-4 py-2 mb-2 border border-gray-300 rounded shadow-sm"
                                        disabled={isLoading}
                                    >
                                        <option value="">Select Experience Level (optional)</option>
                                        {experienceLevels.map((level) => (
                                            <option key={level} value={level}>{level}</option>
                                        ))}
                                    </select>
                                    <textarea
                                        className="w-full px-4 py-3 border border-gray-300 rounded shadow-sm h-32"
                                        placeholder="Job Description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        disabled={isLoading}
                                    />
                                    <input
                                        type="date"
                                        value={applicationDeadline}
                                        onChange={(e) => setApplicationDeadline(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded shadow-sm"
                                        disabled={isLoading}
                                    />
                                </>
                            ) : (
                                <>
                                    <h2 className="text-2xl font-bold">{title}</h2>
                                    <p className="text-sm text-gray-600 mb-2">Location: {jobLocationCountry}, {jobLocationCity}</p>
                                    <p className="text-sm text-gray-600 mb-2">Job Type: {jobType || "N/A"}</p>
                                    <p className="text-sm text-gray-600 mb-2">Experience Level: {experienceLevel || "N/A"}</p>
                                    <p className="text-sm text-gray-600 mb-2">Deadline: {applicationDeadline || "N/A"}</p>
                                    <div>
                                        <h3 className="text-sm font-medium mb-1">Job Description</h3>
                                        <p className="whitespace-pre-wrap text-gray-800">{description}</p>
                                    </div>
                                    <a
                                       href={`/apply/${job.id}`}
                                       target="_blank"
                                       rel="noopener noreferrer"
                                       className="inline-flex items-center gap-2 text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium transition mt-4">
                                       <FaExternalLinkAlt />
                                       View Application Form
                                    </a>
                                </>
                            )}
                            {isEditing && (
                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={() => {
                                            setIsEditing(false);
                                            setTitle(job.title);
                                            setDescription(job.description);
                                            setJobType(job.job_type);
                                            setExperienceLevel(job.experience_level);
                                            setJobLocationCountry(job.job_location_country);
                                            setJobLocationCity(job.job_location_city);
                                            setApplicationDeadline(job.application_deadline);
                                        }}
                                        className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                                        disabled={isLoading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleUpdate}
                                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                        disabled={isLoading}
                                    >
                                        Confirm
                                    </button>
                                </div>
                            )}
                        </div>
                        {showDeleteConfirm && (
                            <div className="fixed inset-0 z-[1020] flex items-center justify-center bg-black/70">
                                <div className="bg-white text-black p-6 rounded-xl shadow-xl space-y-4 w-[90%] max-w-md">
                                    <h3 className="text-lg font-bold">Are you sure you want to delete "{title || "this job"}"?</h3>
                                    {isLoading ? (
                                        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                                    ) : (
                                        <div className="flex justify-end gap-3">
                                            <button
                                                onClick={() => setShowDeleteConfirm(false)}
                                                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleDelete}
                                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                                            >
                                                Yes, Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </>
        </ModalPortal>
    );
}
