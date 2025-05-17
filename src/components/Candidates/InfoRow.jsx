// components/candidates/InfoRow.jsx
import { FaEnvelope, FaPhone, FaCalendarAlt } from "react-icons/fa";

export default function InfoRow({ email, phone, date }) {
    return (
        <div className="flex flex-wrap gap-4 text-sm text-gray-700 items-center mb-4">
            <div className="flex items-center gap-2">
                <FaEnvelope className="text-blue-500" />
                {email}
            </div>
            {phone && (
                <div className="flex items-center gap-2">
                    <FaPhone className="text-blue-500" />
                    {phone}
                </div>
            )}
            {date && (
                <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-blue-500" />
                    {new Date(date).toLocaleDateString()}
                </div>
            )}
        </div>
    );
}
