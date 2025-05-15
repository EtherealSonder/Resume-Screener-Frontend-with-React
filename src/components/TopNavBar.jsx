import { Bell } from "lucide-react";

export default function TopNavbar() {
    return (
        <div className="w-full h-16 flex items-center px-6 bg-white/10 backdrop-blur-md shadow-md text-black justify-between">
            {/* Left: Logo or Title */}
            <div className="text-xl font-bold">Resume Screener</div>

            {/* Center: Search bar */}
            <div className="flex-1 flex justify-center">
                <input
                    type="text"
                    placeholder="Search..."
                    className="px-4 py-2 w-1/2 rounded-full bg-white text-black placeholder-gray-500 border border-gray-300 shadow-sm outline-none"
                />
            </div>

            {/* Right: Notification bell and profile */}
            <div className="flex items-center gap-4 ml-6">
                <Bell className="w-5 h-5 text-black cursor-pointer" />
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                    T
                </div>
            </div>
        </div>
    );
}
