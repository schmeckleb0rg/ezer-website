import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

function getAdminUser(request: NextRequest) {
  const token = request.cookies.get("admin_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function GET() {
  const { data, error } = await supabase
    .from("team_members")
    .select("*")
    .order("sort_order");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ members: data });
}

export async function POST(request: NextRequest) {
  const user = getAdminUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, title, bio } = await request.json();

  if (!name || !title) {
    return NextResponse.json(
      { error: "Name and title are required" },
      { status: 400 }
    );
  }

  const { data: maxOrder } = await supabase
    .from("team_members")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .single();

  const { data, error } = await supabase
    .from("team_members")
    .insert({
      name,
      title,
      bio: bio || "",
      sort_order: (maxOrder?.sort_order || 0) + 1,
      updated_by: user.id,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await supabase.from("audit_log").insert({
    admin_id: user.id,
    action: "create",
    table_name: "team_members",
    record_id: data.id,
    new_value: { name, title, bio },
  });

  return NextResponse.json({ member: data });
}

export async function PUT(request: NextRequest) {
  const user = getAdminUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, name, title, bio, photo_url, sort_order } = await request.json();

  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const { data: oldRecord } = await supabase
    .from("team_members")
    .select("*")
    .eq("id", id)
    .single();

  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
    updated_by: user.id,
  };
  if (name !== undefined) updateData.name = name;
  if (title !== undefined) updateData.title = title;
  if (bio !== undefined) updateData.bio = bio;
  if (photo_url !== undefined) updateData.photo_url = photo_url;
  if (sort_order !== undefined) updateData.sort_order = sort_order;

  const { data, error } = await supabase
    .from("team_members")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await supabase.from("audit_log").insert({
    admin_id: user.id,
    action: "update_content",
    table_name: "team_members",
    record_id: id,
    old_value: oldRecord,
    new_value: updateData,
  });

  return NextResponse.json({ member: data });
}

export async function DELETE(request: NextRequest) {
  const user = getAdminUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await request.json();

  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const { data: oldRecord } = await supabase
    .from("team_members")
    .select("*")
    .eq("id", id)
    .single();

  const { error } = await supabase
    .from("team_members")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await supabase.from("audit_log").insert({
    admin_id: user.id,
    action: "delete",
    table_name: "team_members",
    record_id: id,
    old_value: oldRecord,
  });

  return NextResponse.json({ success: true });
}
