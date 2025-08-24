// /app/api/files/[id]/route.ts
import drive from "@/lib/googleDrive";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log(body);
  const fileId = body.fileId;
  const newName = body.newName;
  console.log("filedId:", fileId);
  if (!fileId) {
    console.log("Fileid not given");
    return NextResponse.json(
      { success: false, msg: "FileId not given" },
      { status: 404 }
    );
  }

  const file = await prisma.file.findUnique({
    where: {
      id: fileId,
    },
  });

  if (!file) {
    console.log("File not found");
    return NextResponse.json(
      { success: false, msg: "File not found" },
      { status: 404 }
    );
  }

  try {
    console.log("FileId:", fileId);
    await drive.files.update({
      fileId: file.driveId,
      requestBody: {
        name: newName, // new file name
      },
    });

    await prisma.file.update({
      where: { id: file.id },
      data: {
        name: newName,
      },
    });

    return NextResponse.json(
      { success: true, msg: "File renamed" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Rename failed:", err);
    return NextResponse.json(
      { success: false, msg: "Failed to rename file" },
      { status: 500 }
    );
  }
}
