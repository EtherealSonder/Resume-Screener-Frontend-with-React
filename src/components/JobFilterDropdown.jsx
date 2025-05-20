import { useEffect, useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa";

export default function JobFilterDropdown({ jobTitles = [], selectedJobs, onChange }) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef();

    const toggleJob = (title) => {
        onChange(
            selectedJobs.includes(title)
                ? selectedJobs.filter((j) => j !== title)
                : [...selectedJobs, title]
        );
    };

    const toggleAllJobs = () => {
        if (selectedJobs.length === jobTitles.length) {
            onChange([]);
        } else {
            onChange(jobTitles);
        }
    };

    useEffect(() => {
        const close = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("click", close);
        return () => document.removeEventListener("click", close);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setOpen(!open)}
                className="border border-gray-300 px-4 py-2 text-sm rounded-md bg-white shadow-sm flex items-center gap-2"
            >
                Filter by Job(s) <FaChevronDown className="text-gray-500 text-xs" />
            </button>

            {open && (
                <div className="absolute z-50 mt-2 w-64 max-h-64 overflow-auto rounded-md shadow-lg bg-white border border-gray-200 p-3 space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer font-medium">
                        <input
                            type="checkbox"
                            checked={selectedJobs.length === jobTitles.length}
                            onChange={toggleAllJobs}
                        />
                        All Jobs
                    </label>
                    <hr />
                    {jobTitles.map((title, idx) => (
                        <label
                            key={idx}
                            className="flex items-center gap-2 cursor-pointer text-sm"
                        >
                            <input
                                type="checkbox"
                                checked={selectedJobs.includes(title)}
                                onChange={() => toggleJob(title)}
                            />
                            {title}
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
}
