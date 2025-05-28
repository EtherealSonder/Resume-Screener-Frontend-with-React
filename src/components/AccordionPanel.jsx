import { useState, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";

export default function AccordionPanel({ title, icon, children, forceOpen = false, sectionId }) {
    const [open, setOpen] = useState(false);

    // If external control says open, set it
    useEffect(() => {
        if (forceOpen) {
            setOpen(true);
        }
    }, [forceOpen]);

    return (
        <div id={sectionId} className="bg-graylupa-surface mb-6 rounded-xl shadow border border-graylupa-border text-graylupa-text">
            <div
                onClick={() => setOpen(!open)}
                className="cursor-pointer flex items-center justify-between p-4 border-b border-black/10 text-black"
            >
                <div className="flex items-center gap-3 font-semibold text-lg">
                    <span className="text-xl">{icon}</span>
                    {title}
                </div>
                <FaChevronDown
                    className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                />
            </div>

            {open && (
                <div className="p-6 text-black animate-fadeIn">
                    {children}
                </div>
            )}
        </div>
    );
}
