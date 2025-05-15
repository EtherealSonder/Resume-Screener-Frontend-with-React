import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";
import ModalOverlay from "./ModalOverlay";
import bgImage from "../assets/dashboard-bg.jpg";

export default function Layout() {
    const [selectedJob, setSelectedJob] = useState(null);

    return (
        <div
            className="relative flex h-screen w-screen overflow-hidden text-black font-sans"
            style={{
                backgroundImage: `url(${bgImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >

            <Sidebar />
            <div className="flex-1 flex flex-col bg-white/10 backdrop-blur-md overflow-hidden">
                <TopNavbar />
                <main className="flex-1 overflow-auto p-6 fade-in">
                    <Outlet context={{ selectedJob, setSelectedJob }} />
                </main>
            </div>

            {selectedJob && (
                <ModalOverlay job={selectedJob} onClose={() => setSelectedJob(null)} />
            )}
        </div>
    );
}
