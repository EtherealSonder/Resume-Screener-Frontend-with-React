import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    RouterProvider,
} from "react-router-dom";

import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import Layout from "../components/Layout";
import DashboardPage from "../pages/DashboardPage";
import CandidatesPage from "../pages/CandidatesPage";
import SettingsPage from "../pages/SettingsPage";
import AnalyticsPage from "../pages/AnalyticsPage";
import ProtectedRoute from "../components/ProtectedRoute";

// Job Pages
import JobsMain from "../pages/jobs/JobsMain";
import JobsMy from "../pages/jobs/JobsMy";
import JobsMyWrapper from "../pages/jobs/JobsMyWrapper";

import JobsCreate from "../pages/jobs/JobsCreate";

import ApplyPage from "../pages/ApplyPage";

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/apply/:job_id" element={<ApplyPage />} />

            {/* Protected Routes */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Layout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<DashboardPage />} />
                <Route path="candidates" element={<CandidatesPage />} />
                <Route path="statistics" element={<AnalyticsPage />} />
                <Route path="settings" element={<SettingsPage />} />

                {/* Job Subpages */}
                <Route path="jobs" element={<JobsMain />} />
                <Route
                    path="jobs/my"
                    element={<JobsMyWrapper />}
                />
                <Route path="jobs/create" element={<JobsCreate />} />
            </Route>
        </>
    )
);

export default function AppRouter() {
    return <RouterProvider router={router} />;
}
