import {
    FaTimes,
    FaExternalLinkAlt,
    FaDownload,
    FaUser,
    FaBriefcase,
    FaGraduationCap,
    FaEnvelope,
    FaPhone,
    FaSuitcase,
} from "react-icons/fa";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useRef } from "react";

import InfoRow from "./InfoRow";
import DonutScore from "./DonutScore";
import SummaryCard from "./SummaryCard";
import TwoColumnBox from "./TwoColumnBox";
import TagList from "./TagList";
import ModalPortal from "../ModalPortal";
import CoverLetterAnalysis from "./CoverLetterAnalysis";

function parseTags(raw) {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    if (typeof raw !== "string") raw = String(raw);

    try {
        if (raw.startsWith("{") && raw.endsWith("}")) {
            return raw
                .replace(/^{|}$/g, "")
                .split(/","|','|",|',|,/)
                .map((s) => s.replace(/^"|'|"$|'$/g, "").trim())
                .filter(Boolean);
        }

        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
    } catch { }

    return raw
        .replace(/[\[\]{}\"]+/g, "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
}

export default function CandidateDetail({ candidate, onClose }) {
    const contentRef = useRef();
    const technicalSkills = parseTags(candidate.technical_skills);
    const softSkills = parseTags(candidate.soft_skills);

    const handleDownloadPDF = async () => {
        const element = contentRef.current;
        if (!element) return;

        const canvas = await html2canvas(element, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
        const pageWidth = pdf.internal.pageSize.getWidth();
        const imgWidth = pageWidth - 40;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 20, 20, imgWidth, imgHeight);
        pdf.save(`${candidate.name}_Resume_Report.pdf`);
    };

    return (
        <ModalPortal>
            <div className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm flex items-center justify-center">
                <div className="relative bg-gray-50 w-full max-w-5xl max-h-[95vh] rounded-2xl shadow-2xl p-8 overflow-y-auto animate-fade-scale">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6 sticky top-0 bg-gray-50 z-10 pb-2 border-b border-gray-200">
                        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                            <FaUser className="text-gray-500" />
                            {candidate.name}
                        </h2>
                        <button className="text-gray-500 hover:text-red-500 text-2xl" onClick={onClose}>
                            <FaTimes />
                        </button>
                    </div>

                    {/* BEGIN: Downloadable Content */}
                    <div ref={contentRef}>
                        {/* Job title */}
                        <p className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                            <FaSuitcase className="text-gray-500" />
                            {candidate.job_title}
                        </p>

                        {/* Info Row (first line with icons) */}
                        <div className="flex flex-wrap gap-x-8 gap-y-2 mb-2 text-sm text-gray-700 items-center">
                            {candidate.email && (
                                <div className="flex items-center gap-2 text-gray-700">
                                    <FaEnvelope className="text-gray-600 text-base" />
                                    {candidate.email}
                                </div>
                            )}
                            {candidate.phone && (
                                <div className="flex items-center gap-2 text-gray-700">
                                    <FaPhone className="text-gray-600 text-base" />
                                    {candidate.phone}
                                </div>
                            )}
                            {candidate.education && (
                                <div className="flex items-center gap-2 text-gray-700">
                                    <FaGraduationCap className="text-gray-600 text-base" />
                                    {candidate.education}
                                </div>
                            )}
                        </div>

                        {/* Info Row (second line without icons) */}
                        <div className="text-sm text-gray-700 mb-6 space-x-6">
                            {candidate.submitted_at && (
                                <span>
                                    <strong>Application submitted on:</strong> {candidate.submitted_at}
                                </span>
                            )}
                            {candidate.experience && (
                                <span>
                                    <strong>Work Experience:</strong> {candidate.experience} years
                                </span>
                            )}
                        </div>

                        {/* Links */}
                        <div className="flex flex-wrap gap-4 mb-6">
                            {candidate.portfolio_url && (
                                <a href={candidate.portfolio_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                                    Portfolio <FaExternalLinkAlt className="text-sm" />
                                </a>
                            )}
                            {candidate.github_url && (
                                <a href={candidate.github_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                                    GitHub <FaExternalLinkAlt className="text-sm" />
                                </a>
                            )}
                            {candidate.linkedin_url && (
                                <a href={candidate.linkedin_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                                    LinkedIn <FaExternalLinkAlt className="text-sm" />
                                </a>
                            )}
                        </div>

                        {/* Donut Score Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 justify-items-center">
                            <DonutScore label="Candidate Match" score={candidate.score || 0} breakdown={candidate.score_breakdown} />
                            <DonutScore label="Skill Match %" score={candidate.skill_match || 0} breakdown={candidate.skill_match_breakdown} />
                            <DonutScore label="Resume Quality" score={candidate.resume_quality_score || 0} breakdown={candidate.resume_quality_breakdown} />
                        </div>

                        {/* Summary & Strengths/Weaknesses */}
                        {candidate.summary && <SummaryCard summary={candidate.summary} />}
                        <TwoColumnBox strengths={candidate.strengths} weaknesses={candidate.weaknesses} />

                        {/* Skills */}
                        <TagList title="Technical Skills" tags={technicalSkills} icon={<span className="text-gray-500">💼</span>} />
                        <TagList title="Soft Skills" tags={softSkills} icon={<span className="text-gray-500">🤝</span>} />

                        {/* Cover Letter Analysis */}
                        {candidate.cover_letter_analysis && (
                            <>
                                <hr className="my-6" />
                                <CoverLetterAnalysis report={candidate.cover_letter_analysis} score={candidate.ai_writing_score || 0} />
                            </>
                        )}

                        {/* Action Buttons */}
                        <div className="mt-8 flex flex-wrap gap-4 justify-end">
                            {candidate.resume_url && (
                                <a
                                    href={candidate.resume_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded hover:bg-blue-700 font-semibold text-sm"
                                >
                                    <FaDownload />
                                    Download Resume
                                </a>
                            )}
                            <button
                                onClick={handleDownloadPDF}
                                className="inline-flex items-center gap-2 bg-green-600 text-white px-5 py-3 rounded hover:bg-green-700 font-semibold text-sm"
                            >
                                <FaDownload />
                                Download Report
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </ModalPortal>
    );
}
