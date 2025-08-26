import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import drive from "@/lib/googleDrive";

export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const fileIds: string[] = body.fileIds; // array of file IDs

  if (!fileIds || !Array.isArray(fileIds) || fileIds.length === 0) {
    return NextResponse.json(
      { success: false, msg: "No file IDs provided" },
      { status: 400 }
    );
  }

  try {
    // fetch all files at once
    const files = await prisma.file.findMany({
      where: { id: { in: fileIds } },
    });

    if (files.length === 0) {
      return NextResponse.json(
        { success: false, msg: "No files found" },
        { status: 404 }
      );
    }

    // delete from Google Drive + DB
    await Promise.all(
      files.map(async (file) => {
        try {
          await drive.files.delete({ fileId: file.driveId });
          await prisma.file.delete({ where: { id: file.id } });
        } catch (err) {
          console.error(`Failed to delete file ${file.id}:`, err);
        }
      })
    );

    return NextResponse.json(
      { success: true, msg: `${files.length} files deleted` },
      { status: 200 }
    );
  } catch (err) {
    console.error("Batch delete failed:", err);
    return NextResponse.json(
      { success: false, msg: "Failed to delete files" },
      { status: 500 }
    );
  }
}
