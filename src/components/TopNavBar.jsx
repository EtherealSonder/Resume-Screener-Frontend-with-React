import { Bell } from "lucide-react";

export default function TopNavbar() {
    return (
        <div className="w-full flex justify-between items-center px-6 py-4 bg-white/50 backdrop-blur-sm shadow text-black">
            <h1 className="text-xl font-bold">Resume Screener</h1>

            <input
                type="text"
                placeholder="Search..."
                className="rounded-full px-4 py-2 w-1/3 bg-white border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <div className="flex items-center gap-4">
                <button>
                    <Bell className="w-5 h-5" />
                </button>
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                    T
                </div>
            </div>
        </div>
    );
}
