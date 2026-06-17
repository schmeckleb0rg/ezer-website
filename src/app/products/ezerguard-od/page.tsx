import type { Metadata } from "next";
import EzerGuardODContent from "./EzerGuardODContent";

export const metadata: Metadata = {
  title: "EzerGuard-OD | Opioid Overdose Response Device",
  description:
    "EzerGuard-OD is a wearable device that automatically delivers naloxone during an opioid overdose, even when the user is alone. Intelligent escalation from audio alarm to electrical stimulation to naloxone injection.",
  keywords: [
    "naloxone auto-injector",
    "opioid overdose device",
    "wearable naloxone",
    "overdose prevention",
    "EzerGuard-OD",
    "fentanyl overdose",
    "automatic naloxone delivery",
  ],
  alternates: {
    canonical: "/products/ezerguard-od",
  },
  openGraph: {
    title: "EzerGuard-OD | Opioid Overdose Response Device",
    description:
      "A wearable device that automatically delivers naloxone during an opioid overdose — no bystander needed.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EzerGuard-OD | Opioid Overdose Response Device",
    description:
      "A wearable device that automatically delivers naloxone during an opioid overdose — no bystander needed.",
  },
};

export default function EzerGuardODPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "EzerGuard-OD",
    description:
      "Wearable device that automatically delivers naloxone during an opioid overdose using an intelligent escalation protocol: audio alarm, electrical stimulation, and auto-injection.",
    brand: {
      "@type": "Organization",
      name: "Ezer Enterprises",
    },
    category: "Medical Devices",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <EzerGuardODContent />
    </>
  );
}
