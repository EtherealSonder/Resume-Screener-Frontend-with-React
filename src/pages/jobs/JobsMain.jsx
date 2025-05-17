import { useNavigate } from "react-router-dom";
import { FaBriefcase, FaPlus } from "react-icons/fa";

export default function JobsMain() {
    const navigate = useNavigate();

    return (
        <div className="flex justify-center items-center h-full gap-12 animate-fadeIn">
            <div
                onClick={() => navigate("/dashboard/jobs/my")}
                className="bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 transition p-5 rounded-2xl shadow-sm hover:shadow-md cursor-pointer flex flex-col items-center justify-center w-64 h-64 text-xl font-semibold gap-4"
            >
                <FaBriefcase size={48} />
                My Jobs
            </div>

            <div
                onClick={() => navigate("/dashboard/jobs/create")}
                className="bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 transition p-5 rounded-2xl shadow-sm hover:shadow-md cursor-pointer flex flex-col items-center justify-center w-64 h-64 text-xl font-semibold gap-4"
            >
                <FaPlus size={48} />
                Create Job
            </div>
        </div>
    );
}
