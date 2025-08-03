"use client";

import { useAuthStore } from "@/app/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { UploadDialog } from "@/components/UploadDialog";
import axios from "axios";
import {
  FileArchive,
  FileAudio,
  FileCode,
  FileIcon,
  FileSpreadsheet,
  FileText,
  FileVideo,
  ImageIcon,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type FileType = {
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
    return <FileVideo className="w-6 h-6 text-purple-400" />;
  if (mimeType.startsWith("audio/"))
    return <FileAudio className="w-6 h-6 text-orange-400" />;
  if (mimeType.includes("pdf"))
    return <FileText className="w-6 h-6 text-red-400" />;
  if (
    mimeType.includes("zip") ||
    mimeType.includes("rar") ||
    mimeType.includes("tar")
  )
    return <FileArchive className="w-6 h-6 text-yellow-400" />;
  if (mimeType.includes("spreadsheet") || mimeType.includes("excel"))
    return <FileSpreadsheet className="w-6 h-6 text-green-400" />;
  if (
    mimeType.includes("text/") ||
    mimeType.includes("json") ||
    mimeType.includes("xml")
  )
    return <FileText className="w-6 h-6 text-gray-400" />;
  if (
    mimeType.includes("javascript") ||
    mimeType.includes("typescript") ||
    mimeType.includes("html") ||
    mimeType.includes("css")
  )
    return <FileCode className="w-6 h-6 text-indigo-400" />;
  return <FileIcon className="w-6 h-6 text-gray-500" />;
};

const searchFile = (files: FileType[], search: string) => {
  if (search === "") return files;
  const lowerQuery = search.toLowerCase();

  return files.filter((file) => file.name.toLowerCase().includes(lowerQuery));
};

const FilePage = () => {
  const [files, setFiles] = useState<FileType[]>([]);
  const [parsedFiles, setParsedFiles] = useState<FileType[]>(files);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");

  // Fetch files from backend
  const fetchFiles = useCallback(async () => {
    try {
      const res = await fetch("/api/files/get");
      const json = await res.json();
      setFiles(json.files);
      setParsedFiles(json.files);
    } catch (error) {
      console.error("Failed to fetch files:", error);
    }
  }, []);

  useEffect(() => {
    fetchFiles();
  }, []);

  const inputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    const parsedFile = searchFile(files, search);
    setParsedFiles(parsedFile);
  };

  const handleUpload = async (selectedFiles: FileList | null) => {
    if (!selectedFiles || selectedFiles.length === 0) return;

    const formData = new FormData();
    for (const file of selectedFiles) {
      formData.append("files", file);
    }

    setUploading(true);
    try {
      await axios.post("/api/files/upload", formData);
      fetchFiles();
      setDialogOpen(false);
    } catch (error) {
      console.error("File upload failed:", error);
      // Optionally show an error message to the user
    } finally {
      setUploading(false);
    }
  };

  async function deleteFile(id: string) {
    try {
      await axios.delete("/api/files/delete", {
        data: { fileId: id },
      });
      fetchFiles();
    } catch (error) {
      console.error("File deletion failed:", error);
      // Optionally show an error message to the user
    }
  }

  const { isOpen } = useAuthStore();

  const [dialogOpen, setDialogOpen] = useState(false);

  const dialogClose = () => {
    setDialogOpen(false);
  };

  return isOpen ? (
    <div className="min-h-screen bg-[url('/image1.jpg')] bg-cover bg-center bg-no-repeat p-8" />
  ) : (
    <>
      <UploadDialog
        isOpen={dialogOpen}
        onClose={dialogClose}
        onUpload={handleUpload}
        uploading={uploading}
      />
      <div className="min-h-screen bg-[url('/image1.jpg')] bg-cover bg-center bg-no-repeat p-8 flex">
        <div className="p-8 space-y-8 bg-[#1d1f21]/90 backdrop-blur-sm rounded-3xl shadow-xl border border-[#2e3136] max-w-4xl mx-auto  text-gray-100">
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

          {/* File List */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-50">
              Your Uploaded Files
            </h2>
            {files.length === 0 ? (
              <p className="text-gray-400 text-center py-8">
                No files uploaded yet. Start by dragging files here or using the
                upload button!
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto h-[410px] contest-scrollbar">
                {parsedFiles.map((file) => (
                  <Card
                    key={file.id}
                    className="bg-[#2e3136] border border-[#40444b] rounded-xl h-44 shadow-sm hover:shadow-md transition-shadow duration-200 mr-2">
                    <CardContent className="pl-4 pr-4 flex flex-col space-y-3">
                      <div className="flex items-center gap-3">
                        {getFileIcon(file.type)}
                        <p className="font-semibold text-gray-50 truncate flex-grow">
                          {file.name}
                        </p>
                      </div>
                      <div className="text-sm text-gray-400 flex justify-between items-center">
                        <span>{file.type.split("/")[1] || file.type}</span>
                        <span>{(file.size / 1024).toFixed(2)} KB</span>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <a
                          href={file.previewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-grow text-center bg-[#40444b] hover:bg-[#50545b] text-[#5865f2] font-medium py-2 rounded-lg text-sm transition-colors duration-200">
                          Preview
                        </a>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-400 hover:bg-red-900/20 hover:text-red-500 rounded-lg"
                          onClick={() => deleteFile(file.id)}
                          aria-label={`Delete ${file.name}`}>
                          <Trash2 size={18} />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default FilePage;
