import { useEffect, useState } from "react";
import {
    FaChartBar, FaUserTie, FaBrain, FaTable, FaChartLine,
    FaCloud, FaBullseye, FaUserClock, FaGraduationCap,
    FaUsers, FaBriefcase
} from "react-icons/fa";
import TopCandidatesTable from "../components/Tables/TopCandidatesTable";
import ApplicationsTimelineChart from "../components/charts/ApplicationsTimelineChart";
import ScoreExperienceChart from "../components/charts/ScoreExperienceChart";
import MostAppliedJobsTable from "../components/Tables/MostAppliedJobsTable";
import ScoreQualityDistributions from "../components/ScoreQualityDistributions";
import SkillInsights from "../components/charts/SkillInsights";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import LoadingSpinner from "../components/Candidates/LoadingSpinner";
import MiniMetricCard from "../components/MiniMetricCard";

export default function AnalyticsPage() {
    const { user } = useAuth();
    const [view, setView] = useState("topCandidates");
    const [candidates, setCandidates] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [timelineData, setTimelineData] = useState([]);
    const [scoreExpPlot, setScoreExpPlot] = useState([]);
    const [mostApplied, setMostApplied] = useState([]);
    const [totalCandidates, setTotalCandidates] = useState(0);
    const [totalJobs, setTotalJobs] = useState(0);
    const [loading, setLoading] = useState(true);

    const [candidatesPctChange, setCandidatesPctChange] = useState(0);
    const [jobsPctChange, setJobsPctChange] = useState(0);
    const [candidatesMiniGraphData, setCandidatesMiniGraphData] = useState([]);
    const [jobsMiniGraphData, setJobsMiniGraphData] = useState([]);

    const [selectedJobs, setSelectedJobs] = useState(["All Jobs"]);

    useEffect(() => {
        async function fetchData() {
            try {
                const res1 = await api.get(`/candidates?client_id=${user.id}`);
                const res2 = await api.get(`/jobs?client_id=${user.id}`);
                const res3 = await api.get(`/statistics?client_id=${user.id}`);
                const res4 = await api.get(`/dashboard?client_id=${user.id}`);

                setCandidates(res1.data);
                setJobs(res2.data);
                setTimelineData(res3.data.applicationTimeline || []);
                setScoreExpPlot(res3.data.scoreExperiencePlot || []);
                setMostApplied(res3.data.mostAppliedJobs || []);
                setTotalCandidates(res1.data.length);
                setTotalJobs(res2.data.length);

                // Updated: Set real-time metrics from /dashboard
                setCandidatesPctChange(res4.data.candidates.percentage_change);
                setJobsPctChange(res4.data.jobs.percentage_change);
                setCandidatesMiniGraphData(res4.data.candidates.mini_graph_data);
                setJobsMiniGraphData(res4.data.jobs.mini_graph_data);

            } catch (err) {
                console.error("Error fetching overview data:", err);
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
        { key: "scoreQuality", label: "Score Buckets Distribution", icon: <FaBrain /> },
        { key: "experienceHistogram", label: "Experience Histogram", icon: <FaUserClock /> },
        { key: "educationLevels", label: "Education Level Breakdown", icon: <FaGraduationCap /> },
        { key: "wordCloud", label: "Skill Word Cloud", icon: <FaCloud /> },
        { key: "radarChart", label: "Skill Radar Chart", icon: <FaBullseye /> }
    ];

    if (loading) return <LoadingSpinner />;

    return (
        <div className="bg-graylupa-bg p-6 rounded-2xl text-graylupa-text animate-fadeIn space-y-6">
            {/* Overview Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MiniMetricCard
                    icon={<FaUsers size={24} className="text-gray-700" />}
                    title="Total Candidates"
                    value={totalCandidates}
                    percentageChange={candidatesPctChange}
                    miniGraphData={candidatesMiniGraphData}
                />
                <MiniMetricCard
                    icon={<FaBriefcase size={24} className="text-gray-700" />}
                    title="Total Jobs"
                    value={totalJobs}
                    percentageChange={jobsPctChange}
                    miniGraphData={jobsMiniGraphData}
                />
            </div>

            {/* Applications Timeline Section */}
            <div className="rounded-2xl bg-graylupa-surface border border-graylupa-border shadow p-6 space-y-4">
                <h1 className="text-3xl font-bold text-gray-800">Applications Timeline</h1>
                <p className="text-sm text-gray-600">
                    Tracks the volume of applications over time with filters for job title and date range.
                </p>
                <ApplicationsTimelineChart data={timelineData} jobs={jobs.map(j => j.title)} />
            </div>

            {/* Analytics Section */}
            <div className="rounded-2xl bg-graylupa-surface border border-graylupa-border shadow p-6 space-y-4">
                <h1 className="text-3xl font-bold text-gray-800">Analytics & Insights</h1>
                <p className="text-sm text-gray-600">
                    Dive deeper into the performance and trends of your candidates, job postings, and skill match data.
                </p>

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

                <div className="bg-gray-100 p-6 rounded-xl shadow-lg text-black space-y-4 animate-fadeIn">
                    {view === "topCandidates" && (
                        <TopCandidatesTable
                            candidates={candidates}
                            selectedJobs={selectedJobs}
                            onChangeJobs={setSelectedJobs}
                        />
                    )}
                    {view === "scoreExperience" && (
                        <ScoreExperienceChart
                            data={scoreExpPlot}
                            selectedJobs={selectedJobs}
                            onChangeJobs={setSelectedJobs}
                        />
                    )}
                    {view === "mostApplied" && (
                        <MostAppliedJobsTable data={mostApplied} />
                    )}
                    {view === "scoreQuality" && (
                        <ScoreQualityDistributions jobTitles={jobs.map(j => j.title)} defaultTab="score" />
                    )}
                    {view === "experienceHistogram" && (
                        <ScoreQualityDistributions jobTitles={jobs.map(j => j.title)} defaultTab="experience" />
                    )}
                    {view === "educationLevels" && (
                        <ScoreQualityDistributions jobTitles={jobs.map(j => j.title)} defaultTab="education" />
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
