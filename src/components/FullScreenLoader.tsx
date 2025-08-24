"use client";

import { Loader2Icon } from "lucide-react";

interface FullScreenLoaderProps {
  message?: string;
  isVisible?: boolean;
}

export const FullScreenLoader = ({
  message = "Loading...",
  isVisible = true,
}: FullScreenLoaderProps) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1d1f21]/90 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 p-8 bg-[#2e3136]/50 backdrop-blur-sm rounded-2xl border border-[#40444b]/60 shadow-xl">
        <Loader2Icon className="w-12 h-12 animate-spin text-[#5865f2]" />
        <p className="text-gray-100 font-medium text-lg">{message}</p>
      </div>
    </div>
  );
};
