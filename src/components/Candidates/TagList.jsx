// components/candidates/TagList.jsx
export default function TagList({ title, tags, icon }) {
    if (!tags || tags.length === 0) return null;

    return (
        <div className="mb-4">
            {/* Only the title is bold */}
            <div className="flex items-center gap-2 mb-2 text-sm text-gray-700 font-bold">
                {icon} {title}
            </div>
            <div className="flex flex-wrap gap-2">
                {tags.map((tag, i) => (
                    <span
                        key={i}
                        className="text-xs bg-gray-100 border border-gray-300 px-2 py-1 rounded-full text-gray-700"
                    >
                        {tag}
                    </span>
                ))}
            </div>
        </div>
    );
}
