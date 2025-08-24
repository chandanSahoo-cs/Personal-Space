"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Loader2Icon, UploadCloud, X } from "lucide-react";
import { useRef, useState } from "react";

type UploadDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: FileList | null) => void;
  uploading: boolean;
};

export const UploadDialog = ({
  isOpen,
  onClose,
  onUpload,
  uploading,
}: UploadDialogProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onUpload(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpload(e.target.files);
    // onClose(); // Close dialog after selection
  };

  const handleAreaClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1d1f21]/90 backdrop-blur-sm border border-[#2e3136]  shadow-xl rounded-2xl max-w-md p-6 text-gray-100">
        <DialogHeader className="relative">
          <DialogTitle className="text-2xl font-bold text-gray-50">
            Upload Files
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Drag & drop your files here, or click to select them.
          </DialogDescription>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-0 right-0 text-gray-400 hover:bg-[#2e3136] hover:text-gray-100 rounded-full"
            onClick={onClose}
            aria-label="Close">
            <X className="w-5 h-5" />
          </Button>
        </DialogHeader>

        <button
          disabled={uploading}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleAreaClick}
          className={cn(
            "flex flex-col items-center justify-center p-10 border-2 hover:border-[#5865f2] rounded-xl text-center transition-all duration-200 mt-6",
            isDragging
              ? "border-[#5865f2] bg-[#5865f2]/10 text-[#5865f2]"
              : "border-[#40444b] bg-[#2e3136] text-gray-400"
          )}>
          <UploadCloud
            className={`w-16 h-16 mb-4 ${
              isDragging ? "text-[#5865f2]" : "text-gray-500"
            }`}
          />
          <p className="text-lg font-medium">Drag & Drop Files</p>
          <p className="text-sm mt-1">or click to browse</p>
          {uploading && (
            <div className="flex justify-center items-center">
              <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
              <p className="text-[#5865f2]">Uploading files...</p>
            </div>
          )}
          <input
            type="file"
            multiple
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
          />
        </button>

        <DialogFooter className="mt-6">
          <Button
            onClick={onClose}
            variant="outline"
            disabled={uploading}
            className="w-full bg-[#2e3136] text-gray-100 hover:bg-[#40444b] border border-[#40444b] rounded-xl">
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
