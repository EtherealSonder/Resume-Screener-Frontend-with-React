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
import JobsPage from "../pages/JobsPage";
import StatisticsPage from "../pages/StatisticsPage";
import ProtectedRoute from "../components/ProtectedRoute";

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Protected Routes with Layout */}
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
                <Route path="jobs" element={<JobsPage />} />
                <Route path="statistics" element={<StatisticsPage />} />
                <Route path="settings" element={<SettingsPage />} />
            </Route>
        </>
    )
);

export default function AppRouter() {
    return <RouterProvider router={router} />;
}
