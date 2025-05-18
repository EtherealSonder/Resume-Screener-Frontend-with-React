import { Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function TopNavbar() {
    const [hasNotification, setHasNotification] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [latest, setLatest] = useState(null);
    const navigate = useNavigate();

    // Fetch notification status
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

    // Poll every 5 seconds
    useEffect(() => {
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

    return (
        <div className="w-full h-16 flex items-center px-6 bg-white/10 backdrop-blur-md shadow-md text-black justify-between relative z-50">
            <div className="text-xl font-bold">Resume Screener</div>

            <div className="flex-1 flex justify-center">
                <input
                    type="text"
                    placeholder="Search..."
                    className="px-4 py-2 w-1/2 rounded-full bg-white text-black placeholder-gray-500 border border-gray-300 shadow-sm outline-none"
                />
            </div>

            <div className="flex items-center gap-4 ml-6 relative">
                <div className="relative" onClick={handleBellClick}>
                    <Bell className="w-5 h-5 text-black cursor-pointer" />
                    {hasNotification && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                    )}
                </div>

                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                    T
                </div>

                {/* Dropdown */}
                {showDropdown && (
                    <div className="absolute right-0 top-16 bg-white border border-gray-200 shadow-xl rounded-lg w-64 p-4 z-[9999] text-sm">
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
