"use client";

import type React from "react";

import { useAuthStore } from "@/app/store/useAuthStore";
import { AlertCircle, Loader2, Shield } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";

export const VerifyToken = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, setIsOpen } = useAuthStore();
  const pathname = usePathname();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    setIsOpen(true);
  }, [pathname]);

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return; // Prevent multiple characters

    const newCode = [...code];
    newCode[index] = value.replace(/\D/g, ""); // Only allow digits
    setCode(newCode);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    const newCode = [...code];

    for (let i = 0; i < pastedData.length && i < 6; i++) {
      newCode[i] = pastedData[i];
    }

    setCode(newCode);

    // Focus the next empty input or the last one
    const nextEmptyIndex = newCode.findIndex((digit) => !digit);
    const focusIndex = nextEmptyIndex === -1 ? 5 : Math.min(nextEmptyIndex, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const fullCode = code.join("");

    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: fullCode }),
      });

      const body = await res.json();

      if (body.valid) {
        setIsOpen(false);
        setCode(["", "", "", "", "", ""]);
      } else {
        setError("Invalid authentication code. Please try again.");
        // Clear inputs and focus first one
        setCode(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const isCodeComplete = code.every((digit) => digit !== "");

  return (
    <Dialog open={isOpen}>
      <DialogContent className="bg-[#1d1f21] border-0 shadow-2xl rounded-lg max-w-md p-0 overflow-hidden">
        {/* Header section with colored background */}
        <div className="bg-[#5865f2] px-6 py-8 text-center">
          <div className="mx-auto w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mb-4">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <DialogTitle className="text-2xl font-semibold text-white mb-2">
            Two-Factor Authentication
          </DialogTitle>
          <DialogDescription className="text-indigo-100 text-sm">
            Enter the 6-digit code from your authenticator app
          </DialogDescription>
        </div>

        {/* Content section */}
        <div className="px-6 py-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-3">
              <Label className="text-[#b9bbbe] font-medium text-sm uppercase tracking-wide">
                Authentication Code
              </Label>

              {/* OTP Input Boxes */}
              <div className="flex gap-3 justify-center" onPaste={handlePaste}>
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    disabled={isLoading}
                    autoFocus={index === 0}
                    className="w-12 h-12 bg-[#40444b] border border-[#202225] rounded-lg text-center text-xl font-mono text-[#dcddde] focus:border-[#5865f2] focus:ring-1 focus:ring-[#5865f2] transition-all duration-200 focus:outline-none"
                    autoComplete="one-time-code"
                  />
                ))}
              </div>

              <p className="text-[#72767d] text-xs text-center">
                Enter each digit in a separate box
              </p>
            </div>

            {error && (
              <div className="bg-[#ed4245]/10 border border-[#ed4245]/20 rounded p-3">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-4 h-4 text-[#ed4245] flex-shrink-0" />
                  <p className="text-[#ed4245] text-sm font-medium">{error}</p>
                </div>
              </div>
            )}

            <DialogFooter className="pt-4">
              <Button
                type="submit"
                disabled={isLoading || !isCodeComplete}
                className="w-full bg-[#5865f2] hover:bg-[#4752c4] text-white font-medium py-2.5 rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Continue"
                )}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
