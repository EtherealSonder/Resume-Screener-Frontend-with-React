import { Outlet, NavLink } from "react-router-dom";

export default function Layout() {
    return (
        <div className="min-h-screen bg-gray-100 text-gray-900 font-sans">
            <nav className="bg-white shadow p-4 flex gap-6">
                <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                        isActive
                            ? "text-blue-600 font-semibold"
                            : "text-gray-700 hover:text-blue-500 transition"
                    }
                >
                    Dashboard
                </NavLink>
                <NavLink
                    to="/candidates"
                    className={({ isActive }) =>
                        isActive
                            ? "text-blue-600 font-semibold"
                            : "text-gray-700 hover:text-blue-500 transition"
                    }
                >
                    Candidates
                </NavLink>
                <NavLink
                    to="/jobs"
                    className={({ isActive }) =>
                        isActive
                            ? "text-blue-600 font-semibold"
                            : "text-gray-700 hover:text-blue-500 transition"
                    }
                >
                    Jobs
                </NavLink>
                <NavLink
                    to="/statistics"
                    className={({ isActive }) =>
                        isActive
                            ? "text-blue-600 font-semibold"
                            : "text-gray-700 hover:text-blue-500 transition"
                    }
                >
                    Statistics
                </NavLink>
            </nav>

            <main className="p-4 animate-fadeIn transition-opacity duration-500">
                <Outlet />
            </main>
        </div>
    );
}