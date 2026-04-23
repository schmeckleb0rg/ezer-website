import { NextRequest, NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

// This endpoint creates the first admin user
// It uses the service role key for elevated permissions
// IMPORTANT: Disable or protect this endpoint after initial setup
export async function POST(request: NextRequest) {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!serviceKey || !supabaseUrl) {
    return NextResponse.json(
      { error: "Server not configured" },
      { status: 500 }
    );
  }

  // Use service role client for admin operations
  const adminClient = createClient(supabaseUrl, serviceKey);

  // Check if any admin users exist
  const { data: existing } = await adminClient
    .from("admin_users")
    .select("id")
    .limit(1);

  if (existing && existing.length > 0) {
    return NextResponse.json(
      { error: "Admin user already exists. This endpoint is disabled after first setup." },
      { status: 403 }
    );
  }

  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 }
    );
  }

  if (password.length < 12) {
    return NextResponse.json(
      { error: "Password must be at least 12 characters" },
      { status: 400 }
    );
  }

  const passwordHash = await hashPassword(password);

  const { error } = await adminClient.from("admin_users").insert({
    email: email.toLowerCase(),
    password_hash: passwordHash,
    role: "super_admin",
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    message: "Admin user created successfully. You can now log in at /admin/login",
  });
}
