"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { Syringe, Shield, Users, ArrowRight } from "lucide-react";

const platforms = [
  {
    icon: Syringe,
    name: "EzerGuard-OD",
    tagline: "Opioid Overdose Response",
    summary: "Explore our vision for to deliver the opioid overdose antidote- naloxone during a drug overdose.",
    secondLine: "Discover our plan to provide naloxone in cases of opioid overdose.",
    slug: "ezerguard-od",
    accent: "from-red-500/10 to-brand-secondary/10",
  },
  {
    icon: Shield,
    name: "EzerGuard-Military",
    tagline: "Battlefield Chemical Defense",
    summary: "Explore our vision for a system for a wearable device to be worn in the battlespace to deliver antidotes for chemical warfare agents",
    secondLine: "",
    slug: "ezerguard-military",
    accent: "from-green-500/10 to-brand-secondary/10",
  },
  {
    icon: Users,
    name: "EzerGuard-CD",
    tagline: "Civilian Chemical Defense",
    summary: "Explore our vision for a wearable to be worn by civilians in situations where they may be targets of chemical warfare.",
    secondLine: "Explore our vision for a wearable device to be worn by civilians to deliver antidotes for chemical warfare agents.",
    slug: "ezerguard-cd",
    accent: "from-blue-500/10 to-brand-secondary/10",
  },
];

export default function PlatformOverview() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative py-20 lg:py-28 gradient-dark text-white overflow-hidden" ref={ref}>
      {/* Decorative glass orbs */}
      <div className="glass-orb glass-orb-dark w-[250px] h-[250px] top-10 left-1/4 animate-float-slow" style={{ animationDelay: '-3s' }} />
      <div className="glass-orb glass-orb-dark w-[180px] h-[180px] bottom-20 right-10 animate-float-slow" style={{ animationDelay: '-7s' }} />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 mb-6"
        >
          <div className="accent-line" />
          <span className="font-heading text-xs font-semibold text-brand-secondary uppercase tracking-[0.2em]">
            Core Offerings
          </span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight"
          >
            Three Platforms,{" "}
            <span className="text-brand-secondary">One Mission</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="font-body text-lg text-white/40 leading-relaxed lg:pb-2"
          >
            Discover our innovative solutions that deliver life saving
            medications via wearable devices.
          </motion.p>
        </div>

        {/* Three platforms — glass cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {platforms.map((platform, i) => (
            <motion.div
              key={platform.slug}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.25 + i * 0.12 }}
            >
              <Link
                href={`/products/${platform.slug}`}
                className="group block glass-card-dark rounded-2xl p-8 hover:bg-white/10 transition-all h-full"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${platform.accent} flex items-center justify-center mb-6 glass-icon`}>
                  <platform.icon size={28} className="text-brand-secondary" />
                </div>

                <span className="font-heading text-xs font-semibold text-brand-secondary/70 uppercase tracking-wider">
                  {platform.tagline}
                </span>
                <h3 className="mt-2 font-display text-2xl font-bold text-white group-hover:text-brand-secondary transition-colors">
                  {platform.name}
                </h3>
                <p className="mt-4 font-body text-sm text-white/50 leading-relaxed">
                  {platform.summary}
                </p>
                {platform.secondLine && (
                  <p className="mt-3 font-body text-sm text-white/50 leading-relaxed">
                    {platform.secondLine}
                  </p>
                )}
                <span className="mt-6 inline-flex items-center gap-2 font-heading text-sm font-semibold text-brand-secondary group-hover:gap-3 transition-all">
                  Learn More
                  <ArrowRight size={14} />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
