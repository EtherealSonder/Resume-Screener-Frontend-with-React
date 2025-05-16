import { useEffect, useState } from "react";
import { FaEdit, FaTimes, FaTrash } from "react-icons/fa";
import { updateJob, deleteJob } from "../services/api";
import ModalPortal from "./ModalPortal";

export default function ModalOverlay({ job, onClose, refreshJobs }) {
    const [isClosing, setIsClosing] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(job.title || "");
    const [description, setDescription] = useState(job.description || "");
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const frontendUrl = import.meta.env.VITE_FRONTEND_URL;

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
            setIsClosing(false);
        }, 250);
    };

    const showToast = (message, color = "green") => {
        localStorage.setItem("job_toast", JSON.stringify({ message, color, time: Date.now() }));
    };

    const displayStoredToast = () => {
        const toastData = localStorage.getItem("job_toast");
        if (toastData) {
            const { message, color, time } = JSON.parse(toastData);
            const age = Date.now() - time;
            if (age < 5000) {
                setToast({ message, color });
                setTimeout(() => setToast(null), 5000);
            }
            localStorage.removeItem("job_toast");
        }
    };

    const handleUpdate = async () => {
        setIsLoading(true);
        try {
            await updateJob(job.id, {
                title: title.trim(),
                description: description.trim(),
            });
            refreshJobs();
            setIsEditing(false);
            handleClose();
            showToast(`\"${title}\" edited successfully`, "green");
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
            showToast("Job deleted", "red");
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
        displayStoredToast();
        return () => document.removeEventListener("keydown", handleEsc);
    }, []);

    return (
        <ModalPortal>
            <>
                {/* Backdrop */}
                <div
                    className={`fixed inset-0 z-[1000] bg-black/70 backdrop-blur-sm transition-opacity duration-200 ${isClosing ? "opacity-0" : "opacity-100"}`}
                    onClick={!isLoading ? handleClose : null}
                />

                {/* Modal */}
                <div className="fixed inset-0 z-[1010] flex items-center justify-center p-4">
                    <div
                        className={`bg-white text-black rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden relative ${isClosing ? "animate-fade-out-scale" : "animate-fade-scale"
                            }`}
                    >
                        {/* Top Actions */}
                        <div className="absolute right-4 top-4 flex gap-3">
                            {!isEditing && (
                                <>
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="text-gray-500 hover:text-blue-600"
                                        disabled={isLoading}
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => setShowDeleteConfirm(true)}
                                        className="text-gray-500 hover:text-red-600"
                                        disabled={isLoading}
                                    >
                                        <FaTrash />
                                    </button>
                                </>
                            )}
                            <button
                                onClick={handleClose}
                                className="text-gray-500 hover:text-red-600"
                                disabled={isLoading}
                            >
                                <FaTimes />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 px-6 py-6 overflow-y-auto text-sm">
                            {isEditing ? (
                                <>
                                    <input
                                        className="text-2xl font-bold border border-gray-300 px-4 py-3 w-full rounded mb-4"
                                        value={title}
                                        disabled={isLoading}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                    <textarea
                                        className="w-full border border-gray-300 p-3 rounded h-60 resize-none"
                                        disabled={isLoading}
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </>
                            ) : (
                                <>
                                    <h2 className="text-2xl font-bold">{title}</h2>
                                    <p className="whitespace-pre-wrap mt-4">{description}</p>
                                        <a
                                            href={`${frontendUrl}/apply/${job.id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block text-center text-blue-600 underline"
                                        >
                                            View Application Form
                                        </a>
                                </>
                            )}
                        </div>

                        {/* Footer Buttons for Editing */}
                        {isEditing && (
                            <div className="flex justify-end gap-3 px-6 pb-6 border-t pt-4">
                                {isLoading ? (
                                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <button
                                            onClick={() => {
                                                setIsEditing(false);
                                                setTitle(job.title);
                                                setDescription(job.description);
                                            }}
                                            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleUpdate}
                                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                        >
                                            Confirm
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Delete Confirmation */}
                {showDeleteConfirm && (
                    <div className="fixed inset-0 z-[1020] flex items-center justify-center bg-black/70">
                        <div className="bg-white text-black p-6 rounded-xl shadow-xl space-y-4 w-[90%] max-w-md">
                            <h3 className="text-lg font-bold">
                                Are you sure you want to delete "{job.title || "this job"}"?
                            </h3>
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

                {/* Toast Message */}
                {toast && (
                    <div
                        className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-3 text-white rounded-xl shadow-xl animate-slide-in z-[2000] ${toast.color === "green" ? "bg-green-600" : "bg-red-600"
                            }`}
                    >
                        {toast.message}
                    </div>
                )}
            </>
        </ModalPortal>
    );
}