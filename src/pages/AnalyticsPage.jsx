import { useEffect, useState, useRef } from "react";
import AccordionPanel from "../components/AccordionPanel";
import {
    FaChartBar,
    FaUserTie,
    FaBrain,
    FaTools,
    FaTable,
    FaChartLine,
    FaCloud,
    FaBullseye,
    FaUserClock,
    FaGraduationCap
} from "react-icons/fa";
import TopCandidatesTable from "../components/Tables/TopCandidatesTable";
import ScoreExperienceChart from "../components/charts/ScoreExperienceChart";
import MostAppliedJobsTable from "../components/Tables/MostAppliedJobsTable";
import ApplicationsTimelineChart from "../components/charts/ApplicationsTimelineChart";
import JobFilterDropdown from "../components/JobFilterDropdown";
import CandidateDetail from "../components/candidates/CandidateDetail";
import ScoreQualityDistributions from "../components/ScoreQualityDistributions";
import SkillInsights from "../components/charts/SkillInsights";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import LoadingSpinner from "../components/candidates/LoadingSpinner";

export default function AnalyticsPage() {
    const { user } = useAuth();
    const [view, setView] = useState("table");
    const [viewJobs, setViewJobs] = useState("jobsTable");
    const [selectedScoreQualityTab, setSelectedScoreQualityTab] = useState("score");
    const [selectedSkillTab, setSelectedSkillTab] = useState("word");
    const [candidates, setCandidates] = useState([]);
    const [scoreExpPlot, setScoreExpPlot] = useState([]);
    const [mostApplied, setMostApplied] = useState([]);
    const [timelineData, setTimelineData] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [jobFilter, setJobFilter] = useState([]);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [openSection, setOpenSection] = useState("");
    const refs = {
        topCandidates: useRef(),
        mostApplied: useRef(),
        scoreQuality: useRef(),
        skills: useRef()
    };

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
                setJobFilter(jobTitles);
            } catch (err) {
                console.error("Error fetching analytics data:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [user.id]);

    const jumpToOptions = [
        { label: "Top Candidates", icon: <FaTable />, sectionKey: "topCandidates", sub: "table" },
        { label: "Score vs Experience", icon: <FaChartLine />, sectionKey: "topCandidates", sub: "chart" },
        { label: "Most Applied Jobs", icon: <FaChartBar />, sectionKey: "mostApplied", sub: "jobsTable" },
        { label: "Application Timeline", icon: <FaChartLine />, sectionKey: "mostApplied", sub: "timeline" },
        { label: "Score Buckets", icon: <FaBrain />, sectionKey: "scoreQuality", sub: "score" },
        { label: "Experience Histogram", icon: <FaUserClock />, sectionKey: "scoreQuality", sub: "experience" },
        { label: "Education Levels", icon: <FaGraduationCap />, sectionKey: "scoreQuality", sub: "education" },
        { label: "Word Cloud", icon: <FaCloud />, sectionKey: "skills", sub: "word" },
        { label: "Radar Chart", icon: <FaBullseye />, sectionKey: "skills", sub: "radar" }
    ];

    const jumpToAnalytics = (opt) => {
        setOpenSection(opt.sectionKey);
        if (opt.sectionKey === "topCandidates") setView(opt.sub);
        if (opt.sectionKey === "mostApplied") setViewJobs(opt.sub);
        if (opt.sectionKey === "scoreQuality") setSelectedScoreQualityTab(opt.sub);
        if (opt.sectionKey === "skills") setSelectedSkillTab(opt.sub);
        const el = refs[opt.sectionKey]?.current;
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="bg-graylupa-bg p-6 rounded-2xl text-graylupa-text animate-fadeIn">
            <div className="rounded-2xl bg-graylupa-surface border border-graylupa-border shadow p-6 transition-all duration-300 space-y-6">
                <h1 className="text-3xl font-bold text-gray-800">Analytics & Insights</h1>

                {/* Jump to Analytics */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {jumpToOptions.map((opt, idx) => (
                        <button
                            key={idx}
                            onClick={() => jumpToAnalytics(opt)}
                            className="flex items-center gap-2 text-xs px-3 py-1 border border-gray-300 rounded-full shadow-sm hover:bg-gray-100 transition"
                        >
                            <span className="text-base">{opt.icon}</span>
                            {opt.label}
                        </button>
                    ))}
                </div>

                <p className="text-graylupa-muted text-sm mb-4">
                    Visualize applicant performance, job demand, and trends across all roles.
                </p>

                {/* Section 1: Candidate Evaluation */}
                <div ref={refs.topCandidates}>
                    <AccordionPanel
                        title="Candidate Evaluation Summary"
                        icon={<FaUserTie className="text-blue-700" />}
                        forceOpen={openSection === "topCandidates"}
                    >
                        <JobFilterDropdown jobTitles={jobs} selectedJobs={jobFilter} onChange={setJobFilter} />
                        <div className="flex gap-4 mb-4">
                            <button
                                onClick={() => setView("table")}
                                className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md border ${view === "table" ? "bg-blue-600 text-white" : "bg-white text-gray-700 border-gray-300"}`}
                            >
                                <FaTable /> Top Candidates
                            </button>
                            <button
                                onClick={() => setView("chart")}
                                className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md border ${view === "chart" ? "bg-blue-600 text-white" : "bg-white text-gray-700 border-gray-300"}`}
                            >
                                <FaChartLine /> Score vs Experience
                            </button>
                        </div>
                        {view === "table" ? (
                            <TopCandidatesTable candidates={candidates} selectedJobs={jobFilter} onChangeJobs={setJobFilter} onSelectCandidate={setSelectedCandidate} />
                        ) : (
                            <ScoreExperienceChart data={scoreExpPlot} selectedJobs={jobFilter} />
                        )}
                    </AccordionPanel>
                </div>

                {/* Section 2: Job Performance & Demand */}
                <div ref={refs.mostApplied}>
                    <AccordionPanel
                        title="Job Performance & Demand"
                        icon={<FaChartBar className="text-purple-700" />}
                        forceOpen={openSection === "mostApplied"}
                    >
                        <div className="flex gap-4 mb-4">
                            <button
                                onClick={() => setViewJobs("jobsTable")}
                                className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md border ${viewJobs === "jobsTable" ? "bg-purple-700 text-white" : "bg-white text-gray-700 border-gray-300"}`}
                            >
                                <FaTable /> Most Applied Jobs
                            </button>
                            <button
                                onClick={() => setViewJobs("timeline")}
                                className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md border ${viewJobs === "timeline" ? "bg-purple-700 text-white" : "bg-white text-gray-700 border-gray-300"}`}
                            >
                                <FaChartLine /> Application Timeline
                            </button>
                        </div>
                        {viewJobs === "jobsTable" ? (
                            <MostAppliedJobsTable data={mostApplied} />
                        ) : (
                            <ApplicationsTimelineChart data={timelineData} jobs={jobs} />
                        )}
                    </AccordionPanel>
                </div>

                {/* Section 3: Score & Quality Distributions */}
                <div ref={refs.scoreQuality}>
                    <AccordionPanel
                        title="Score & Quality Distributions"
                        icon={<FaBrain className="text-pink-600" />}
                        forceOpen={openSection === "scoreQuality"}
                    >
                        <ScoreQualityDistributions jobTitles={jobs} defaultTab={selectedScoreQualityTab} />
                    </AccordionPanel>
                </div>

                {/* Section 4: Skill Insights */}
                <div ref={refs.skills}>
                    <AccordionPanel
                        title="Skill Insights"
                        icon={<FaTools className="text-amber-700" />}
                        forceOpen={openSection === "skills"}
                    >
                        <SkillInsights defaultTab={selectedSkillTab} />
                    </AccordionPanel>
                </div>
            </div>

            {selectedCandidate && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                    <CandidateDetail candidate={selectedCandidate} onClose={() => setSelectedCandidate(null)} />
                </div>
            )}
        </div>
    );
}
