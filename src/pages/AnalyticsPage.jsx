import { useEffect, useState } from "react";
import AccordionPanel from "../components/AccordionPanel";
import { FaChartBar, FaUserTie, FaBrain, FaTools, FaFileAlt, FaTable, FaChartLine } from "react-icons/fa";
import TopCandidatesTable from "../components/Tables/TopCandidatesTable";
import ScoreExperienceChart from "../components/charts/ScoreExperienceChart";
import JobFilterDropdown from "../components/JobFilterDropdown";
import CandidateDetail from "../components/candidates/CandidateDetail";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function AnalyticsPage() {
    const { user } = useAuth();
    const [view, setView] = useState("table");
    const [candidates, setCandidates] = useState([]);
    const [scoreExpPlot, setScoreExpPlot] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [jobFilter, setJobFilter] = useState([]);
    const [selectedCandidate, setSelectedCandidate] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const res1 = await api.get("/candidates?client_id=" + user.id);
                const res2 = await api.get("/statistics?client_id=" + user.id);
                const res3 = await api.get("/jobs?client_id=" + user.id);

                const jobTitles = res3.data.map(j => j.title);
                setCandidates(res1.data);
                setScoreExpPlot(res2.data.scoreExperiencePlot || []);
                setJobs(jobTitles);
                setJobFilter(jobTitles); // ✅ Select all jobs by default
            } catch (err) {
                console.error("Error fetching analytics data:", err);
            }
        }
        fetchData();
    }, [user.id]);

    return (
        <div className="bg-blue-50 p-6 rounded-2xl shadow-inner text-black animate-fadeIn space-y-10">
            <h1 className="text-3xl font-bold text-black mb-1">Analytics & Insights</h1>
            <p className="text-gray-700 text-sm mb-6">
                Visualize applicant performance, job demand, and resume trends across all roles. Use these analytics to make faster and smarter hiring decisions.
            </p>

            <AccordionPanel title="Candidate Evaluation Summary" icon={<FaUserTie className="text-blue-700" />}>
                <div className="text-sm text-gray-600 mb-6 max-w-3xl leading-snug">
                    This section highlights your strongest applicants through a ranked list and a scatter plot showing how resume scores relate to experience.
                </div>

                {/* 🔽 Global Job Filter */}
                <div className="mb-6">
                    <JobFilterDropdown
                        jobTitles={jobs}
                        selectedJobs={jobFilter}
                        onChange={setJobFilter}
                    />
                </div>

                {/* 🔁 View Switcher */}
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => setView("table")}
                        className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md border ${view === "table" ? "bg-blue-600 text-white" : "bg-white text-gray-700 border-gray-300"}`}
                    >
                        <FaTable />
                        Top Candidates
                    </button>
                    <button
                        onClick={() => setView("chart")}
                        className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md border ${view === "chart" ? "bg-blue-600 text-white" : "bg-white text-gray-700 border-gray-300"}`}
                    >
                        <FaChartLine />
                        Score vs Experience
                    </button>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl shadow p-6">
                    {view === "table" && (
                        <TopCandidatesTable
                            candidates={candidates}
                            jobOptions={jobs}
                            selectedJobs={jobFilter}
                            onChangeJobs={setJobFilter}
                            onSelectCandidate={(candidate) => setSelectedCandidate(candidate)}
                        />
                    )}

                    {view === "chart" && (
                        <ScoreExperienceChart
                            data={scoreExpPlot}
                            selectedJobs={jobFilter}
                            onChangeJobs={setJobFilter}
                        />
                    )}
                </div>
            </AccordionPanel>

            <AccordionPanel title="Job Performance & Demand" icon={<FaChartBar className="text-purple-700" />}>
                <p className="italic text-gray-600">Visuals on most applied jobs and application trends.</p>
            </AccordionPanel>

            <AccordionPanel title="Score & Quality Distributions" icon={<FaBrain className="text-pink-600" />}>
                <p className="italic text-gray-600">Charts like score buckets, experience histograms, education pies.</p>
            </AccordionPanel>

            <AccordionPanel title="Skill Insights" icon={<FaTools className="text-amber-700" />}>
                <p className="italic text-gray-600">Heatmaps for top technical and soft skills by job title.</p>
            </AccordionPanel>

            <AccordionPanel title="Resume & Authorship Integrity" icon={<FaFileAlt className="text-gray-800" />}>
                <p className="italic text-gray-600">Analysis of AI-generated resumes and writing trust index.</p>
            </AccordionPanel>

            {selectedCandidate && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                    <CandidateDetail candidate={selectedCandidate} onClose={() => setSelectedCandidate(null)} />
                </div>
            )}
        </div>
    );
}
