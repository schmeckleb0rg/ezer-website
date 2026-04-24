import { NextRequest, NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!serviceKey || !supabaseUrl || supabaseUrl.includes("placeholder")) {
    return NextResponse.json(
      { error: "Supabase not configured. Check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel env vars." },
      { status: 500 }
    );
  }

  const adminClient = createClient(supabaseUrl, serviceKey);

  // Check if any admin users exist
  const { data: existing, error: checkError } = await adminClient
    .from("admin_users")
    .select("id")
    .limit(1);

  if (checkError) {
    return NextResponse.json(
      { error: "DB check failed: " + checkError.message },
      { status: 500 }
    );
  }

  if (existing && existing.length > 0) {
    return NextResponse.json(
      { error: "Admin user already exists." },
      { status: 403 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { email, password } = body;

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
    return NextResponse.json({ error: "Insert failed: " + error.message }, { status: 500 });
  }

  return NextResponse.json({
    message: "Admin user created successfully. Log in at /admin/login",
  });
}
