import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  );
}

function getAdminUser(request: NextRequest) {
  const token = request.cookies.get("admin_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") || "home";
  const supabase = getServiceClient();

  const { data, error } = await supabase
    .from("site_content")
    .select("*")
    .eq("page", page)
    .order("sort_order");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ content: data });
}

export async function PUT(request: NextRequest) {
  const user = getAdminUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, value } = await request.json();
  if (!id || value === undefined) {
    return NextResponse.json({ error: "id and value are required" }, { status: 400 });
  }

  const supabase = getServiceClient();

  const { data: oldRecord } = await supabase
    .from("site_content")
    .select("value")
    .eq("id", id)
    .single();

  const { data, error } = await supabase
    .from("site_content")
    .update({ value, updated_at: new Date().toISOString(), updated_by: user.id })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await supabase.from("audit_log").insert({
    admin_id: user.id,
    action: "update_content",
    table_name: "site_content",
    record_id: id,
    old_value: { value: oldRecord?.value },
    new_value: { value },
  });

  return NextResponse.json({ content: data });
}
