import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";

export default function Layout() {
    return (
        <div className="flex h-screen bg-cover bg-center text-black font-sans"
            style={{ backgroundImage: "url('/src/assets/dashboard-bg.jpg')" }}
        >
            <Sidebar />
            <div className="flex-1 flex flex-col backdrop-blur-md bg-white/10">
                <TopNavbar />
                <main className="p-6 overflow-y-auto fade-in">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
