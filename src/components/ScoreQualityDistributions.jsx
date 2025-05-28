import { useState, useEffect } from "react";
import BarChartCard from "../components/charts/BarChartCard";
import PieChartCard from "../components/charts/PieChartCard";
import LoadingSpinner from "../components/candidates/LoadingSpinner";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { FaSlidersH, FaUserClock, FaGraduationCap } from "react-icons/fa";

export default function ScoreQualityDistributions({ jobTitles, defaultTab = "score" }) {
    const { user } = useAuth();
    const [view, setView] = useState(defaultTab);
    const [selectedJob, setSelectedJob] = useState("All Jobs");
    const [loading, setLoading] = useState(false);

    const [scoreBuckets, setScoreBuckets] = useState([]);
    const [experienceRanges, setExperienceRanges] = useState([]);
    const [educationLevels, setEducationLevels] = useState([]);

    const scoreColors = [
        "#dc2626", "#ef4444", "#f97316", "#fbbf24", "#eab308",
        "#a3e635", "#4ade80", "#22c55e", "#10b981", "#14b8a6", "#16a34a"
    ];

    const experienceRangesOrder = [
        "0", "0 - 1", "1 - 2", "2 - 4", "4 - 7", "7 - 10", "10 - 15", "15+"
    ];

    const experienceLabels = [
        "Fresher", "Beginner", "Junior", "Mid-Level",
        "Experienced", "Advanced", "Expert", "Veteran"
    ];

    const experienceColors = [
        "#fde68a", "#fcd34d", "#fbbf24", "#f59e0b",
        "#f97316", "#fb7185", "#f43f5e", "#e11d48"
    ];

    useEffect(() => {
        setView(defaultTab);
    }, [defaultTab]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await api.get("/statistics/distributions", {
                    params: {
                        client_id: user.id,
                        job_titles: selectedJob === "All Jobs" ? [] : [selectedJob]
                    }
                });

                const sortedScores = res.data.scoreBuckets.sort((a, b) => {
                    const getStart = (s) => s === "100" ? 100 : parseInt(s.split("-")[0]);
                    return getStart(a.range) - getStart(b.range);
                });

                const orderedExperience = experienceRangesOrder.map((range, i) => {
                    const match = res.data.experienceHistogram.find(e => e.range === range);
                    return {
                        range,
                        count: match ? match.count : 0,
                        level: experienceLabels[i]
                    };
                });

                setScoreBuckets(sortedScores);
                setExperienceRanges(orderedExperience);
                setEducationLevels(res.data.educationLevels);
            } catch (err) {
                console.error("Error loading distribution data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [selectedJob]);

    return (
        <div className="mt-4">
            <div className="mb-6">
                <label className="block text-sm mb-1 font-medium text-gray-700">Filter by Job:</label>
                <select
                    value={selectedJob}
                    onChange={(e) => setSelectedJob(e.target.value)}
                    className="border rounded px-3 py-2 text-sm w-60"
                >
                    <option value="All Jobs">All Jobs</option>
                    {(jobTitles || []).map((title, idx) => (
                        <option key={idx} value={title}>{title}</option>
                    ))}
                </select>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-4">
                <button
                    onClick={() => setView("score")}
                    className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md border ${view === "score" ? "bg-pink-600 text-white" : "bg-white text-gray-700 border-gray-300"}`}
                >
                    <FaSlidersH /> Score Buckets
                </button>
                <button
                    onClick={() => setView("experience")}
                    className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md border ${view === "experience" ? "bg-pink-600 text-white" : "bg-white text-gray-700 border-gray-300"}`}
                >
                    <FaUserClock /> Experience Histogram
                </button>
                <button
                    onClick={() => setView("education")}
                    className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md border ${view === "education" ? "bg-pink-600 text-white" : "bg-white text-gray-700 border-gray-300"}`}
                >
                    <FaGraduationCap /> Education Levels
                </button>
            </div>

            {loading ? (
                <LoadingSpinner />
            ) : (
                <>
                    {view === "score" && (
                        <BarChartCard
                            title="Candidate Score Distribution"
                            data={scoreBuckets}
                            xKey="range"
                            dataKey="count"
                            xLabel="Score Range"
                            yLabel="Number of Candidates"
                            barColors={scoreColors}
                        />
                    )}
                    {view === "experience" && (
                        <BarChartCard
                            title="Experience Level Histogram"
                            data={experienceRanges}
                            xKey="range"
                            dataKey="count"
                            xLabel="Years of Experience"
                            yLabel="Candidate Count"
                            barColors={experienceColors}
                            tooltipFormatter={(value, name, props) =>
                                `${props.payload.level} - ${value} candidates`
                            }
                        />
                    )}
                    {view === "education" && (
                        <PieChartCard
                            title="Education Level Breakdown"
                            data={educationLevels}
                            nameKey="label"
                            valueKey="value"
                            showLegend={true}
                        />
                    )}
                </>
            )}
        </div>
    );
}
