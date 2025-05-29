import { useEffect, useState, useRef } from "react";
import LoadingSpinner from "../candidates/LoadingSpinner";
import { useAuth } from "../../context/AuthContext";
import { getSkillBubbleData, getRadarData, getCandidates } from "../../services/api";
import SkillWordCloud from "../SkillWordCloudCustom";
import RadarSkillChart from "./RadarSkillChart";
import ExportButtons from "../ExportButtons";

export default function SkillInsights({ defaultTab = "word" }) {
    const { user } = useAuth();
    const [jobTitles, setJobTitles] = useState([]);
    const [selectedJob, setSelectedJob] = useState("");
    const [compareJobs, setCompareJobs] = useState([]);
    const [type, setType] = useState("technical");

    const [bubbleData, setBubbleData] = useState([]);
    const [radarData, setRadarData] = useState([]);
    const [loading, setLoading] = useState(true);
    const chartRef = useRef();

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
        if (defaultTab === "word") {
            getSkillBubbleData(user.id, type).then(res => {
                const filtered = selectedJob
                    ? res.data.filter(
                        (d) => d.job_title?.toLowerCase().trim() === selectedJob.toLowerCase().trim()
                    )
                    : [];
                setBubbleData(filtered);
            }).finally(() => setLoading(false));
        } else {
            getRadarData(user.id, type, compareJobs).then(res => {
                setRadarData(res.data);
            }).finally(() => setLoading(false));
        }
    }, [selectedJob, type, compareJobs, defaultTab, user.id]);

    return (
        <div className="space-y-4 fade-in">
            {defaultTab === "word" && (
                <>
                    <h2 className="text-xl font-semibold text-gray-800">Skill Word Cloud</h2>
                    <p className="text-sm text-gray-600">Visual representation of the most frequent skills by role.</p>
                </>
            )}
            {defaultTab === "radar" && (
                <>
                    <h2 className="text-xl font-semibold text-gray-800">Skill Radar Chart</h2>
                    <p className="text-sm text-gray-600">Compare skill profiles across job titles.</p>
                </>
            )}

            {/* Filters and Export */}
            <div className="flex justify-between items-center">
                <div className="flex flex-wrap gap-4 items-end">
                    {defaultTab === "word" && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Filter by Job Title
                            </label>
                            <select
                                value={selectedJob || ""}
                                onChange={(e) => setSelectedJob(e.target.value)}
                                className="border rounded px-3 py-2 text-sm w-64"
                            >
                                {jobTitles.map((title, idx) => (
                                    <option key={idx} value={title}>{title}</option>
                                ))}
                            </select>
                        </div>
                    )}
                    {defaultTab === "radar" && (
                        <>
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
                                            <option key={idx} value={title}>{title}</option>
                                        ))}
                                    </select>
                                </div>
                            ))}
                        </>
                    )}
                    <div className="pt-1">
                        <SkillTypeToggle type={type} setType={setType} />
                    </div>
                </div>
                <ExportButtons targetRef={chartRef} fileName={defaultTab === "word" ? "Skill_Word_Cloud" : "Skill_Radar_Chart"} exportPNGOnly />
            </div>

            {loading ? (
                <LoadingSpinner />
            ) : (
                <div ref={chartRef} className="bg-gray-100 p-6 rounded-xl shadow space-y-4">
                    {defaultTab === "word" && (
                        bubbleData.length > 0
                            ? <SkillWordCloud data={bubbleData} />
                            : <p className="italic text-gray-500 text-center py-4">No skills data available for this job role.</p>
                    )}
                    {defaultTab === "radar" && (
                        radarData.length > 0
                            ? <RadarSkillChart data={radarData} selectedJobs={compareJobs} />
                            : <p className="italic text-gray-500 text-center py-4">Not enough shared skills to generate a radar chart. Try comparing jobs with more overlap.</p>
                    )}
                </div>
            )}
        </div>
    );
}

function SkillTypeToggle({ type, setType }) {
    return (
        <div className="inline-flex items-center bg-gray-200 rounded-full p-1">
            <button
                onClick={() => setType("technical")}
                className={`px-4 py-1 text-sm rounded-full ${type === "technical"
                    ? "bg-gray-700 text-white"
                    : "text-gray-700 hover:bg-gray-300"}`}
            >
                Technical Skills
            </button>
            <button
                onClick={() => setType("soft")}
                className={`px-4 py-1 text-sm rounded-full ${type === "soft"
                    ? "bg-gray-700 text-white"
                    : "text-gray-700 hover:bg-gray-300"}`}
            >
                Soft Skills
            </button>
        </div>
    );
}
