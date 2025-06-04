export default function TagList({ title, tags, icon }) {
    // Normalize and fallback
    if (!tags || !Array.isArray(tags) || tags.length === 0) return null;

    return (
        <div className="mb-6">
            {/* Section title */}
            <div className="flex items-center gap-2 mb-3 text-lg font-bold text-gray-800">
                {icon}
                {title}
            </div>

            {/* Tag pills */}
            <div className="flex flex-wrap gap-2">
                {tags.map((tag, i) => (
                    <span
                        key={i}
                        className="text-sm font-medium bg-gray-100 border border-gray-300 px-3 py-1.5 rounded-full text-gray-700"
                    >
                        {tag}
                    </span>
                ))}
            </div>
        </div>
    );
}
