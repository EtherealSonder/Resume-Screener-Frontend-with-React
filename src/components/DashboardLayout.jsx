import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
    return (
        <div className="min-h-screen bg-gray-100 font-sans">
            <nav className="bg-white shadow p-4 text-gray-800 font-medium">
                Sidebar / Topbar
            </nav>
            <main className="p-6 animate-fadeIn transition-opacity duration-500">
                <Outlet />
            </main>
        </div>
    );
}
