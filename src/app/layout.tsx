import type { Metadata } from "next";
import { Instrument_Sans, Lexend } from "next/font/google";
import localFont from "next/font/local";
import { createClient } from "@supabase/supabase-js";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const generalSans = localFont({
  src: [
    { path: "../../public/fonts/GeneralSans-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/GeneralSans-Medium.woff2", weight: "500", style: "normal" },
    { path: "../../public/fonts/GeneralSans-Semibold.woff2", weight: "600", style: "normal" },
    { path: "../../public/fonts/GeneralSans-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-general-sans",
});

// Force dynamic rendering so generateMetadata re-fetches on every request
// (prevents Vercel from caching a stale favicon/og URL from build time)
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  let faviconUrl: string | null = null;
  let ogImageUrl: string | null = null;

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
    );
    const { data } = await supabase
      .from("site_content")
      .select("section_key, value")
      .in("section_key", ["favicon_url", "og_image_url"]);

    faviconUrl = data?.find((d) => d.section_key === "favicon_url")?.value || null;
    ogImageUrl = data?.find((d) => d.section_key === "og_image_url")?.value || null;
  } catch {
    // fall through with nulls — static fallbacks apply
  }

  return {
    title: "Ezer Enterprises | Wearable Life-Saving Technology",
    description:
      "Ezer Enterprises develops wearable devices that deliver life-saving medications in emergency situations. Discover our EzerGuard platform for opioid overdose, military, and civilian defense.",
    keywords: [
      "wearable medical device",
      "naloxone delivery",
      "opioid overdose",
      "chemical warfare antidote",
      "EzerGuard",
      "medical technology",
      "life-saving technology",
    ],
    ...(faviconUrl ? { icons: { icon: faviconUrl } } : {}),
    openGraph: {
      title: "Ezer Enterprises | Wearable Life-Saving Technology",
      description:
        "Wearable devices that deliver life-saving medications in emergency situations.",
      type: "website",
      ...(ogImageUrl ? { images: [ogImageUrl] } : {}),
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${instrumentSans.variable} ${lexend.variable} ${generalSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body">{children}</body>
    </html>
  );
}
