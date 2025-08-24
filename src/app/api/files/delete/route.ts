// /app/api/files/[id]/route.ts
import drive from "@/lib/googleDrive";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const fileId = body.fileId;
  console.log("Delete:", fileId);
  const file = await prisma.file.findUnique({
    where: { id: fileId },
  });

  if (!file) {
    return NextResponse.json(
      { success: false, msg: "File not found" },
      { status: 404 }
    );
  }

  try {
    await drive.files.delete({ fileId: file.driveId });

    await prisma.file.delete({ where: { id: file.id } });

    return NextResponse.json(
      { success: true, msg: "File deleted" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Delete failed:", err);
    return NextResponse.json(
      { success: false, msg: "Failed to delete file" },
      { status: 500 }
    );
  }
}
