// components/candidates/CandidateDetail.jsx
import {
    FaTimes,
    FaExternalLinkAlt,
    FaDownload,
    FaUser,
} from "react-icons/fa";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useRef } from "react";

import InfoRow from "./InfoRow";
import ScoreBar from "./ScoreBar";
import SkillsBar from "./SkillsBar";
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
        .replace(/[\[\]{}"]/g, "")
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

        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "pt",
            format: "a4",
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const imgWidth = pageWidth - 40;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 20, 20, imgWidth, imgHeight);
        pdf.save(`${candidate.name}_Resume_Report.pdf`);
    };

    return (
        <ModalPortal>
            <div className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm flex items-center justify-center">
                <div className="relative bg-white w-full max-w-5xl max-h-[95vh] rounded-2xl shadow-2xl p-8 overflow-y-auto animate-fade-scale">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6 sticky top-0 bg-white z-10 pb-2 border-b border-gray-200">
                        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                            <FaUser className="text-blue-600" />
                            {candidate.name}
                        </h2>
                        <button
                            className="text-gray-500 hover:text-red-500 text-2xl"
                            onClick={onClose}
                        >
                            <FaTimes />
                        </button>
                    </div>

                    {/* BEGIN: Downloadable Content */}
                    <div ref={contentRef}>
                        {/* Contact Info */}
                        <InfoRow
                            email={candidate.email}
                            phone={candidate.phone}
                            date={candidate.submitted_at}
                        />

                        {/* Score */}
                        <ScoreBar label="Candidate Score" score={candidate.score} />

                        {/* Summary */}
                        {candidate.summary && <SummaryCard summary={candidate.summary} />}

                        {/* Strengths & Weaknesses */}
                        <TwoColumnBox
                            strengths={candidate.strengths}
                            weaknesses={candidate.weaknesses}
                        />

                        {/* Skill Match */}
                        <SkillsBar percentage={candidate.skill_match || 0} />

                        {/* Experience, Education, Portfolio */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <h4 className="text-base font-bold text-gray-700 mb-1">Experience</h4>
                                <p className="text-base text-gray-800">{candidate.experience} yrs</p>
                            </div>
                            <div>
                                <h4 className="text-base font-bold text-gray-700 mb-1">Education</h4>
                                <p className="text-base text-gray-800">{candidate.education}</p>
                            </div>
                            {candidate.portfolio_url && (
                                <div className="col-span-full">
                                    <h4 className="text-base font-bold text-gray-700 mb-1">Portfolio</h4>
                                    <a
                                        href={candidate.portfolio_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-base text-blue-600 hover:underline inline-flex items-center gap-1"
                                    >
                                        {candidate.portfolio_url}
                                        <FaExternalLinkAlt className="text-sm" />
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* Skills */}
                        <TagList
                            title="Technical Skills"
                            tags={technicalSkills}
                            icon={<span className="text-pink-500">💼</span>}
                        />
                        <TagList
                            title="Soft Skills"
                            tags={softSkills}
                            icon={<span className="text-purple-500">🤝</span>}
                        />

                        {/* Cover Letter Analysis */}
                        <hr className="my-6" />
                        <CoverLetterAnalysis
                            report={
                                candidate.cover_letter_analysis || {
                                    analysis: "No cover letter provided.",
                                    issues: [],
                                    recommendation: "Cover letter missing — request one from candidate.",
                                }
                            }
                            score={
                                typeof candidate.ai_writing_score === "number"
                                    ? candidate.ai_writing_score
                                    : 0
                            }
                        />
                    </div>
                    {/* END: Downloadable Content */}

                    {/* Footer Buttons */}
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
        </ModalPortal>
    );
}
