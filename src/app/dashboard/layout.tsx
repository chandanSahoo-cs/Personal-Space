"use client";

import { VerifyToken } from "@/components/VerifyToken";
import type React from "react";
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen relative">
      <VerifyToken />
      <div className={`relative z-10 transition-all duration-300`}>
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
