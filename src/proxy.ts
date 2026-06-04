import { NextRequest, NextResponse } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";

// Extract just the hostname for CSP (e.g. "https://abc.supabase.co" → "https://abc.supabase.co")
function buildCSP(nonce: string): string {
  const isDev = process.env.NODE_ENV === "development";

  // Allow Supabase storage + API connections
  const supabaseHost = SUPABASE_URL ? SUPABASE_URL : "https://*.supabase.co";

  const directives = [
    `default-src 'self'`,
    // Scripts: nonce-only (no unsafe-inline). Dev needs unsafe-eval for React HMR.
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    // Styles: Next.js injects style tags, so nonce or unsafe-inline needed
    `style-src 'self' 'nonce-${nonce}' 'unsafe-inline'`,
    // Images: self + blob (canvas/upload previews) + Supabase storage + data URIs
    `img-src 'self' blob: data: ${supabaseHost}`,
    // Fonts: self only (Google Fonts are self-hosted via next/font)
    `font-src 'self'`,
    // Fetch/XHR: self + Supabase
    `connect-src 'self' ${supabaseHost}`,
    // Media (video/audio): self + Supabase
    `media-src 'self' blob: ${supabaseHost}`,
    // No plugins/objects
    `object-src 'none'`,
    // Prevent base tag hijacking
    `base-uri 'self'`,
    // Restrict form submissions
    `form-action 'self'`,
    // Prevent embedding in iframes (clickjacking)
    `frame-ancestors 'none'`,
    // Upgrade HTTP to HTTPS
    `upgrade-insecure-requests`,
  ];

  return directives.join("; ");
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ─── Admin route protection ───────────────────────────────────────────────
  // Redirect unauthenticated requests away from /admin (except /admin/login)
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const token = request.cookies.get("admin_token");
    if (!token) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ─── Generate nonce for CSP ───────────────────────────────────────────────
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const csp = buildCSP(nonce);

  // ─── Build response with security headers ────────────────────────────────
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  // Content Security Policy — primary defense against XSS
  response.headers.set("Content-Security-Policy", csp);

  // Prevent MIME-type sniffing
  response.headers.set("X-Content-Type-Options", "nosniff");

  // Clickjacking protection (belt + suspenders alongside CSP frame-ancestors)
  response.headers.set("X-Frame-Options", "DENY");

  // HTTPS enforcement — 2 years, include subdomains
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );

  // Control referrer information leak
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Restrict powerful browser APIs
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()"
  );

  // Prevent cross-origin information leaks
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  response.headers.set("Cross-Origin-Resource-Policy", "same-origin");
  response.headers.set("Cross-Origin-Embedder-Policy", "require-corp");

  // Pass nonce to layout via header
  response.headers.set("x-nonce", nonce);

  return response;
}

export const config = {
  matcher: [
    // Apply to all routes except Next.js internals and static files
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|ttf|otf|mp4|glb|gltf)$).*)",
  ],
};
