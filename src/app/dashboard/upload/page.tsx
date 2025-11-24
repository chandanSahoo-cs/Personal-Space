"use client";

import type React from "react";

import { useAuthStore } from "@/app/store/useAuthStore";
import { showErrorToast, showSuccessToast } from "@/components/CustomToast";
import { FullScreenLoader } from "@/components/FullScreenLoader";
import { RenameDialog } from "@/components/RenameDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { UploadDialog } from "@/components/UploadDialog";
import { useConfirm } from "@/hooks/UseConfirm";
import { cn } from "@/lib/utils";
import axios from "axios";
import {
  CheckSquare,
  Edit3Icon,
  FileArchiveIcon,
  FileAudioIcon,
  FileCodeIcon,
  FileIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  FileVideoIcon,
  ImageIcon,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export type FileType = {
  id: string;
  name: string;
  previewUrl: string;
  type: string;
  size: number;
  createdAt: string;
};

// Helper function to get file icon based on type
const getFileIcon = (mimeType: string) => {
  if (mimeType.startsWith("image/"))
    return <ImageIcon className="w-6 h-6 text-blue-400" />;
  if (mimeType.startsWith("video/"))
    return <FileVideoIcon className="w-6 h-6 text-purple-400" />;
  if (mimeType.startsWith("audio/"))
    return <FileAudioIcon className="w-6 h-6 text-orange-400" />;
  if (mimeType.includes("pdf"))
    return <FileTextIcon className="w-6 h-6 text-red-400" />;
  if (
    mimeType.includes("zip") ||
    mimeType.includes("rar") ||
    mimeType.includes("tar")
  )
    return <FileArchiveIcon className="w-6 h-6 text-yellow-400" />;
  if (mimeType.includes("spreadsheet") || mimeType.includes("excel"))
    return <FileSpreadsheetIcon className="w-6 h-6 text-green-400" />;
  if (
    mimeType.includes("text/") ||
    mimeType.includes("json") ||
    mimeType.includes("xml")
  )
    return <FileTextIcon className="w-6 h-6 text-gray-400" />;
  if (
    mimeType.includes("javascript") ||
    mimeType.includes("typescript") ||
    mimeType.includes("html") ||
    mimeType.includes("css")
  )
    return <FileCodeIcon className="w-6 h-6 text-indigo-400" />;
  return <FileIcon className="w-6 h-6 text-gray-500" />;
};

const searchFile = (files: FileType[], search: string) => {
  const trimmed = search.trim().toLowerCase();
  if (trimmed === "") return files;

  return files.filter((file) => file.name.toLowerCase().includes(trimmed));
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (
    Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
  );
};

const FilePage = () => {
  const { isOpen } = useAuthStore();
  const [files, setFiles] = useState<FileType[]>([]);

  const [parsedFiles, setParsedFiles] = useState<FileType[]>(files);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [deletingFiles, setDeletingFiles] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");

  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());

  const fetchFiles = useCallback(async () => {
    try {
      setLoadingFiles(true);
      const res = await fetch("/api/files/get", {
        method: "POST",
        cache: "no-store",
      });
      const json = await res.json();

      if (json.success === false) {
        showErrorToast(json.msg);
        return;
      }

      setFiles(json.files);
      setParsedFiles(json.files);
    } catch (error) {
      showErrorToast("Failed to fetch files");
      console.error("Failed to fetch files:", error);
    } finally {
      setLoadingFiles(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) return;
    fetchFiles();
  }, [isOpen]);

  const inputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    const parsedFile = searchFile(files, value);
    setParsedFiles(parsedFile);
  };

  const handleUpload = async (selectedFiles: FileList | null) => {
    if (!selectedFiles || selectedFiles.length === 0) return;

    const formData = new FormData();
    for (const file of selectedFiles) {
      formData.append("files", file);
    }

    try {
      setUploading(true);
      await axios.post("/api/files/upload", formData);
      showSuccessToast("Files uploaded");
    } catch (error) {
      console.error("File upload failed:", error);
      showErrorToast("Failed to upload files");
    } finally {
      setDialogOpen(false);
      setUploading(false);
      fetchFiles();
    }
  };

  const [renameDialog, setRenameDialog] = useState(false);
  const [renameFile, setRenameFile] = useState<FileType | null>(null);
  const [isRenaming, setIsRenaming] = useState(false);

  const handleRename = async ({
    fileId,
    newName,
  }: {
    fileId: string;
    newName: string;
  }) => {
    try {
      setIsRenaming(true);
      await axios.post("/api/files/rename", { fileId, newName });
      showSuccessToast("File renamed");
      fetchFiles();
      setRenameDialog(false);
    } catch (error) {
      console.error("Rename failed:", error);
      showErrorToast("Failed to rename files");
    } finally {
      setIsRenaming(false);
    }
  };

  const [DeleteDialog, confirmDelete] = useConfirm(
    "Delete File",
    "Are you sure you want to delete file?"
  );

  const [DeleteMultipleDialog, confirmDeleteMultiple] = useConfirm(
    "Delete Files",
    `Are you sure you want to delete ${selectedFiles.size} selected file(s)?`
  );

  async function deleteFile(id: string) {
    const ok = await confirmDelete();
    if (!ok) return;

    try {
      setDeletingFiles(true);
      await axios.delete("/api/files/delete-multiple", {
        data: { fileIds: [id] },
      });
      showSuccessToast("File Deleted");
    } catch (error) {
      console.error("File deletion failed:", error);
      showErrorToast("Failed to delete files");
    } finally {
      setDeletingFiles(false);
      fetchFiles();
    }
  }

  async function deleteSelectedFiles() {
    if (selectedFiles.size === 0) return;

    const ok = await confirmDeleteMultiple();
    if (!ok) return;

    try {
      setDeletingFiles(true);
      await axios.delete("/api/files/delete-multiple", {
        data: { fileIds: Array.from(selectedFiles) },
      });
      showSuccessToast(`${selectedFiles.size} file(s) deleted`);
      setSelectedFiles(new Set());
      setIsMultiSelectMode(false);
    } catch (error) {
      console.error("File deletion failed:", error);
      showErrorToast("Failed to delete files");
    } finally {
      setDeletingFiles(false);
      fetchFiles();
    }
  }

  const toggleMultiSelectMode = () => {
    setIsMultiSelectMode(!isMultiSelectMode);
    setSelectedFiles(new Set());
  };

  const toggleFileSelection = (fileId: string) => {
    const newSelected = new Set(selectedFiles);
    if (newSelected.has(fileId)) {
      newSelected.delete(fileId);
    } else {
      newSelected.add(fileId);
    }
    setSelectedFiles(newSelected);
  };

  const selectAllFiles = () => {
    if (selectedFiles.size === parsedFiles.length) {
      setSelectedFiles(new Set());
    } else {
      setSelectedFiles(new Set(parsedFiles.map((file) => file.id)));
    }
  };

  const [dialogOpen, setDialogOpen] = useState(false);

  const dialogClose = () => {
    setDialogOpen(false);
  };

  return isOpen ? (
    <div className="min-h-screen bg-[url('/image1.jpg')] bg-cover bg-center bg-no-repeat p-8" />
  ) : (
    <>
      {renameFile && (
        <RenameDialog
          isOpen={renameDialog}
          onClose={() => setRenameDialog(false)}
          onRename={handleRename}
          file={renameFile}
          isRenaming={isRenaming}
        />
      )}

      <DeleteDialog />
      <DeleteMultipleDialog />
      {loadingFiles && <FullScreenLoader message="Loading files" />}
      {deletingFiles && <FullScreenLoader message="Deleting files" />}
      <UploadDialog
        isOpen={dialogOpen}
        onClose={dialogClose}
        onUpload={handleUpload}
        uploading={uploading}
      />
      <div className="min-h-screen bg-[url('/image1.jpg')] bg-cover bg-center bg-no-repeat p-8 flex">
        <div className="p-8 space-y-8 bg-[#1d1f21]/90 backdrop-blur-sm rounded-3xl shadow-xl border border-[#2e3136] w-[900px] mx-auto  text-gray-100">
          {/* Header and Upload Section */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-[#2e3136]">
            <h1 className="text-3xl font-bold text-gray-50">My Files</h1>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              {/* Create Folder */}
              <div className="flex gap-2 w-full sm:w-auto">
                <Input
                  value={search}
                  onChange={inputChange}
                  placeholder="Search Files"
                  className="flex-grow bg-[#2e3136] border border-[#40444b] text-gray-100 placeholder:text-gray-400 rounded-xl focus-visible:border-[#5865f2] focus-visible:border-2 transition-all"
                />
              </div>
              <div>
                <Button
                  onClick={toggleMultiSelectMode}
                  variant={isMultiSelectMode ? "default" : "outline"}
                  className={`${
                    isMultiSelectMode
                      ? "bg-[#5865f2] hover:bg-[#4752c4] text-white"
                      : "bg-transparent border-[#40444b] text-gray-100 hover:bg-[#2e3136] hover:text-white"
                  } font-medium py-2.5 rounded-xl transition-colors duration-200 shadow-md w-full`}>
                  <CheckSquare className="w-4 h-4" />
                  {isMultiSelectMode ? "Exit Select" : "Multi Select"}
                </Button>
              </div>
              <div>
                <Button
                  onClick={() => setDialogOpen(true)}
                  asChild
                  className="bg-[#5865f2] hover:bg-[#4752c4] text-white font-medium py-2.5 rounded-xl transition-colors duration-200 shadow-md cursor-pointer w-full">
                  <span>
                    <UploadCloud className="w-4 h-4" />
                    Upload Files
                  </span>
                </Button>
              </div>
            </div>
          </div>

          {isMultiSelectMode && (
            <div className="flex items-center justify-between gap-4 p-4 bg-[#2e3136]/50 rounded-xl border border-[#40444b]">
              <div className="flex items-center gap-4">
                <Button
                  onClick={selectAllFiles}
                  variant="outline"
                  size="sm"
                  className="bg-transparent border-[#40444b] text-gray-100 hover:bg-[#2e3136] hover:text-white">
                  {selectedFiles.size === parsedFiles.length
                    ? "Deselect All"
                    : "Select All"}
                </Button>
                <span className="text-sm text-gray-400">
                  {selectedFiles.size} of {parsedFiles.length} selected
                </span>
              </div>
              {selectedFiles.size > 0 && (
                <Button
                  onClick={deleteSelectedFiles}
                  variant="destructive"
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 text-white">
                  <Trash2 className="w-4 h-4" />
                  Delete Selected ({selectedFiles.size})
                </Button>
              )}
            </div>
          )}

          {/* File List */}
          {files && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-50">
                Your Uploaded Files
              </h2>
              {files && files.length === 0 ? (
                <p className="text-gray-400 text-center py-8">
                  No files uploaded yet. Start by dragging files here or using
                  the upload button!
                </p>
              ) : (
                <div
                  className={cn(
                    "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 gap-y-0 overflow-y-auto h-[410px] contest-scrollbar",
                    isMultiSelectMode && "h-[311px]"
                  )}>
                  {parsedFiles.map((file) => (
                    <Card
                      onClick={() => {
                        if (isMultiSelectMode) {
                          toggleFileSelection(file.id);
                        }
                      }}
                      key={file.id}
                      className={cn(
                        "bg-[#1d1f21]/80 backdrop-blur-sm border rounded-xl h-44 shadow-lg hover:shadow-xl hover:bg-[#1d1f21]/90 hover:border-[#5865f2]/40 transition-all duration-300 mr-2 group",
                        isMultiSelectMode && "h-28",
                        isMultiSelectMode && selectedFiles.has(file.id)
                          ? "border-[#5865f2] bg-[#5865f2]/10"
                          : "border-[#2e3136]/60"
                      )}>
                      <CardContent className="pl-4 pr-4 pt-4 flex flex-col h-full justify-between">
                        {isMultiSelectMode && (
                          <div className="absolute top-2 right-2 z-10">
                            <Checkbox
                              checked={selectedFiles.has(file.id)}
                              onCheckedChange={() =>
                                toggleFileSelection(file.id)
                              }
                              className="border-[#40444b] data-[state=checked]:bg-[#5865f2] data-[state=checked]:border-[#5865f2]"
                            />
                          </div>
                        )}
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex-shrink-0 p-2 bg-[#2e3136]/50 rounded-lg group-hover:bg-[#2e3136]/70 transition-colors duration-200">
                            {getFileIcon(file.type)}
                          </div>
                          <div className="flex-grow min-w-0">
                            <p className="font-semibold text-gray-50 truncate text-sm leading-tight">
                              {file.name}
                            </p>
                            <div className="text-xs text-gray-400 mt-1 flex justify-between items-center">
                              <span className="capitalize truncate leading-tight w-[100px]">
                                {file.type.split("/")[1] || file.type}
                              </span>
                              <span className="font-medium">
                                {formatFileSize(file.size)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {!isMultiSelectMode && (
                          <div className="flex gap-2 mt-auto">
                            <a
                              href={file.previewUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-grow text-center bg-[#5865f2]/10 border border-[#5865f2]/30 hover:bg-[#5865f2]/20 hover:border-[#5865f2]/50 text-[#5865f2] font-medium py-2.5 rounded-lg text-sm transition-all duration-200 backdrop-blur-sm">
                              Preview
                            </a>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-[#5865f2] hover:bg-[#5865f2]/10 hover:text-[#4752c4] hover:border-[#5865f2]/30 border border-transparent rounded-lg transition-all duration-200 backdrop-blur-sm"
                              onClick={() => {
                                setRenameFile(file);
                                setRenameDialog(true);
                              }}
                              aria-label={`Rename ${file.name}`}>
                              <Edit3Icon size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-400 hover:bg-red-500/10 hover:text-red-300 hover:border-red-500/30 border border-transparent rounded-lg transition-all duration-200 backdrop-blur-sm"
                              onClick={() => deleteFile(file.id)}
                              aria-label={`Delete ${file.name}`}>
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FilePage;
