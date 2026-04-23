"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ShieldCheck, FileCheck, Flag } from "lucide-react";

const badges = [
  {
    icon: ShieldCheck,
    title: "Patented Technology",
    description:
      "Our wearable drug delivery systems are protected by patents, representing a novel approach to autonomous emergency medication delivery.",
  },
  {
    icon: FileCheck,
    title: "FDA Pathway Identified",
    description:
      "A clear regulatory pathway has been mapped for bringing our devices to market, with FDA engagement strategy in place.",
  },
  {
    icon: Flag,
    title: "US-Based R&D",
    description:
      "All research, development, and engineering is conducted domestically, ensuring quality control and alignment with US regulatory standards.",
  },
];

export default function TrustBadges() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-16 lg:py-20 bg-white border-y border-brand-light" ref={ref}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {badges.map((badge, i) => (
            <motion.div
              key={badge.title}
              initial={{ opacity: 0, y: 25 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="glass-card rounded-2xl p-8 flex flex-col items-start"
            >
              <div className="w-14 h-14 rounded-2xl glass-icon flex items-center justify-center mb-5">
                <badge.icon size={28} className="text-brand-secondary" />
              </div>
              <h3 className="font-display text-2xl font-bold text-brand-dark">
                {badge.title}
              </h3>
              <p className="mt-3 font-body text-sm text-brand-text-muted leading-relaxed">
                {badge.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
