import type { Metadata } from "next";
import EzerGuardMilitaryContent from "./EzerGuardMilitaryContent";

export const metadata: Metadata = {
  title: "EzerGuard-Military | Battlefield Chemical Defense Device",
  description:
    "EzerGuard-Military is a wearable device that delivers antidotes for chemical warfare agents on the battlefield. Integrates with NETT WARRIOR and military-grade chemical detection systems.",
  keywords: [
    "military wearable device",
    "chemical warfare antidote",
    "nerve agent auto-injector",
    "battlefield medical device",
    "EzerGuard-Military",
    "NETT WARRIOR",
    "chemical agent defense",
  ],
  alternates: {
    canonical: "/products/ezerguard-military",
  },
  openGraph: {
    title: "EzerGuard-Military | Battlefield Chemical Defense Device",
    description:
      "A wearable device that delivers antidotes for chemical warfare agents on the battlefield, integrated with military detection systems.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EzerGuard-Military | Battlefield Chemical Defense Device",
    description:
      "A wearable device that delivers antidotes for chemical warfare agents on the battlefield, integrated with military detection systems.",
  },
};

export default function EzerGuardMilitaryPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "EzerGuard-Military",
    description:
      "Wearable device for battlefield chemical defense that integrates with NETT WARRIOR and military-grade chemical detection systems to automatically deliver appropriate antidotes for nerve agents or aerosolized opioids.",
    brand: {
      "@type": "Organization",
      name: "Ezer Enterprises",
    },
    category: "Military Medical Devices",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <EzerGuardMilitaryContent />
    </>
  );
}
