import { Bell, Plus, RefreshCcw } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function TopNavbar() {
    const [hasNotification, setHasNotification] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [latest, setLatest] = useState(null);
    const [showQuickActions, setShowQuickActions] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchNotification = async () => {
            try {
                const res = await api.get("/notification_status");
                if (res.data.new_resume) {
                    setHasNotification(true);
                    setLatest(res.data.latest_resume);
                }
            } catch (err) {
                console.error("Notification check failed:", err);
            }
        };

        fetchNotification();
        const interval = setInterval(fetchNotification, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleBellClick = () => {
        setShowDropdown((prev) => !prev);
    };

    const handleViewCandidates = async () => {
        try {
            await api.post("/clear_notification");
            setHasNotification(false);
            setShowDropdown(false);
            navigate("/dashboard/candidates");
        } catch (err) {
            console.error("Failed to clear notification:", err);
        }
    };

    const handleRefresh = () => navigate(0);
    const handleCreateJob = () => {
        navigate("/dashboard/jobs/create");
        setShowQuickActions(false);
    };

    return (
        <div className="w-full h-16 flex items-center px-6 bg-graylupa-bg text-graylupa-text justify-between relative z-50 shadow-sm">
            <div className="text-xl font-bold"></div>
            <div className="flex-1" />

            <div className="flex items-center gap-4 ml-6 relative">
                {/* ➕ Quick Actions */}
                <div className="relative">
                    <button
                        onClick={() => setShowQuickActions((prev) => !prev)}
                        title="Quick Actions"
                        className="bg-gray-700 hover:bg-gray-600 text-white rounded-full p-2"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                    {showQuickActions && (
                        <div className="absolute right-0 top-12 bg-white border border-gray-200 shadow-lg rounded-lg w-48 text-sm p-2 z-50 text-gray-800">
                            <button
                                onClick={handleCreateJob}
                                className="block w-full text-left px-3 py-2 rounded hover:bg-gray-100"
                            >
                                ➕ Create Job
                            </button>
                        </div>
                    )}
                </div>

                {/* 🔁 Refresh Button */}
                <button
                    onClick={handleRefresh}
                    title="Refresh Page"
                    className="bg-gray-700 hover:bg-gray-600 text-white rounded-full p-2"
                >
                    <RefreshCcw className="w-5 h-5" />
                </button>

                {/* 🔔 Notification Bell */}
                <button
                    onClick={handleBellClick}
                    title="Notifications"
                    className="relative bg-gray-700 hover:bg-gray-600 text-white rounded-full p-2"
                >
                    <Bell className="w-5 h-5" />
                    {hasNotification && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                    )}
                </button>

                {/* 🔽 Notification Dropdown */}
                {showDropdown && (
                    <div className="absolute right-0 top-16 bg-white border border-gray-200 shadow-xl rounded-lg w-64 p-4 z-[9999] text-sm text-gray-800">
                        {hasNotification && latest ? (
                            <>
                                <p className="font-medium">📥 New Resume Received</p>
                                <p className="text-gray-600 mt-1">{latest.candidate_name}</p>
                                <p className="text-xs text-gray-400">
                                    {new Date(latest.application_date).toLocaleString()}
                                </p>
                                <button
                                    onClick={handleViewCandidates}
                                    className="mt-3 w-full bg-blue-600 text-white py-1 rounded hover:bg-blue-700"
                                >
                                    View in Candidates
                                </button>
                            </>
                        ) : (
                            <p className="text-gray-500">No notifications</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
