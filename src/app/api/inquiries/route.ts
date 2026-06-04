import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  );
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

export async function POST(request: NextRequest) {
  const { name, email, company, message } = await request.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const db = getServiceClient();

  // Rate limit: max 3 submissions per IP per hour
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count } = await db
    .from("investor_inquiries")
    .select("*", { count: "exact", head: true })
    .eq("ip_address", ip)
    .gte("created_at", oneHourAgo);

  if ((count ?? 0) >= 10) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again later." },
      { status: 429 }
    );
  }

  // Save to database
  const { error: dbError } = await db.from("investor_inquiries").insert({
    name,
    email,
    company: company || null,
    message,
    ip_address: ip,
  });

  if (dbError) {
    return NextResponse.json({ error: "Failed to save inquiry." }, { status: 500 });
  }

  // Send email notification
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeCompany = company ? escapeHtml(company) : null;
  const safeMessage = escapeHtml(message);

  const emailHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1e4c49;">New Investor Inquiry</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; font-weight: bold; width: 120px;">Name</td>
          <td style="padding: 8px 0;">${safeName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Email</td>
          <td style="padding: 8px 0;"><a href="mailto:${safeEmail}">${safeEmail}</a></td>
        </tr>
        ${safeCompany ? `<tr><td style="padding: 8px 0; font-weight: bold;">Company</td><td style="padding: 8px 0;">${safeCompany}</td></tr>` : ""}
        <tr>
          <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Message</td>
          <td style="padding: 8px 0; white-space: pre-wrap;">${safeMessage}</td>
        </tr>
      </table>
      <p style="color: #888; font-size: 12px; margin-top: 24px;">
        Submitted via ezerenter.com
      </p>
    </div>
  `;

  const resend = new Resend(process.env.RESEND_API_KEY);
  await Promise.all([
    resend.emails.send({
      from: "Ezer Enterprises <noreply@ezerenter.com>",
      to: "ikaplan@ezerenter.com",
      replyTo: email,
      subject: `New Investor Inquiry from ${safeName}`,
      html: emailHtml,
    }),
    resend.emails.send({
      from: "Ezer Enterprises <noreply@ezerenter.com>",
      to: "ikorer@ezerenter.com",
      subject: `[Copy] New Investor Inquiry from ${safeName}`,
      html: emailHtml,
    }),
  ]);

  return NextResponse.json({ success: true });
}
