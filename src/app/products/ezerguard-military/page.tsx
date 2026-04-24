"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import {
  ArrowLeft,
  Radio,
  Shield,
  Wifi,
  Syringe,
  MapPin,
  AlertCircle,
  Image as ImageIcon,
} from "lucide-react";
import Link from "next/link";

const capabilities = [
  {
    icon: Radio,
    title: "Detection & Classification",
    description:
      "Integrates with handheld spectrometers, surface acoustic wave sensors, and other military-grade chemical agent detection systems to identify and classify the threat in real-time.",
  },
  {
    icon: Shield,
    title: "Verification of Exposure",
    description:
      "Through an interactive process the device tests the alertness of the soldier. This is accomplished with audio and physicial stimulation.",
  },
  {
    icon: Syringe,
    title: "Delivery of Appropriate Antidote",
    description:
      "If the soldier does not respond, the appropriate antidote to either nerve agents or aerosolized opioids is delivered.",
  },
  {
    icon: Wifi,
    title: "NETT WARRIOR Integration",
    description:
      "The soldier on the battlefield is connected to the NETT WARRIOR system. This is a smart phone-based mission command system that provides leaders with real-time situational awareness, navigation and communication.",
  },
  {
    icon: MapPin,
    title: "Location & Evacuation",
    description:
      "Through the NETT WARRIOR system command is notified of the injection and the location of the soldier for additional medical treatment and evacuation.",
  },
  {
    icon: AlertCircle,
    title: "Dual Threat Response",
    description:
      "Addresses both weaponized nerve agents that affect the neuromuscular system and highly potent aerosolized narcotics used with lethal consequences.",
  },
];

interface PageImage {
  image_key: string;
  image_url: string | null;
}

export default function EzerGuardMilitaryPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [deviceMedia, setDeviceMedia] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/page-images?page=ezerguard-military")
      .then((r) => r.json())
      .then((data) => {
        const img = (data.images || []).find((i: PageImage) => i.image_key === "military_device_media");
        if (img?.image_url) setDeviceMedia(img.image_url);
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="gradient-hero pt-36 pb-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors font-heading text-sm mb-8"
            >
              <ArrowLeft size={16} />
              Back to Home
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="accent-line" />
                <span className="font-heading text-xs font-semibold text-brand-secondary uppercase tracking-[0.2em]">
                  Battlefield Chemical Defense
                </span>
              </div>
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                EzerGuard-Military
              </h1>
              <p className="mt-6 font-body text-lg text-white/60 leading-relaxed max-w-2xl">
                EzerGuard-Military is a wearable device that delivers antidotes on the battlefield to chemical agents.
              </p>
              <p className="mt-3 font-body text-lg text-white/60 leading-relaxed max-w-2xl">
                Explore our vision for a system for a wearable device to be worn in the battlespace to deliver antidotes for chemical warfare agents
              </p>
            </motion.div>
          </div>
        </section>

        {/* Summary */}
        <section className="py-16 bg-white border-b border-brand-light">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <h3 className="font-display text-2xl font-bold text-brand-dark mb-6">
              EzerGuard-Military Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-xl border border-brand-light p-6">
                <div className="font-heading text-sm font-semibold text-brand-secondary uppercase tracking-wider mb-2">01</div>
                <p className="font-body text-base text-brand-dark">Detection and classification of exposure</p>
              </div>
              <div className="rounded-xl border border-brand-light p-6">
                <div className="font-heading text-sm font-semibold text-brand-secondary uppercase tracking-wider mb-2">02</div>
                <p className="font-body text-base text-brand-dark">Verification of exposure</p>
              </div>
              <div className="rounded-xl border border-brand-light p-6">
                <div className="font-heading text-sm font-semibold text-brand-secondary uppercase tracking-wider mb-2">03</div>
                <p className="font-body text-base text-brand-dark">Delivery of appropriate antidote</p>
              </div>
            </div>
          </div>
        </section>

        {/* Threat Context */}
        <section className="py-24 bg-brand-bg">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="accent-line" />
                  <span className="font-heading text-xs font-semibold text-brand-secondary uppercase tracking-[0.2em]">
                    The Threat
                  </span>
                </div>
                <h2 className="font-display text-4xl md:text-5xl font-bold text-brand-dark leading-tight">
                  Chemical Warfare on the Modern Battlefield
                </h2>
                <div className="mt-6 space-y-4 font-body text-base text-brand-text-muted leading-relaxed">
                  <p>
                    Soldiers on the battlefield are at risk to exposure to chemical agents.
                  </p>
                  <p>
                    Nerve agents have been weaponized. These highly toxic chemicals rapidly effect the neuromuscular system leading to convulsions, respiratory distress and death. Hand held nerve agent antidote injectors are in use.
                  </p>
                  <p>
                    More recently, highly potent narcotics have been aerosolized and have been used with lethal consequences. Hand held injectors containing narcotic reversal medication are also available.
                  </p>
                  <p>
                    Hand held injector systems require either active self-administration or delivery by a rescuer.
                  </p>
                </div>
              </div>
              <div>
                <div className="rounded-2xl gradient-dark p-10 text-white">
                  <h3 className="font-heading text-lg font-semibold text-brand-secondary mb-6">
                    Current Military Systems
                  </h3>
                  <div className="space-y-4 font-body text-sm text-white/60">
                    <p>
                      The soldier on the battlefield is connected to the NETT WARRIOR system. This is a smart phone-based mission command system that provides leaders with real-time situational awareness, navigation and communication.
                    </p>
                    <p>
                      In addition, the military has developed highly sensitive devices for rapid determination that a chemical agent is in the environment (handheld spectrometers, surface acoustic wave sensors etc.).
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Our Vision */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-12 rounded-2xl border border-brand-light bg-white p-8 lg:p-12"
            >
              <h3 className="font-display text-2xl font-bold text-brand-dark mb-4">
                Our Vision
              </h3>
              <p className="font-body text-base text-brand-text-muted leading-relaxed max-w-4xl">
                Our vision is wearable device that interacts with the NETT WARRIOR system and chemical agent detectors to identify and classify the threat. Through an interactive process the device tests the alertness of the soldier. This is accomplished with audio and physicial stimulation. If the soldier does not respond, the appropriate antidote to either nerve agents or aerosolized opioids is delivered. Through the NETT WARRIOR system command is notified of the injection and the location of the soldier for additional medical treatment and evacuation.
              </p>
            </motion.div>

            {/* Device image */}
            <div className="mt-8">
              {deviceMedia ? (
                <div className="rounded-2xl overflow-hidden aspect-video">
                  {["mp4", "webm", "mov"].includes(deviceMedia.split(".").pop()?.toLowerCase() || "") ? (
                    <video src={deviceMedia} autoPlay muted loop playsInline className="w-full h-full object-cover" />
                  ) : (
                    <img src={deviceMedia} alt="EzerGuard-Military device" className="w-full h-full object-cover" />
                  )}
                </div>
              ) : (
                <div className="media-zone aspect-video rounded-2xl">
                  <ImageIcon size={28} className="text-brand-secondary/25" />
                  <span className="font-heading text-xs text-brand-dark/25 tracking-wide">Device Image</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Capabilities Grid */}
        <section className="py-24 gradient-dark text-white" ref={ref}>
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="accent-line" />
                <span className="font-heading text-xs font-semibold text-brand-secondary uppercase tracking-[0.2em]">
                  System Capabilities
                </span>
              </div>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Integrated Battlefield Defense
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {capabilities.map((cap, i) => (
                <motion.div
                  key={cap.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
                  className="glass rounded-2xl p-8"
                >
                  <div className="w-10 h-10 rounded-lg bg-brand-secondary/20 flex items-center justify-center">
                    <cap.icon size={20} className="text-brand-secondary" />
                  </div>
                  <h3 className="mt-4 font-heading text-lg font-semibold">
                    {cap.title}
                  </h3>
                  <p className="mt-2 font-body text-sm text-white/50 leading-relaxed">
                    {cap.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-brand-bg">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-dark">
              Protecting Those Who Protect Us
            </h2>
            <p className="mt-4 font-body text-brand-text-muted max-w-xl mx-auto">
              EzerGuard-Military represents the next evolution in battlefield
              medical preparedness. Partner with us to equip our forces with
              autonomous life-saving technology.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/#contact"
                className="rounded-full bg-brand-secondary px-8 py-3.5 font-heading font-semibold text-white hover:bg-brand-primary transition-all"
              >
                Investment Opportunities
              </a>
              <Link
                href="/products/ezerguard-cd"
                className="rounded-full border border-brand-dark/20 px-8 py-3.5 font-heading font-semibold text-brand-dark hover:bg-brand-dark/5 transition-all"
              >
                Next: EzerGuard-CD →
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
