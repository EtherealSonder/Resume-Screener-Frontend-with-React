import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip } from "recharts";

export default function SkillBubbleChart({ data }) {
    const transformed = data.map((d, i) => ({
        x: i,
        y: d.count,
        z: d.count,
        label: d.skill
    }));

    return (
        <div className="bg-white p-6 rounded-xl shadow mb-6">
            <h2 className="text-xl font-semibold mb-4">Skill Frequency (Bubble Chart)</h2>
            <ResponsiveContainer width="100%" height={400}>
                <ScatterChart margin={{ top: 10, right: 10, bottom: 40, left: 10 }}>
                    <XAxis dataKey="x" type="number" tickFormatter={(v) => transformed[v]?.label || ""} interval={0} tick={{ fontSize: 12 }} />
                    <YAxis dataKey="y" name="Candidate Count" />
                    <ZAxis dataKey="z" range={[100, 1000]} />
                    <Tooltip formatter={(val, name, props) => [`${props.payload.label}`, "Skill"]} />
                    <Scatter data={transformed} fill="#60a5fa" />
                </ScatterChart>
            </ResponsiveContainer>
        </div>
    );
}
