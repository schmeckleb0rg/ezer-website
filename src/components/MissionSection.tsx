"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Heart, Zap, Radio, CheckCircle, Image as ImageIcon } from "lucide-react";

const features = [
  {
    icon: Heart,
    title: "Autonomous Medication Delivery",
    description:
      "Our approach to this problem are wearable devices that deliver the medications.",
    number: "01",
  },
  {
    icon: Zap,
    title: "Intelligent Alert System",
    description:
      "Our injector system interacts with the disabled wearer to ensure the medication is administered safely and reliably.",
    number: "02",
  },
  {
    icon: Radio,
    title: "Connected Ecosystem",
    description:
      "Devices communicate with smartphones, military systems, and emergency services to coordinate response and locate individuals in distress.",
    number: "03",
  },
];

function renderMedia(src: string) {
  const ext = src.split(".").pop()?.split("?")[0]?.toLowerCase() || "";
  if (["mp4", "webm", "mov", "avi"].includes(ext)) {
    return <video src={src} autoPlay muted loop playsInline className="w-full h-full object-cover" />;
  }
  return <img src={src} alt="Mission media" className="w-full h-full object-cover" />;
}

interface MissionSectionProps {
  mediaSrc?: string | null;
}

export default function MissionSection({ mediaSrc }: MissionSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="mission" className="relative py-20 lg:py-28 bg-brand-bg overflow-hidden" ref={ref}>
      {/* Decorative glass orbs */}
      <div className="glass-orb w-[300px] h-[300px] -top-20 -right-20 animate-float-slow" />
      <div className="glass-orb w-[200px] h-[200px] bottom-20 -left-20 animate-float-slow" style={{ animationDelay: '-5s' }} />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-4 mb-6"
          >
            <div className="accent-line" />
            <span className="font-heading text-xs font-semibold text-brand-secondary uppercase tracking-[0.2em]">
              Our Mission
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-brand-dark leading-[1.05] tracking-tight"
          >
            When Minutes
            <br />
            Matter, Our
            <br />
            Technology{" "}
            <span className="text-brand-secondary">Acts</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            <p className="font-body text-xl font-medium text-brand-dark leading-relaxed">
              To create wearable systems that deliver life saving medications in life threatening situations.
            </p>
            <p className="font-body text-lg text-brand-text-muted leading-relaxed">
              Our technology uses wearable devices and interactive software to provide lifesaving medications in emergency situations. Discover our innovative solutions that deliver life saving medications via wearable devices.
            </p>
          </motion.div>
        </div>

        {/* Mission media */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.28 }}
          className="mt-10 max-w-3xl"
        >
          {mediaSrc ? (
            <div className="rounded-2xl overflow-hidden aspect-video">
              {renderMedia(mediaSrc)}
            </div>
          ) : (
            <div className="media-zone aspect-video rounded-2xl">
              <ImageIcon size={28} className="text-brand-secondary/25" />
              <span className="font-heading text-xs text-brand-dark/25 tracking-wide">Mission Media</span>
            </div>
          )}
        </motion.div>

        {/* Key Features — glass card with bullet points */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mt-14 glass-card rounded-2xl p-8 lg:p-10"
        >
          <h3 className="font-display text-2xl font-bold text-brand-dark mb-5">
            Key Features
          </h3>
          <div className="space-y-3 max-w-4xl">
            <div className="flex items-start gap-3">
              <CheckCircle size={18} className="text-brand-secondary mt-0.5 shrink-0" />
              <p className="font-body text-base text-brand-text-muted leading-relaxed">
                In emergency situations drugs such as antidotes for opioid overdose or chemical warfare agents has to delivered immediately-minutes matter.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle size={18} className="text-brand-secondary mt-0.5 shrink-0" />
              <p className="font-body text-base text-brand-text-muted leading-relaxed">
                However, the person in danger is often unconscious or incapacitated and cannot self-administer these medications.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle size={18} className="text-brand-secondary mt-0.5 shrink-0" />
              <p className="font-body text-base text-brand-text-muted leading-relaxed">
                Our approach to this problem are wearable devices that deliver the medications. Our injector system interacts with the disabled wearer to ensure the medication is administered safely and reliably.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Feature Cards — glass cards */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.12 }}
              className="glass-card rounded-2xl p-8"
            >
              <span className="font-display text-4xl font-bold text-brand-secondary/15">
                {feature.number}
              </span>
              <div className="mt-4 w-11 h-11 rounded-xl glass-icon flex items-center justify-center">
                <feature.icon size={22} className="text-brand-secondary" />
              </div>
              <h3 className="mt-5 font-heading text-lg font-semibold text-brand-dark">
                {feature.title}
              </h3>
              <p className="mt-3 font-body text-sm text-brand-text-muted leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
