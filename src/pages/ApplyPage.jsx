import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

export default function ApplyPage() {
    const { job_id } = useParams();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        resume: null,
        coverLetter: "",
    });
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [jobTitle, setJobTitle] = useState("");

    // ✅ Fetch job title using /jobs/:id
    useEffect(() => {
        async function fetchJobTitle() {
            try {
                const res = await api.get(`/jobs/${job_id}`);
                console.log("Fetched job data:", res.data); 
                setJobTitle(res.data.job_title || res.data.title || ""); // or res.data.title depending on your backend
            } catch (err) {
                console.error("Failed to fetch job title:", err);
            }
        }
        fetchJobTitle();
    }, [job_id]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.resume) {
            alert("Resume is required");
            return;
        }

        const data = new FormData();
        data.append("resume", formData.resume);
        data.append("job_id", job_id);
        data.append("cover_letter", formData.coverLetter);

        try {
            setLoading(true);
            const res = await api.post("/parse_resume", data, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setResponse(res.data);
        } catch (err) {
            alert("Error submitting application.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded">
            <h2 className="text-2xl font-semibold mb-4">
                {jobTitle ? `Apply for Job – "${jobTitle}"` : "Loading..."}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    className="w-full border px-3 py-2 rounded"
                    onChange={handleChange}
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="w-full border px-3 py-2 rounded"
                    onChange={handleChange}
                />
                <input
                    type="tel"
                    name="phone"
                    placeholder="Phone"
                    className="w-full border px-3 py-2 rounded"
                    onChange={handleChange}
                />
                <input
                    type="file"
                    name="resume"
                    accept=".pdf"
                    className="w-full"
                    onChange={handleChange}
                    required
                />
                <textarea
                    name="coverLetter"
                    rows={4}
                    placeholder="Cover Letter (optional)"
                    className="w-full border px-3 py-2 rounded"
                    onChange={handleChange}
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    {loading ? "Submitting..." : "Submit Application"}
                </button>
            </form>

            {response && (
                <div className="mt-6 border-t pt-4">
                    <h3 className="text-lg font-semibold mb-2">Parsed Result:</h3>
                    <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto max-h-[80vh] whitespace-pre-wrap">
                        {JSON.stringify(response, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
}
