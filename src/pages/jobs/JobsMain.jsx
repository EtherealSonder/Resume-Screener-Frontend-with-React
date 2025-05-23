import { useNavigate } from "react-router-dom";
import { FaBriefcase, FaPlus } from "react-icons/fa";

export default function JobsMain() {
    const navigate = useNavigate();

    return (
        <div className="flex justify-center items-center h-full gap-12 animate-fadeIn">
            {/* My Jobs */}
            <div
                onClick={() => navigate("/dashboard/jobs/my")}
                className="bg-graylupa-surface hover:bg-gray-100 border border-graylupa-border transition-all duration-200 p-6 rounded-2xl shadow-sm hover:shadow-md cursor-pointer flex flex-col items-center justify-center w-64 h-64 text-xl font-semibold gap-4"
            >
                <div className="bg-gray-700 text-white p-4 rounded-full">
                    <FaBriefcase size={32} />
                </div>
                <span className="text-graylupa-text">My Jobs</span>
            </div>

            {/* Create Job */}
            <div
                onClick={() => navigate("/dashboard/jobs/create")}
                className="bg-graylupa-surface hover:bg-gray-100 border border-graylupa-border transition-all duration-200 p-6 rounded-2xl shadow-sm hover:shadow-md cursor-pointer flex flex-col items-center justify-center w-64 h-64 text-xl font-semibold gap-4"
            >
                <div className="bg-gray-700 text-white p-4 rounded-full">
                    <FaPlus size={32} />
                </div>
                <span className="text-graylupa-text">Create Job</span>
            </div>
        </div>
    );
}
