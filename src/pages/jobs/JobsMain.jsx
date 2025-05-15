import { useNavigate } from "react-router-dom";
import { FaBriefcase, FaPlus } from "react-icons/fa";

export default function JobsMain() {
    const navigate = useNavigate();

    return (
        <div className="flex justify-center items-center h-full gap-12 animate-fadeIn">
            <div
                onClick={() => navigate("/dashboard/jobs/my")}
                className="bg-white text-black hover:bg-blue-100 hover:scale-105 transform transition-all duration-300 w-64 h-64 rounded-3xl shadow-xl flex flex-col items-center justify-center gap-4 text-xl font-semibold cursor-pointer"
            >
                <FaBriefcase size={48} />
                My Jobs
            </div>

            <div
                onClick={() => navigate("/dashboard/jobs/create")}
                className="bg-white text-black hover:bg-blue-100 hover:scale-105 transform transition-all duration-300 w-64 h-64 rounded-3xl shadow-xl flex flex-col items-center justify-center gap-4 text-xl font-semibold cursor-pointer"
            >
                <FaPlus size={48} />
                Create Job
            </div>
        </div>
    );
}
