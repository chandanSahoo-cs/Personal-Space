import drive from "@/lib/googleDrive";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { Readable } from "stream";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const files = formData.getAll("files") as File[];

  if (!files || files.length === 0) {
    return NextResponse.json({ success: false, files: [] }, { status: 400 });
  }

  const folderId = formData.get("folderId")?.toString() ?? null;

  if (folderId) {
    const folderExists = await prisma.folder.findUnique({
      where: { id: folderId },
    });
    if (!folderExists) {
      return NextResponse.json({ success: false, files: [] }, { status: 400 });
    }
  }

  const uploadedFiles = [];

  for (const file of files) {
    try {
      const buffer = Buffer.from(await file.arrayBuffer());

      const uploadRes = await drive.files.create({
        requestBody: {
          name: file.name,
        },
        media: {
          mimeType: file.type,
          body: Readable.from(buffer),
        },
      });

      const driveId = uploadRes.data.id!;
      const name = file.name;
      const size = file.size;
      const type = file.type;

      // Save metadata to DB
      const dbEntry = await prisma.file.create({
        data: {
          name,
          driveId,
          type,
          size,
          folderId,
        },
      });

      uploadedFiles.push(dbEntry);
    } catch (error) {
      console.error(`Error uploading file ${file.name}:`, error);
      return NextResponse.json({ success: false, files: [] }, { status: 500 });
    }
  }

  return NextResponse.json(
    { success: true, files: uploadedFiles },
    { status: 200 }
  );
}
