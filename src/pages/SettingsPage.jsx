import { useState } from "react";
import {
    FaUserCog,
    FaSlidersH,
    FaBell,
    FaCreditCard
} from "react-icons/fa";

import GeneralSettings from "../pages/settings/GeneralSettings";
import ChangePasswordModal from "../pages/settings/ChangePasswordModal";
import SignOutModal from "../pages/settings/SignOutModal";
import DeleteAccountModal from "../pages/settings/DeleteAccountModal";
import EvaluationPromptBox from "../pages/settings/EvaluationPromptBox";
import ScoringWeightsBox from "../pages/settings/ScoringWeightsBox";

export default function SettingsPage() {
    const [view, setView] = useState("general");
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showSignOutModal, setShowSignOutModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showSuccessToast, setShowSuccessToast] = useState(false);

    const settingsOptions = [
        { key: "general", label: "General", icon: <FaUserCog /> },
        { key: "evaluation", label: "Evaluation Preferences", icon: <FaSlidersH /> },
        { key: "notifications", label: "Notifications", icon: <FaBell /> },
        { key: "billing", label: "Billing", icon: <FaCreditCard /> }
    ];

    return (
        <div className="bg-graylupa-bg p-6 rounded-2xl text-graylupa-text animate-fadeIn space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
            <p className="text-sm text-gray-600">
                Manage your account, scoring logic, and app preferences.
            </p>

            <div className="flex overflow-x-auto gap-2 pb-2">
                {settingsOptions.map((opt) => (
                    <button
                        key={opt.key}
                        onClick={() => setView(opt.key)}
                        className={`flex items-center gap-2 text-base font-medium px-4 py-2 rounded-full whitespace-nowrap transition shadow border
              ${view === opt.key
                                ? "bg-gray-800 text-white border-gray-700"
                                : "bg-gray-200 text-black hover:bg-gray-300 border-gray-400"
                            }`}
                    >
                        <span className="text-lg">{opt.icon}</span>
                        {opt.label}
                    </button>
                ))}
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg text-black space-y-6 animate-fadeIn">
                {view === "general" && (
                    <GeneralSettings
                        onChangePassword={() => setShowPasswordModal(true)}
                        onSignOut={() => setShowSignOutModal(true)}
                        onDeleteAccount={() => setShowDeleteModal(true)}
                    />
                )}

                {view === "evaluation" && (
                    <>
                        <EvaluationPromptBox />
                        <ScoringWeightsBox />
                    </>
                )}

                {view === "notifications" && (
                    <div>
                        <h2 className="text-xl font-semibold">Notifications</h2>
                        <p className="text-gray-600 text-sm mb-4">
                            This section is under development.
                        </p>
                        <p className="text-gray-700 text-sm mb-4">
                            Control when and how you get notified about new applications.
                        </p>
                    </div>
                )}

                {view === "billing" && (
                    <div>
                        <h2 className="text-xl font-semibold">Billing & Subscription</h2>
                        <p className="text-gray-600 text-sm mb-4">
                            This section is under development.
                        </p>
                        <ul className="list-disc list-inside text-sm text-gray-800 space-y-2">
                            <li>Current plan</li>
                            <li>Payment method</li>
                            <li>Upgrade/cancel options</li>
                        </ul>
                    </div>
                )}
            </div>

            {showPasswordModal && (
                <ChangePasswordModal
                    onClose={() => setShowPasswordModal(false)}
                    onSuccessToast={() => {
                        setShowPasswordModal(false);
                        setShowSuccessToast(true);
                        setTimeout(() => setShowSuccessToast(false), 3000);
                    }}
                />
            )}

            {showSignOutModal && (
                <SignOutModal onClose={() => setShowSignOutModal(false)} />
            )}

            {showDeleteModal && (
                <DeleteAccountModal onClose={() => setShowDeleteModal(false)} />
            )}

            {showSuccessToast && (
                <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
                    <div className="bg-green-600 text-white px-6 py-3 rounded-md shadow-md text-sm font-medium animate-fadeIn">
                        Password changed successfully
                        <div className="w-full h-1 bg-green-300 mt-2 animate-progress-bar"></div>
                    </div>
                </div>
            )}
        </div>
    );
}
