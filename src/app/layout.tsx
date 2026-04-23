import type { Metadata } from "next";
import { Instrument_Sans, Lexend } from "next/font/google";
import localFont from "next/font/local";
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

export const metadata: Metadata = {
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
  openGraph: {
    title: "Ezer Enterprises | Wearable Life-Saving Technology",
    description:
      "Wearable devices that deliver life-saving medications in emergency situations.",
    type: "website",
  },
};

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
