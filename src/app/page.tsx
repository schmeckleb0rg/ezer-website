import { createClient } from "@supabase/supabase-js";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import MissionSection from "@/components/MissionSection";
import TechnologySection from "@/components/TechnologySection";
import PlatformOverview from "@/components/PlatformOverview";
import ProductsSection from "@/components/ProductsSection";
import TeamSection from "@/components/TeamSection";
import InvestorCTA from "@/components/InvestorCTA";
import TrustBadges from "@/components/TrustBadges";
import Footer from "@/components/Footer";

async function getHomeMedia(): Promise<Record<string, string>> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  if (!url || url.includes("placeholder")) return {};
  try {
    const supabase = createClient(url, key);
    const { data } = await supabase
      .from("page_images")
      .select("image_key, image_url")
      .eq("page", "home")
      .not("image_url", "is", null);
    const map: Record<string, string> = {};
    (data || []).forEach((row: { image_key: string; image_url: string }) => {
      if (row.image_url) map[row.image_key] = row.image_url;
    });
    return map;
  } catch {
    return {};
  }
}

export const dynamic = "force-dynamic";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://ezerenter.com");

export default async function HomePage() {
  const media = await getHomeMedia();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Ezer Enterprises",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.svg`,
    description:
      "Ezer Enterprises develops wearable devices that deliver life-saving medications in emergency situations.",
    sameAs: [],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "investor relations",
      url: `${SITE_URL}/#contact`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main>
        <HeroSection mediaSrc={media["home_hero_media"] || null} />
        <MissionSection mediaSrc={media["home_mission_media"] || null} />
        <TechnologySection mediaSrc={media["home_technology_media"] || null} />
        <PlatformOverview />
        <ProductsSection />
        <TeamSection />
        <InvestorCTA mediaSrc={media["home_investor_media"] || null} />
        <TrustBadges />
      </main>
      <Footer />
    </>
  );
}
