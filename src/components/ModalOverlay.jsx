import { useEffect, useState } from "react";
import { FaEdit, FaTimes } from "react-icons/fa";

export default function ModalOverlay({ job, onClose }) {
    const [isClosing, setIsClosing] = useState(false);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
            setIsClosing(false);
        }, 250); // match fade-out animation duration
    };

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") handleClose();
        };
        document.addEventListener("keydown", handleEsc);
        return () => document.removeEventListener("keydown", handleEsc);
    }, []);

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm transition-opacity duration-200 ${isClosing ? "opacity-0" : "opacity-100"
                    }`}
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                <div
                    className={`bg-white text-black rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden ${isClosing ? "animate-fade-out-scale" : "animate-fade-scale"
                        }`}
                >
                    {/* Header */}
                    <div className="flex justify-between items-center px-6 py-4 border-b">
                        <h2 className="text-2xl font-bold">{job.title}</h2>
                        <div className="flex items-center gap-3">
                            <button className="text-gray-500 hover:text-blue-600" title="Edit (coming soon)">
                                <FaEdit />
                            </button>
                            <button
                                onClick={handleClose}
                                className="text-gray-500 hover:text-red-600"
                                title="Close"
                            >
                                <FaTimes />
                            </button>
                        </div>
                    </div>

                    {/* Scrollable Content */}
                    <div className="overflow-y-auto px-6 py-4 text-sm leading-relaxed flex-1">
                        <p className="whitespace-pre-wrap">{job.description}</p>
                        <a
                            href={`http://localhost:5000/apply/${job.id}`}
                            target="_blank"
                            className="block text-blue-600 underline mt-4"
                        >
                            View Application Form
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}
