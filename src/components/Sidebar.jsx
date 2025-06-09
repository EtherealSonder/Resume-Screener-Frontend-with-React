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
        <div
            className="w-64 h-full text-white shadow-xl p-6 flex flex-col justify-between"
            style={{
                background: `radial-gradient(600px circle at 30% 20%, #a855f733, transparent 60%), #1f2937`,
            }}
        >
            <div>
                <h1 className="text-2xl font-bold mb-8 tracking-wide text-white drop-shadow-md">LUPIQ</h1>

                <nav className="flex flex-col gap-3 text-base">
                    <NavLinkItem to="/dashboard/statistics" icon={<FaHome />} label="Home" exact={true} />
                    <NavLinkItem to="/dashboard/candidates" icon={<FaUser />} label="Candidates" />
                    <NavLinkItem to="/dashboard/jobs" icon={<FaBriefcase />} label="Jobs" />
                    <NavLinkItem to="/dashboard/asklupiq" icon={<FaRobot />} label="AskLUPIQ" />
                </nav>
            </div>

            <div className="space-y-4">
                {user?.name && (
                    <p className="text-sm text-white/70 px-2">
                        Logged in as <span className="font-semibold">{user.name}</span>
                    </p>
                )}

                <NavLinkItem to="/dashboard/settings" icon={<FaCog />} label="Settings" />
                <p
                    className="text-xs text-gray-400 px-2 cursor-help"
                    title="Upcoming: AskLUPIQ : a NLP agent for our dashboard, more analytics, revamped UI/UX, lesser load times, automatic mail to candidates when jobs get expired or deleted, improved scoring system, AI powered Job Creation system and more."
                >
                    Beta Preview
                </p>
            </div>
        </div>
    );
}

function NavLinkItem({ to, icon, label, exact = false }) {
    const location = useLocation();

    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 ${(exact ? location.pathname === to : isActive)
                    ? "bg-white/10 text-white font-semibold ring-1 ring-purple-500/30"
                    : "hover:bg-white/5 hover:ring-1 hover:ring-white/10 text-white"
                }`
            }
        >
            {icon}
            {label}
        </NavLink>
    );
}
