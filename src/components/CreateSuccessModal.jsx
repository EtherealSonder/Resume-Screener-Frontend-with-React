export default function CreateSuccessModal({ jobTitle, jobId, onReset, onClose }) {
    const navigate = useNavigate();

    return (
        <>
            {/* Darkened overlay that covers everything */}
            <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm pointer-events-auto" />

            {/* Centered modal */}
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                <div className="bg-white text-black rounded-2xl shadow-2xl w-full max-w-md animate-fade-scale p-6 space-y-6">
                    <h2 className="text-xl font-bold text-center">
                        ✅ "{jobTitle}" created successfully
                    </h2>
                    <p className="text-center text-gray-600">
                        Do you want to create another job?
                    </p>

                    <a
                        href={`http://localhost:5000/apply/${jobId}`}
                        target="_blank"
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
                            onClick={() => {
                                onClose();
                                navigate("/dashboard/jobs");
                            }}
                            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                        >
                            No
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
