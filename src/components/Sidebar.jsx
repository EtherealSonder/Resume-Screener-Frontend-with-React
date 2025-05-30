import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
    FaHome,
    FaUser,
    FaBriefcase,
    FaChartPie,
    FaRobot,
    FaCog,
} from "react-icons/fa";

export default function Sidebar() {
    const { user } = useAuth();
    const location = useLocation();

    return (
        <div className="w-64 h-full bg-gray-800 text-white shadow-xl p-6 flex flex-col justify-between">
            <div>
                <h1 className="text-2xl font-bold mb-8 tracking-wide">LUPIQ</h1>

                <nav className="flex flex-col gap-4 text-lg">
                    {/* Home now points to /dashboard/statistics */}
                    <NavLinkItem to="/dashboard/statistics" icon={<FaHome />} label="Home" exact={true} />
                    <NavLinkItem to="/dashboard/candidates" icon={<FaUser />} label="Candidates" />
                    <NavLinkItem to="/dashboard/jobs" icon={<FaBriefcase />} label="Jobs" />
                    <NavLinkItem to="/dashboard/asklupiq" icon={<FaRobot />} label={<em>AskLupiq</em>} />
                </nav>
            </div>

            <div className="space-y-4">
                {user?.name && (
                    <p className="text-sm text-white/70 px-2">
                        Logged in as <span className="font-semibold">{user.name}</span>
                    </p>
                )}

                <NavLinkItem to="/dashboard/settings" icon={<FaCog />} label="Settings" />
                <p className="text-xs text-gray-400 px-2">Development Build</p>
            </div>
        </div>
    );
}

function NavLinkItem({ to, icon, label, exact = false }) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 ${(exact ? location.pathname === to : isActive)
                    ? "bg-gray-700 text-white font-semibold"
                    : "hover:bg-gray-700 text-white"
                }`
            }
        >
            {icon}
            {label}
        </NavLink>
    );
}
