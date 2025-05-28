import { useEffect, useRef, useState } from "react";
import { Chart, DoughnutController, ArcElement, Tooltip, Title } from "chart.js";

Chart.register(DoughnutController, ArcElement, Tooltip, Title);

export default function CoverLetterGauge({ clientId }) {
    const chartRef = useRef(null);
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState("");

    useEffect(() => {
        const fetchJobs = async () => {
            const res = await fetch(`/jobs?client_id=${clientId}`);
            const data = await res.json();
            setJobs(data.map(j => j.title));
        };

        fetchJobs();
    }, [clientId]);

    useEffect(() => {
        const fetchTopJob = async () => {
            const res = await fetch(`/analytics/cover_letter_quality?client_id=${clientId}`);
            const data = await res.json();
            setSelectedJob(data.top_job || (jobs.length > 0 ? jobs[0] : ""));
        };

        fetchTopJob();
    }, [clientId, jobs]);

    useEffect(() => {
        const fetchData = async () => {
            if (!selectedJob) return;

            const res = await fetch(`/analytics/cover_letter_quality?client_id=${clientId}&job_title=${encodeURIComponent(selectedJob)}`);
            const data = await res.json();
            const avgScore = data.average_cover_letter_score || 0;

            if (chartRef.current) {
                chartRef.current.destroy();
            }

            const ctx = document.getElementById("coverLetterGaugeChart").getContext("2d");
            chartRef.current = new Chart(ctx, {
                type: "doughnut",
                data: {
                    datasets: [
                        { data: [avgScore, 100 - avgScore], backgroundColor: ["#22c55e", "#e5e7eb"], borderWidth: 0 },
                    ],
                },
                options: {
                    cutout: "80%",
                    plugins: {
                        tooltip: { enabled: false },
                        legend: { display: false },
                        title: {
                            display: true,
                            text: `Average Score: ${avgScore}%`,
                            color: "#374151",
                            font: { size: 16 },
                        },
                    },
                },
            });
        };

        fetchData();

        return () => { if (chartRef.current) chartRef.current.destroy(); };
    }, [clientId, selectedJob]);

    return (
        <div className="flex flex-col items-center">
            <label className="text-sm mb-2">Filter by Job:</label>
            <select
                value={selectedJob}
                onChange={(e) => setSelectedJob(e.target.value)}
                className="mb-4 border rounded px-2 py-1"
            >
                {jobs.map(job => <option key={job}>{job}</option>)}
            </select>
            <canvas id="coverLetterGaugeChart" className="w-48 h-48" />
        </div>
    );
}
