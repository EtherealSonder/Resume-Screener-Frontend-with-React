import { useEffect, useState } from "react";
import LoadingSpinner from "../candidates/LoadingSpinner";
import { useAuth } from "../../context/AuthContext";
import {
    getSkillBubbleData,
    getRadarData,
    getCandidates
} from "../../services/api";
import SkillWordCloud from "../SkillWordCloudCustom";
import RadarSkillChart from "./RadarSkillChart";
import { FaCloud, FaBullseye } from "react-icons/fa";

export default function SkillInsights({ defaultTab = "word" }) {
    const { user } = useAuth();
    const [jobTitles, setJobTitles] = useState([]);
    const [selectedJob, setSelectedJob] = useState("");
    const [compareJobs, setCompareJobs] = useState([]);
    const [view, setView] = useState(defaultTab); // default view
    const [type, setType] = useState("technical");

    const [bubbleData, setBubbleData] = useState([]);
    const [radarData, setRadarData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setView(defaultTab); // update view if defaultTab changes
    }, [defaultTab]);

    useEffect(() => {
        async function fetchJobs() {
            const res = await getCandidates(user.id);
            const grouped = res.data.reduce((acc, c) => {
                acc[c.job_title] = acc[c.job_title] ? acc[c.job_title] + 1 : 1;
                return acc;
            }, {});
            const sorted = Object.entries(grouped).sort((a, b) => b[1] - a[1]);
            const titles = sorted.map(([title]) => title);
            setJobTitles(titles);
            setSelectedJob(titles[0] || "");
            setCompareJobs(titles.slice(0, 2));
        }
        fetchJobs();
    }, [user.id]);

    useEffect(() => {
        setLoading(true);
        Promise.all([
            getSkillBubbleData(user.id, type),
            getRadarData(user.id, type, compareJobs)
        ])
            .then(([bubbleRes, radarRes]) => {
                const filteredBubbles = selectedJob
                    ? bubbleRes.data.filter(
                        (d) =>
                            d.job_title?.toLowerCase().trim() ===
                            selectedJob.toLowerCase().trim()
                    )
                    : [];
                setBubbleData(filteredBubbles);
                setRadarData(radarRes.data);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [selectedJob, type, compareJobs]);

    return (
        <div className="bg-white/20 backdrop-blur-md p-6 rounded-xl shadow space-y-4 fade-in">
            <h2 className="text-xl font-semibold text-amber-700">Skill Insights</h2>

            {/* Tabs for Word Cloud and Radar */}
            <div className="flex flex-wrap gap-4 mt-2">
                {[
                    { key: "word", label: "Word Cloud", icon: <FaCloud /> },
                    { key: "radar", label: "Radar Chart", icon: <FaBullseye /> }
                ].map(({ key, label, icon }) => (
                    <button
                        key={key}
                        onClick={() => setView(key)}
                        className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md border ${view === key
                            ? "bg-amber-700 text-white"
                            : "bg-white text-gray-700 border-gray-300"
                            }`}
                    >
                        {icon}
                        {label}
                    </button>
                ))}
            </div>

            {/* Filters Row */}
            {view === "word" && (
                <div className="flex flex-wrap gap-4 mt-2 items-end">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Filter by Job Title
                        </label>
                        <select
                            value={selectedJob || ""}
                            onChange={(e) => setSelectedJob(e.target.value)}
                            className="border rounded px-3 py-2 text-sm w-72"
                        >
                            {jobTitles.map((title, idx) => (
                                <option key={idx} value={title}>
                                    {title}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="pt-1">
                        <SkillTypeToggle type={type} setType={setType} />
                    </div>
                </div>
            )}

            {view === "radar" && (
                <div className="flex flex-wrap gap-4 mt-2 items-end">
                    {[0, 1].map((i) => (
                        <div key={i}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Compare Job {i + 1}
                            </label>
                            <select
                                value={compareJobs[i] || ""}
                                onChange={(e) => {
                                    const newJobs = [...compareJobs];
                                    newJobs[i] = e.target.value;
                                    setCompareJobs(newJobs);
                                }}
                                className="border rounded px-3 py-2 text-sm w-64"
                            >
                                {jobTitles.map((title, idx) => (
                                    <option key={idx} value={title}>
                                        {title}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ))}
                    <div className="pt-1">
                        <SkillTypeToggle type={type} setType={setType} />
                    </div>
                </div>
            )}

            {/* Chart Content */}
            {loading ? (
                <LoadingSpinner />
            ) : view === "word" ? (
                <SkillWordCloud data={bubbleData} />
            ) : (
                <RadarSkillChart data={radarData} selectedJobs={compareJobs} />
            )}
        </div>
    );
}

function SkillTypeToggle({ type, setType }) {
    return (
        <div className="inline-flex items-center bg-gray-100 rounded-full p-1">
            <button
                onClick={() => setType("technical")}
                className={`px-4 py-1 text-sm rounded-full ${type === "technical"
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-200"
                    }`}
            >
                Technical Skills
            </button>
            <button
                onClick={() => setType("soft")}
                className={`px-4 py-1 text-sm rounded-full ${type === "soft"
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-200"
                    }`}
            >
                Soft Skills
            </button>
        </div>
    );
}
