import drive from "@/lib/googleDrive";
import { prisma } from "@/lib/prisma";
import { File } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const files = await prisma.file.findMany({
      orderBy: { createdAt: "desc" },
    });

    const filesWithPreview = await Promise.all(
      files.map(async (file: File) => {
        const previewUrl = await getDrivePreviewUrl(file.driveId);
        return { ...file, previewUrl };
      })
    );

    return NextResponse.json(
      { files: filesWithPreview, success: true, msg: "File found" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Failed to fetch files:", err);
    return NextResponse.json(
      { files: null, success: false, msg: "Internal server error" },
      { status: 500 }
    );
  }
}

async function getDrivePreviewUrl(fileId: string): Promise<string | null> {
  try {
    await drive.permissions.create({
      fileId,
      requestBody: {
        role: "reader",
        type: "anyone", 
      },
    });

    const res = await drive.files.get({
      fileId,
      fields: "id, name, mimeType, webViewLink, webContentLink",
    });

    return res.data.webViewLink ?? null;
  } catch (error) {
    return null;
  }
}
