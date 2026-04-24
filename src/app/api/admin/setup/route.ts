import { NextResponse } from "next/server";

// This endpoint is permanently disabled after initial setup.
// Admin user has been created. Do not re-enable.
export async function POST() {
  return NextResponse.json(
    { error: "Setup is disabled." },
    { status: 403 }
  );
}
