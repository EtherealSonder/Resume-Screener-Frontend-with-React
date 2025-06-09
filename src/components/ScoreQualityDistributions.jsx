import { useState, useEffect, useRef } from "react";
import BarChartCard from "../components/charts/BarChartCard";
import PieChartCard from "../components/charts/PieChartCard";
import LoadingSpinner from "../components/Candidates/LoadingSpinner";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import ExportButtons from "../components/ExportButtons";

export default function ScoreQualityDistributions({ jobTitles, defaultTab }) {
    const { user } = useAuth();
    const [selectedJob, setSelectedJob] = useState("All Jobs");
    const [loading, setLoading] = useState(false);

    const [scoreBuckets, setScoreBuckets] = useState([]);
    const [experienceRanges, setExperienceRanges] = useState([]);
    const [educationLevels, setEducationLevels] = useState([]);

    const chartRef = useRef();

    const experienceRangesOrder = ["0", "0 - 1", "1 - 2", "2 - 4", "4 - 7", "7 - 10", "10 - 15", "15+"];
    const experienceLabels = ["Fresher", "Beginner", "Junior", "Mid-Level", "Experienced", "Advanced", "Expert", "Veteran"];

    const getScoreColor = (scoreRange) => {
        const start = parseInt(scoreRange.split("-")[0]);
        if (start <= 20) return "#b91c1c";
        if (start <= 40) return "#f87171";
        if (start <= 60) return "#facc15";
        if (start <= 80) return "#84cc16";
        return "#16a34a";
    };

    const getExperienceColor = (range) => {
        const idx = experienceRangesOrder.indexOf(range);
        const gradient = [
            "#b91c1c", "#f87171", "#facc15", "#84cc16", "#16a34a", "#15803d", "#0d9488", "#0ea5e9"
        ];
        return gradient[idx % gradient.length];
    };

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

                const sortedScores = res.data.scoreBuckets.map(bucket => {
                    if (bucket.range === "90-99") bucket.range = "90-100";
                    return {
                        ...bucket,
                        fill: getScoreColor(bucket.range)
                    };
                }).sort((a, b) => parseInt(a.range.split("-")[0]) - parseInt(b.range.split("-")[0]));

                const orderedExperience = experienceRangesOrder.map((range, i) => {
                    const match = res.data.experienceHistogram.find(e => e.range === range);
                    return {
                        range,
                        count: match ? match.count : 0,
                        level: experienceLabels[i],
                        fill: getExperienceColor(range)
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
    }, [selectedJob, user.id]);

    return (
        <div className="space-y-4 fade-in">
            {defaultTab === "score" && (
                <>
                    <h2 className="text-xl font-semibold text-gray-800">Score Buckets Distribution</h2>
                    <p className="text-sm text-gray-600">Displays how candidate scores are spread across defined ranges.</p>
                </>
            )}
            {defaultTab === "experience" && (
                <>
                    <h2 className="text-xl font-semibold text-gray-800">Experience Level Bar Chart</h2>
                    <p className="text-sm text-gray-600">Shows distribution of candidates by years of experience.</p>
                </>
            )}
            {defaultTab === "education" && (
                <>
                    <h2 className="text-xl font-semibold text-gray-800">Education Level Breakdown</h2>
                    <p className="text-sm text-gray-600">Displays highest education levels achieved by candidates.</p>
                </>
            )}

            <div className="flex justify-between items-center">
                <div className="flex gap-4 items-center">
                    <label className="text-sm font-medium text-gray-700">Filter by Job:</label>
                    <select
                        value={selectedJob}
                        onChange={(e) => setSelectedJob(e.target.value)}
                        className="border rounded px-3 py-2 text-sm w-64"
                    >
                        <option value="All Jobs">All Jobs</option>
                        {jobTitles.map((title, idx) => (
                            <option key={idx} value={title}>{title}</option>
                        ))}
                    </select>
                </div>
                <ExportButtons targetRef={chartRef} fileName={defaultTab === "score" ? "Score_Buckets_Distribution" : defaultTab === "experience" ? "Experience_Level_Bar_Chart" : "Education_Level_Breakdown"} exportPNGOnly />
            </div>

            {loading ? (
                <LoadingSpinner />
            ) : (
                <div ref={chartRef} className="bg-gray-100 p-6 rounded-xl shadow">
                    {defaultTab === "score" && (
                        <BarChartCard
                            data={scoreBuckets}
                            xKey="range"
                            dataKey="count"
                            xLabel="Score Range"
                            yLabel="Number of Candidates"
                        />
                    )}
                    {defaultTab === "experience" && (
                        <BarChartCard
                            data={experienceRanges}
                            xKey="range"
                            dataKey="count"
                            xLabel="Years of Experience"
                            yLabel="Candidate Count"
                            tooltipFormatter={(value, name, props) => `${props.payload.level} - ${value} candidates`}
                        />
                    )}
                    {defaultTab === "education" && (
                        <PieChartCard
                            data={educationLevels}
                            nameKey="label"
                            valueKey="value"
                            showLegend={true}
                        />
                    )}
                </div>
            )}
        </div>
    );
}
