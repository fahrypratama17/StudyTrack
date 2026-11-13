import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";

import Sidebar from "../components/Sidebar";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="bg-surface min-h-dvh lg:pl-64">
      <Sidebar className="fixed inset-y-0 left-0 z-30 hidden lg:flex" />

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          />

          <Sidebar
            className="relative z-10 shadow-xl"
            onNavigate={() => setSidebarOpen(false)}
          />
        </div>
      )}

      <div className="min-h-dvh">
        <div className="border-primary/10 flex items-center justify-between border-b bg-white px-5 py-4 lg:hidden">
          <span className="text-primary-text font-bold">StudyTrack</span>

          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-primary"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <main className="mx-auto max-w-[1600px] p-5 md:p-8 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
