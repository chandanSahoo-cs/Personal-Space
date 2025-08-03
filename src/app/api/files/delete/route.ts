// /app/api/files/[id]/route.ts
import { drive } from "@/lib/googleDrive";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const fileId = body.fileId;
  const file = await prisma.file.findUnique({
    where: { id:fileId },
  });

  if (!file) {
    return new Response("File not found", { status: 404 });
  }

  try {
    // Step 1: Delete from Google Drive
    await drive.files.delete({ fileId: file.driveId });

    // Step 2: Delete from DB
    await prisma.file.delete({ where: { id: file.id } });

    return new Response("File deleted", { status: 200 });
  } catch (err) {
    console.error("Delete failed:", err);
    return new Response("Failed to delete file", { status: 500 });
  }
}
