"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, Syringe, Shield, Users } from "lucide-react";

const products = [
  {
    slug: "ezerguard-od",
    icon: Syringe,
    name: "EzerGuard-OD",
    tagline: "Opioid Overdose Response",
    description:
      "A wearable device that delivers the opioid overdose antidote naloxone during a drug overdose. Designed for at-risk individuals, it monitors consciousness and acts autonomously when the user cannot.",
    stats: [
      { value: "81K+", label: "Annual US overdose deaths" },
      { value: "<4min", label: "Naloxone delivery time" },
    ],
  },
  {
    slug: "ezerguard-military",
    icon: Shield,
    name: "EzerGuard-Military",
    tagline: "Battlefield Chemical Defense",
    description:
      "A wearable device for the battlespace that integrates with NETT WARRIOR systems and chemical agent detectors to deliver antidotes for nerve agents and aerosolized opioids.",
    stats: [
      { value: "NETT", label: "Warrior integration" },
      { value: "Auto", label: "Threat classification" },
    ],
  },
  {
    slug: "ezerguard-cd",
    icon: Users,
    name: "EzerGuard-CD",
    tagline: "Civilian Chemical Defense",
    description:
      "A wearable device designed for the civilian population to deliver antidotes for nerve agents or aerosolized narcotics, integrating with civil defense communication systems.",
    stats: [
      { value: "GPS", label: "Location tracking" },
      { value: "Cell", label: "Phone integration" },
    ],
  },
];

export default function ProductsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="products" className="relative py-20 lg:py-28 bg-brand-bg overflow-hidden" ref={ref}>
      {/* Decorative glass orbs */}
      <div className="glass-orb w-[280px] h-[280px] top-40 -right-20 animate-float-slow" style={{ animationDelay: '-2s' }} />

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
            Our Platform
          </span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-brand-dark leading-[1.05] tracking-tight"
          >
            The EzerGuard
            <br />
            Product{" "}
            <span className="text-brand-secondary">Family</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="font-body text-lg text-brand-text-muted leading-relaxed lg:pb-2"
          >
            Three purpose-built wearable platforms addressing the most critical
            emergency medication delivery scenarios across civilian, military,
            and public health domains.
          </motion.p>
        </div>

        {/* Product cards — compact layout */}
        <div className="space-y-8">
          {products.map((product, i) => (
            <motion.div
              key={product.slug}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.25 + i * 0.12 }}
            >
              <Link
                href={`/products/${product.slug}`}
                className="group block glass-card rounded-2xl p-8 lg:p-10"
              >
                <div className="flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-10">
                  {/* Icon */}
                  <div className="shrink-0">
                    <div className="w-14 h-14 rounded-2xl glass-icon flex items-center justify-center">
                      <product.icon size={28} className="text-brand-secondary" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <span className="font-heading text-xs font-semibold text-brand-secondary uppercase tracking-[0.15em]">
                      {product.tagline}
                    </span>
                    <h3 className="mt-2 font-display text-3xl md:text-4xl font-bold text-brand-dark group-hover:text-brand-secondary transition-colors">
                      {product.name}
                    </h3>
                    <p className="mt-3 font-body text-base text-brand-text-muted leading-relaxed max-w-2xl">
                      {product.description}
                    </p>

                    {/* Stats + CTA inline */}
                    <div className="mt-6 flex flex-wrap items-center gap-6">
                      {product.stats.map((stat) => (
                        <div key={stat.label} className="flex items-baseline gap-2">
                          <span className="font-display text-2xl font-bold text-brand-secondary">
                            {stat.value}
                          </span>
                          <span className="font-body text-xs text-brand-text-muted uppercase tracking-wider">
                            {stat.label}
                          </span>
                        </div>
                      ))}
                      <span className="ml-auto inline-flex items-center gap-2 font-heading text-sm font-semibold text-brand-secondary group-hover:gap-3 transition-all">
                        Learn More
                        <ArrowRight size={16} />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
