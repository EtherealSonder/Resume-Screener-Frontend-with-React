import { NavLink } from "react-router-dom";
import { FaHome, FaUser, FaBriefcase, FaChartPie, FaCog } from "react-icons/fa";

export default function Sidebar() {
    return (
        <div className="w-64 h-full bg-white/10 backdrop-blur-md text-black shadow-xl p-6 flex flex-col justify-between">
            <div className="space-y-8">
                <nav className="flex flex-col gap-4 text-lg">
                    <NavLink
                        to="/dashboard"
                        end
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 ${isActive ? "bg-black/10 font-semibold" : "hover:bg-black/5"
                            }`
                        }
                    >
                        <FaHome />
                        Home
                    </NavLink>

                    <NavLink
                        to="/dashboard/candidates"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 ${isActive ? "bg-black/10 font-semibold" : "hover:bg-black/5"
                            }`
                        }
                    >
                        <FaUser />
                        Candidates
                    </NavLink>

                    <NavLink
                        to="/dashboard/jobs"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 ${isActive ? "bg-black/10 font-semibold" : "hover:bg-black/5"
                            }`
                        }
                    >
                        <FaBriefcase />
                        Jobs
                    </NavLink>

                    <NavLink
                        to="/dashboard/statistics"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 ${isActive ? "bg-black/10 font-semibold" : "hover:bg-black/5"
                            }`
                        }
                    >
                        <FaChartPie />
                        Statistics
                    </NavLink>
                </nav>
            </div>

            <div>
                <NavLink
                    to="/dashboard/settings"
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 text-lg ${isActive ? "bg-black/10 font-semibold" : "hover:bg-black/5"
                        }`
                    }
                >
                    <FaCog />
                    Settings
                </NavLink>
            </div>
        </div>
    );
}
