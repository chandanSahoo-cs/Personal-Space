import { getDrivePreviewUrl } from "@/lib/googleDrive";
import { prisma } from "@/lib/prisma";
import { File } from "@prisma/client";

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

    return Response.json({ files: filesWithPreview });
  } catch (err) {
    console.error("Failed to fetch files:", err);
    return new Response("Internal server error", { status: 500 });
  }
}
