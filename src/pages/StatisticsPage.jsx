import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import BarChartCard from "../components/charts/BarChartCard";
import PieChartCard from "../components/charts/PieChartCard";
import ScatterChartCard from "../components/charts/ScatterChartCard";
import ExportButtons from "../components/ExportButtons";
import FilterPanel from "../components/FilterPanel";

export default function StatisticsPage() {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [jobTitles, setJobTitles] = useState([]);
    const [filteredStats, setFilteredStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const jobChartRef = useRef();

    useEffect(() => {
        async function fetchData() {
            const res = await fetch(`http://localhost:5000/statistics?client_id=${user.id}`);
            const statData = await res.json();
            setStats(statData);
            setFilteredStats(statData); // default
            setLoading(false);
        }

        async function fetchJobs() {
            const res = await fetch(`http://localhost:5000/jobs?client_id=${user.id}`);
            const data = await res.json();
            setJobTitles(data.map(j => j.title));
        }

        fetchData();
        fetchJobs();
    }, [user.id]);

    const handleFilterChange = (filters) => {
        if (!stats) return;

        const {
            jobTitle,
            maxScore,
            maxExp,
            fromDate,
            toDate
        } = filters;

        const inRange = (value, max) => !max || value <= max;

        const filteredPlot = stats.scoreExperiencePlot.filter(c =>
            (!jobTitle || c.job_title === jobTitle) &&
            inRange(c.score, maxScore) &&
            inRange(c.experience, maxExp)
        );

        const filteredJobDist = jobTitle
            ? stats.jobDistribution.filter(j => j.title === jobTitle)
            : stats.jobDistribution;

        const filteredStats = {
            ...stats,
            scoreExperiencePlot: filteredPlot,
            jobDistribution: filteredJobDist,
            // You can apply similar filters for other charts if needed
        };

        setFilteredStats(filteredStats);
    };

    if (loading) return <p className="text-white">Loading statistics...</p>;
    if (!filteredStats) return <p className="text-red-500">No data available.</p>;

    return (
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl text-white animate-fadeIn space-y-10">
            <h1 className="text-3xl font-bold">Statistics</h1>

            <FilterPanel jobTitles={jobTitles} onFilterChange={handleFilterChange} />

            <section>
                <h2 className="text-xl font-semibold mb-3">Core Candidate Metrics</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <BarChartCard
                        title="Experience Distribution"
                        data={filteredStats.experienceDistribution}
                        xKey="range"
                        yKey="count"
                    />
                    <BarChartCard
                        title="Skill Match Rate"
                        data={filteredStats.skillMatchBuckets}
                        xKey="range"
                        yKey="count"
                    />
                    <BarChartCard
                        title="Score Distribution"
                        data={filteredStats.scoreBuckets}
                        xKey="range"
                        yKey="count"
                    />
                    <div ref={jobChartRef}>
                        <BarChartCard
                            title="Job Volume by Title"
                            data={filteredStats.jobDistribution}
                            xKey="title"
                            yKey="count"
                        />
                    </div>
                    <ExportButtons
                        data={filteredStats.jobDistribution}
                        fileName="JobVolumeByTitle"
                        targetRef={jobChartRef}
                    />
                </div>
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-3">Filtering & Comparison</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <ScatterChartCard
                        title="Score vs. Experience"
                        data={filteredStats.scoreExperiencePlot}
                        xKey="experience"
                        yKey="score"
                    />
                    <PieChartCard
                        title="Cover Letter Authenticity"
                        data={filteredStats.authenticityPie}
                        nameKey="label"
                        valueKey="value"
                    />
                    <PieChartCard
                        title="Education Breakdown"
                        data={filteredStats.educationPie}
                        nameKey="level"
                        valueKey="count"
                    />
                </div>
            </section>
        </div>
    );
}
