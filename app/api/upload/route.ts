import { NextResponse } from "next/server";
import cloudinary from "../../../lib/cloudinary";

export async function POST(req: Request) {
  const formData = await req.formData();
  const files = formData.getAll("files") as File[];

  if (!files || files.length === 0) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const uploadPromises = files.map(async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise<{ secure_url: string }>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "barter-marketplace" }, (err, result) => {
          if (err) return reject(err);
          resolve(result as { secure_url: string });
        })
        .end(buffer);
    });
  });

  try {
    const results = await Promise.all(uploadPromises);
    const urls = results.map((res) => res.secure_url);

    return NextResponse.json({ urls, success: true });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
