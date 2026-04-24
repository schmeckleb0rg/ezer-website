import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

function getAdminUser(request: NextRequest) {
  const token = request.cookies.get("admin_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime", "video/avi", "video/mov"];
const IMAGE_EXTS = ["jpg", "jpeg", "png", "webp", "gif"];
const VIDEO_EXTS = ["mp4", "webm", "mov", "avi"];
const MODEL_EXTS = ["glb", "gltf"];

export async function POST(request: NextRequest) {
  const user = getAdminUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!serviceKey || !supabaseUrl) {
    return NextResponse.json(
      { error: "Server not configured for uploads" },
      { status: 500 }
    );
  }

  const adminClient = createClient(supabaseUrl, serviceKey);

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const folder = (formData.get("folder") as string) || "uploads";

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "";
  const isImage = IMAGE_TYPES.includes(file.type) || IMAGE_EXTS.includes(ext);
  const isVideo = VIDEO_TYPES.includes(file.type) || VIDEO_EXTS.includes(ext);
  const is3D = MODEL_EXTS.includes(ext);

  if (!isImage && !isVideo && !is3D) {
    return NextResponse.json(
      { error: "Unsupported file type. Accepted: images (JPG, PNG, WebP, GIF), videos (MP4, WebM, MOV), 3D models (GLB, GLTF)" },
      { status: 400 }
    );
  }

  // Size limits: 10MB images, 500MB videos, 100MB 3D models
  const maxSize = isVideo ? 500 * 1024 * 1024 : is3D ? 100 * 1024 * 1024 : 10 * 1024 * 1024;
  if (file.size > maxSize) {
    const limitMB = maxSize / (1024 * 1024);
    return NextResponse.json(
      { error: `File too large. Max: ${limitMB}MB` },
      { status: 400 }
    );
  }

  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  let contentType = file.type;
  if (is3D && ext === "glb") contentType = "model/gltf-binary";
  if (is3D && ext === "gltf") contentType = "model/gltf+json";

  const { error: uploadError } = await adminClient.storage
    .from("uploads")
    .upload(fileName, buffer, { contentType, upsert: false });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data: urlData } = adminClient.storage.from("uploads").getPublicUrl(fileName);

  return NextResponse.json({
    url: urlData.publicUrl,
    type: is3D ? "3d" : isVideo ? "video" : "image",
  });
}
