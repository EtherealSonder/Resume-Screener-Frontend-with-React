import { useEffect, useState } from "react";
import {
    FaChartBar, FaUserTie, FaBrain, FaTools, FaTable,
    FaChartLine, FaCloud, FaBullseye, FaUserClock, FaGraduationCap
} from "react-icons/fa";
import TopCandidatesTable from "../components/Tables/TopCandidatesTable";
import ScoreExperienceChart from "../components/charts/ScoreExperienceChart";
import MostAppliedJobsTable from "../components/Tables/MostAppliedJobsTable";
import ApplicationsTimelineChart from "../components/charts/ApplicationsTimelineChart";
import ScoreQualityDistributions from "../components/ScoreQualityDistributions";
import SkillInsights from "../components/charts/SkillInsights";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import LoadingSpinner from "../components/candidates/LoadingSpinner";

export default function AnalyticsPage() {
    const { user } = useAuth();
    const [view, setView] = useState("topCandidates");
    const [candidates, setCandidates] = useState([]);
    const [scoreExpPlot, setScoreExpPlot] = useState([]);
    const [mostApplied, setMostApplied] = useState([]);
    const [timelineData, setTimelineData] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [topCandidatesFilter, setTopCandidatesFilter] = useState(["All Jobs"]);
    const [scoreExpFilter, setScoreExpFilter] = useState(["All Jobs"]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const res1 = await api.get(`/candidates?client_id=${user.id}`);
                const res2 = await api.get(`/statistics?client_id=${user.id}`);
                const res3 = await api.get(`/jobs?client_id=${user.id}`);
                const jobTitles = res3.data.map((j) => j.title);
                setCandidates(res1.data);
                setScoreExpPlot(res2.data.scoreExperiencePlot || []);
                setMostApplied(res2.data.mostAppliedJobs || []);
                setTimelineData(res2.data.applicationTimeline || []);
                setJobs(jobTitles);
            } catch (err) {
                console.error("Error fetching analytics data:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [user.id]);

    const analyticsOptions = [
        { key: "topCandidates", label: "Top Candidates Table", icon: <FaTable /> },
        { key: "scoreExperience", label: "Score vs Experience Correlation", icon: <FaChartLine /> },
        { key: "mostApplied", label: "Most Applied Jobs", icon: <FaChartBar /> },
        { key: "timeline", label: "Applications Timeline", icon: <FaChartLine /> },
        { key: "scoreQuality", label: "Score Buckets Distribution", icon: <FaBrain /> },
        { key: "experienceHistogram", label: "Experience Histogram", icon: <FaUserClock /> },
        { key: "educationLevels", label: "Education Level Breakdown", icon: <FaGraduationCap /> },
        { key: "wordCloud", label: "Skill Word Cloud", icon: <FaCloud /> },
        { key: "radarChart", label: "Skill Radar Chart", icon: <FaBullseye /> }
    ];

    if (loading) return <LoadingSpinner />;

    return (
        <div className="bg-graylupa-bg p-6 rounded-2xl text-graylupa-text animate-fadeIn">
            <div className="rounded-2xl bg-graylupa-surface border border-graylupa-border shadow p-6 space-y-6">
                <h1 className="text-3xl font-bold text-gray-800">Analytics & Insights</h1>

                {/* Scrollable analytics buttons */}
                <div className="flex overflow-x-auto gap-2 pb-2">
                    {analyticsOptions.map(opt => (
                        <button
                            key={opt.key}
                            onClick={() => setView(opt.key)}
                            className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full whitespace-nowrap
                transition shadow border
                ${view === opt.key
                                    ? "bg-gray-800 text-white border-gray-700"
                                    : "bg-gray-200 text-black hover:bg-gray-300 border-gray-400"}`}
                        >
                            <span className="text-base">{opt.icon}</span>
                            {opt.label}
                        </button>
                    ))}
                </div>

                {/* Active Analytics Content */}
                <div className="bg-gray-100 p-6 rounded-xl shadow-lg text-black space-y-4 animate-fadeIn">
                    {view === "topCandidates" && (
                        <TopCandidatesTable
                            candidates={candidates}
                            selectedJobs={topCandidatesFilter}
                            onChangeJobs={setTopCandidatesFilter}
                        />
                    )}
                    {view === "scoreExperience" && (
                        <ScoreExperienceChart
                            data={scoreExpPlot}
                            selectedJobs={scoreExpFilter}
                            onChangeJobs={setScoreExpFilter}
                        />
                    )}
                    {view === "mostApplied" && (
                        <MostAppliedJobsTable data={mostApplied} />
                    )}
                    {view === "timeline" && (
                        <ApplicationsTimelineChart data={timelineData} jobs={jobs} />
                    )}
                    {view === "scoreQuality" && (
                        <ScoreQualityDistributions jobTitles={jobs} defaultTab="score" />
                    )}
                    {view === "experienceHistogram" && (
                        <ScoreQualityDistributions jobTitles={jobs} defaultTab="experience" />
                    )}
                    {view === "educationLevels" && (
                        <ScoreQualityDistributions jobTitles={jobs} defaultTab="education" />
                    )}
                    {view === "wordCloud" && (
                        <SkillInsights defaultTab="word" />
                    )}
                    {view === "radarChart" && (
                        <SkillInsights defaultTab="radar" />
                    )}
                </div>
            </div>
        </div>
    );
}
