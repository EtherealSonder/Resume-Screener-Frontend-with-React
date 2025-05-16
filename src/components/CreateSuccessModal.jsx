import { useNavigate } from "react-router-dom";
import ModalPortal from "./ModalPortal";

export default function CreateSuccessModal({ jobTitle, jobId, onReset, onClose }) {
    const navigate = useNavigate();
    const frontendUrl = import.meta.env.VITE_FRONTEND_URL;

    const handleGoToJobs = () => {
        onClose();
        navigate("/dashboard/jobs/my");
    };

    return (
        <ModalPortal>
            <>
                {/* Darkened overlay that covers everything */}
                <div className="fixed inset-0 z-[1000] bg-black/50 backdrop-blur-sm" />

                {/* Centered modal */}
                <div className="fixed inset-0 z-[1010] flex items-center justify-center p-4">
                    <div className="bg-white text-black rounded-2xl shadow-2xl w-full max-w-md animate-fade-scale p-6 space-y-6">
                        <h2 className="text-xl font-bold text-center">
                            ✅ "{jobTitle}" created successfully
                        </h2>
                        <p className="text-center text-gray-600">
                            Do you want to create another job?
                        </p>

                        <a
                            href={`${frontendUrl}/apply/${jobId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-center text-blue-600 underline"
                        >
                            View Application Form
                        </a>

                        <div className="flex justify-center gap-4 pt-2">
                            <button
                                onClick={onReset}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                                Yes
                            </button>
                            <button
                                onClick={handleGoToJobs}
                                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                            >
                                No
                            </button>
                        </div>
                    </div>
                </div>
            </>
        </ModalPortal>
    );
}
