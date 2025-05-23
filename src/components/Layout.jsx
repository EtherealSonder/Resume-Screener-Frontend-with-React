import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";
import ModalOverlay from "./ModalOverlay";

export default function Layout() {
    const [selectedJob, setSelectedJob] = useState(null);

    return (
        <div className="relative flex h-screen w-screen overflow-hidden text-graylupa-text font-sans bg-graylupa-bg">
            <Sidebar />
            <div className="flex-1 flex flex-col bg-graylupa-bg overflow-hidden">
                <TopNavbar />
                <main className="flex-1 overflow-auto p-6 animate-fadeIn">
                    <Outlet context={{ selectedJob, setSelectedJob }} />
                </main>
            </div>

            {selectedJob && (
                <ModalOverlay job={selectedJob} onClose={() => setSelectedJob(null)} />
            )}
        </div>
    );
}
