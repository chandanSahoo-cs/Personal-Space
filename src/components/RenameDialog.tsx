"use client";

import type React from "react";

import type { FileType } from "@/app/dashboard/upload/page";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Edit3, Loader2Icon, X } from "lucide-react";
import { useEffect, useState } from "react";

interface RenameDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onRename: ({ fileId, newName }: { fileId: string; newName: string }) => void;
  file: FileType;
  isRenaming?: boolean;
}

export const RenameDialog = ({
  isOpen,
  onClose,
  onRename,
  file,
  isRenaming = false,
}: RenameDialogProps) => {
  const [newName, setNewName] = useState("");

  useEffect(() => {
    if (isOpen) {
      // Remove file extension for editing, but keep it for final rename
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
      setNewName(nameWithoutExt);
    }
  }, [isOpen, file.name]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      const extension = file.name.match(/\.[^/.]+$/)?.[0] || "";
      const finalName = newName.trim() + extension;
      console.log("FileId:", file.id);
      onRename({ fileId: file.id, newName: finalName });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1d1f21]/95 backdrop-blur-md border-[#2e3136] w-full max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 p-0 border-b border-[#2e3136] pb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#5865f2]/10 rounded-lg">
              <Edit3 className="w-5 h-5 text-[#5865f2]" />
            </div>
            <DialogTitle className="text-xl font-semibold text-gray-50">
              Rename File
            </DialogTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 hover:bg-[#2e3136]/50 rounded-lg"
            disabled={isRenaming}>
            <X className="w-5 h-5" />
          </Button>
        </DialogHeader>

        {/* Content */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              File Name
            </label>
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Enter new file name"
              className="bg-[#2e3136] border border-[#40444b] text-gray-100 placeholder:text-gray-400 rounded-xl focus-visible:border-[#5865f2] focus-visible:border-2 transition-all"
              disabled={isRenaming}
              autoFocus
            />
            <p className="text-xs text-gray-400">
              Extension will be preserved automatically
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="flex-1 bg-[#2e3136]/50 hover:bg-[#2e3136] text-gray-300 hover:text-gray-100 border border-[#40444b] rounded-xl transition-all duration-200"
              disabled={isRenaming}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-[#5865f2] hover:bg-[#4752c4] text-white font-medium rounded-xl transition-colors duration-200 shadow-md"
              disabled={isRenaming || !newName.trim()}>
              {isRenaming ? (
                <>
                  <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
                  <p>Renaming file...</p>
                </>
              ) : (
                <p>Rename</p>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
