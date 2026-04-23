import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";

function getAdminUser(request: NextRequest) {
  const token = request.cookies.get("admin_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function GET(request: NextRequest) {
  const user = getAdminUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const page = request.nextUrl.searchParams.get("page");

  const query = supabase.from("page_images").select("*").order("sort_order");
  if (page) query.eq("page", page);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ images: data });
}

export async function PUT(request: NextRequest) {
  const user = getAdminUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { page, image_key, image_url } = await request.json();

  if (!page || !image_key) {
    return NextResponse.json(
      { error: "page and image_key are required" },
      { status: 400 }
    );
  }

  // Upsert — update if exists, insert if not
  const { data: existing } = await supabase
    .from("page_images")
    .select("id")
    .eq("page", page)
    .eq("image_key", image_key)
    .single();

  let result;
  if (existing) {
    result = await supabase
      .from("page_images")
      .update({ image_url, updated_at: new Date().toISOString() })
      .eq("id", existing.id)
      .select()
      .single();
  } else {
    result = await supabase
      .from("page_images")
      .insert({ page, image_key, image_url, sort_order: 0 })
      .select()
      .single();
  }

  if (result.error) {
    return NextResponse.json({ error: result.error.message }, { status: 500 });
  }

  await supabase.from("audit_log").insert({
    admin_id: user.id,
    action: "update_content",
    table_name: "page_images",
    record_id: result.data.id,
    new_value: { page, image_key, image_url },
  });

  return NextResponse.json({ image: result.data });
}

export async function DELETE(request: NextRequest) {
  const user = getAdminUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { page, image_key } = await request.json();

  if (!page || !image_key) {
    return NextResponse.json(
      { error: "page and image_key are required" },
      { status: 400 }
    );
  }

  // Get existing record to find the URL for storage deletion
  const { data: existing } = await supabase
    .from("page_images")
    .select("*")
    .eq("page", page)
    .eq("image_key", image_key)
    .single();

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Delete from storage if URL exists
  if (existing.image_url) {
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (serviceKey && supabaseUrl) {
      const adminClient = createClient(supabaseUrl, serviceKey);
      // Extract path from the public URL
      const urlParts = existing.image_url.split("/storage/v1/object/public/uploads/");
      if (urlParts[1]) {
        await adminClient.storage.from("uploads").remove([urlParts[1]]);
      }
    }
  }

  // Delete from database
  const { error } = await supabase
    .from("page_images")
    .delete()
    .eq("id", existing.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await supabase.from("audit_log").insert({
    admin_id: user.id,
    action: "delete",
    table_name: "page_images",
    record_id: existing.id,
    old_value: existing,
  });

  return NextResponse.json({ success: true });
}
