"use client";

import { CheckCircle, X, XCircle } from "lucide-react";
import { toast } from "sonner";

export const showSuccessToast = (message: string) => {
  toast.custom((t) => (
    <div className="bg-[#1d1f21]/95 backdrop-blur-sm border border-[#2e3136] rounded-lg p-4 min-w-[300px] shadow-lg">
      <div className="flex items-start gap-3">
        <div className="bg-[#5865f2]/20 p-2 rounded-full">
          <CheckCircle className="w-5 h-5 text-[#5865f2]" />
        </div>
        <div className="flex-1">
          <div className="text-white font-medium">Success!</div>
          <div className="text-gray-300 text-sm mt-1">{message}</div>
        </div>
        <button
          onClick={() => toast.dismiss(t)}
          className="text-gray-400 hover:text-white transition-colors p-1 rounded hover:bg-white/10">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  ));
};

export const showErrorToast = (message: string) => {
  toast.custom((t) => (
    <div className="bg-[#1d1f21]/95 backdrop-blur-sm border border-[#2e3136] rounded-lg p-4 min-w-[300px] shadow-lg">
      <div className="flex items-start gap-3">
        <div className="bg-red-500/20 p-2 rounded-full">
          <XCircle className="w-5 h-5 text-red-400" />
        </div>
        <div className="flex-1">
          <div className="text-white font-medium">Error!</div>
          <div className="text-gray-300 text-sm mt-1">{message}</div>
        </div>
        <button
          onClick={() => toast.dismiss(t)}
          className="text-gray-400 hover:text-white transition-colors p-1 rounded hover:bg-white/10">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  ));
};
