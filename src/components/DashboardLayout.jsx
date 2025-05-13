import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow p-4">Sidebar / Topbar</nav>
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}