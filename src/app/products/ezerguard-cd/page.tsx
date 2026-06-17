import type { Metadata } from "next";
import EzerGuardCDContent from "./EzerGuardCDContent";

export const metadata: Metadata = {
  title: "EzerGuard-CD | Civilian Chemical Defense Device",
  description:
    "EzerGuard-CD is a wearable device for civilian populations that delivers antidotes for nerve agents and aerosolized narcotics. Integrates with civil defense alert systems and GPS location services.",
  keywords: [
    "civilian defense wearable",
    "chemical attack protection",
    "nerve agent antidote device",
    "civilian chemical defense",
    "EzerGuard-CD",
    "home front defense",
    "wearable antidote delivery",
  ],
  alternates: {
    canonical: "/products/ezerguard-cd",
  },
  openGraph: {
    title: "EzerGuard-CD | Civilian Chemical Defense Device",
    description:
      "A wearable device for civilian populations that delivers antidotes for chemical warfare agents, with civil defense alert integration.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EzerGuard-CD | Civilian Chemical Defense Device",
    description:
      "A wearable device for civilian populations that delivers antidotes for chemical warfare agents, with civil defense alert integration.",
  },
};

export default function EzerGuardCDPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "EzerGuard-CD",
    description:
      "Wearable device for civilian chemical defense that integrates with civil defense alert systems to deliver antidotes for nerve agents or aerosolized narcotics, with GPS location reporting.",
    brand: {
      "@type": "Organization",
      name: "Ezer Enterprises",
    },
    category: "Civilian Defense Devices",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <EzerGuardCDContent />
    </>
  );
}
