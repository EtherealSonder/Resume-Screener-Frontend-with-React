import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function RubricBreakdownChart({ data }) {
    const rubricData = [
        { label: "Resume Quality", value: data.avg_resume_quality },
        { label: "Skill Match %", value: data.avg_skill_match },
        { label: "Experience (Years)", value: data.avg_experience },
        { label: "Education Level", value: data.avg_education_level_score },
        { label: "Certifications", value: data.avg_certification_score },
        { label: "Soft Skills", value: data.avg_soft_skills_score },
    ];

    return (
        <div className="bg-white p-6 rounded-xl shadow text-black">
            <h2 className="text-lg font-semibold mb-4">Rubric Match Breakdown</h2>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={rubricData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" stroke="#000" />
                    <YAxis stroke="#000" />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
