import { NextRequest, NextResponse } from "next/server";
import { authenticateAdmin } from "@/lib/auth";

// In-memory brute-force tracker (per-process; resets on redeploy — acceptable for admin login)
// Key: IP address, Value: { attempts, lockedUntil }
const loginAttempts = new Map<string, { attempts: number; lockedUntil: number }>();

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes
const WINDOW_MS = 10 * 60 * 1000;  // 10-minute rolling window

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const now = Date.now();

    // ─── Brute-force check ────────────────────────────────────────────────
    const record = loginAttempts.get(ip);
    if (record) {
      if (record.lockedUntil > now) {
        const retryAfter = Math.ceil((record.lockedUntil - now) / 1000);
        return NextResponse.json(
          { error: "Too many failed attempts. Try again later." },
          { status: 429, headers: { "Retry-After": String(retryAfter) } }
        );
      }
      // Reset stale window
      if (now - (record.lockedUntil - LOCKOUT_MS) > WINDOW_MS) {
        loginAttempts.delete(ip);
      }
    }

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const result = await authenticateAdmin(email, password);

    if (!result) {
      // Track failed attempt
      const current = loginAttempts.get(ip) ?? { attempts: 0, lockedUntil: 0 };
      current.attempts += 1;
      if (current.attempts >= MAX_ATTEMPTS) {
        current.lockedUntil = now + LOCKOUT_MS;
      }
      loginAttempts.set(ip, current);

      // Intentionally vague error message for security
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Clear failed attempts on success
    loginAttempts.delete(ip);

    const response = NextResponse.json({
      user: result.user,
      message: "Login successful",
    });

    response.cookies.set("admin_token", result.token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 8, // 8 hours
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
