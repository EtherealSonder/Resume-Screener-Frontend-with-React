import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    RouterProvider,
} from "react-router-dom";

import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import DashboardLayout from "../components/DashboardLayout";
import DashboardPage from "../pages/DashboardPage";
import CandidatesPage from "../pages/CandidatesPage";
import JobsPage from "../pages/JobsPage";
import StatisticsPage from "../pages/StatisticsPage";
import ProtectedRoute from "../components/ProtectedRoute";

const dashboardLoader = async () => {
    const res = await fetch("http://localhost:5000/dashboard");
    if (!res.ok) throw new Error("Failed to load dashboard data");
    return res.json();
};

const candidatesLoader = async () => {
    const res = await fetch("http://localhost:5000/candidates");
    if (!res.ok) throw new Error("Failed to fetch candidates");
    return res.json();
};

const jobsLoader = async () => {
    const res = await fetch("http://localhost:5000/jobs");
    if (!res.ok) throw new Error("Failed to fetch jobs");
    return res.json();
};

const statisticsLoader = async () => {
    const res = await fetch("http://localhost:5000/statistics");
    if (!res.ok) throw new Error("Failed to fetch statistics");
    return res.json();
};

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Protected Routes */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <DashboardLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<DashboardPage />} loader={dashboardLoader} />
                <Route path="candidates" element={<CandidatesPage />} loader={candidatesLoader} />
                <Route path="jobs" element={<JobsPage />} loader={jobsLoader} />
                <Route path="statistics" element={<StatisticsPage />} loader={statisticsLoader} />
            </Route>
        </>
    )
);

export default function AppRouter() {
    return <RouterProvider router={router} />;
}
