"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangleIcon } from "lucide-react";
import type { JSX } from "react";
import { useState } from "react";

export const useConfirm = (
  title: string,
  message: string
): [() => JSX.Element, () => Promise<unknown>] => {
  const [promise, setPromise] = useState<{
    resolve: (value: boolean) => void;
  } | null>(null);

  const confirm = () =>
    new Promise((resolve) => {
      setPromise({ resolve });
    });

  const handleClose = () => {
    setPromise(null);
  };

  const handleCancel = () => {
    promise?.resolve(false);
    handleClose();
  };

  const handleConfirm = () => {
    promise?.resolve(true);
    handleClose();
  };

  const ConfirmDialog = () => (
    <Dialog open={promise !== null} onOpenChange={handleClose}>
      <DialogContent className="bg-[#1d1f21]/95 backdrop-blur-md border border-[#2e3136] shadow-2xl rounded-lg p-0 overflow-hidden max-w-md">
        <DialogHeader className="p-6 border-b border-[#2e3136]/50">
          <div className="flex items-center gap-3">
            <div className="bg-[#5865f2]/20 border border-[#5865f2]/30 rounded-lg p-2 backdrop-blur-sm">
              <AlertTriangleIcon className="size-6 text-[#5865f2]" />
            </div>
            <div>
              <DialogTitle className="font-semibold text-lg text-white">
                {title}
              </DialogTitle>
              <DialogDescription className="text-gray-400 text-sm mt-1">
                {message}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6">
          <DialogFooter className="gap-3 sm:gap-3">
            <Button
              onClick={handleCancel}
              variant="outline"
              className="bg-[#2e3136]/50 text-gray-300 border-[#40444b] hover:bg-[#40444b]/50 hover:text-white backdrop-blur-sm transition-all duration-200">
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              className="bg-[#5865f2] text-white hover:bg-[#4752c4] transition-all duration-200 shadow-lg">
              Confirm
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );

  return [ConfirmDialog, confirm];
};
