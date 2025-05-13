import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import DashboardLayout from "../components/DashboardLayout";
import DashboardPage from "../pages/DashboardPage";

const router = createBrowserRouter([
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/signup",
        element: <SignupPage />,
    },
    {
        path: "/",
        element: <DashboardLayout />,
        children: [
            { path: "/dashboard", element: <DashboardPage /> },
        ],
    },
]);

export default router;