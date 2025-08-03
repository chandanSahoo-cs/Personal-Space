"use client";

import { ContestSidebar } from "@/components/ContestSidebar";
import { VerifyToken } from "@/components/VerifyToken";
import type React from "react";
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { isOpen } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen relative">
      <VerifyToken />
      <div className={`relative z-10 transition-all duration-300`}>
        {children}
      </div>
      {!isOpen && (
        <ContestSidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      )}
    </div>
  );
};

export default DashboardLayout;
