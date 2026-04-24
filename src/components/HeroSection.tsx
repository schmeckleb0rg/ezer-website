"use client";

import { motion } from "framer-motion";
import { ArrowDown, Image as ImageIcon } from "lucide-react";

function renderMedia(src: string) {
  const ext = src.split(".").pop()?.split("?")[0]?.toLowerCase() || "";
  if (["mp4", "webm", "mov", "avi"].includes(ext)) {
    return (
      <video
        src={src}
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full object-cover"
      />
    );
  }
  return <img src={src} alt="Hero media" className="w-full h-full object-cover" />;
}

interface HeroSectionProps {
  mediaSrc?: string | null;
}

export default function HeroSection({ mediaSrc }: HeroSectionProps) {
  return (
    <section className="relative gradient-hero overflow-hidden">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
      }} />

      {/* Decorative glass orbs */}
      <div className="glass-orb glass-orb-dark w-[400px] h-[400px] -top-40 -right-40 animate-float-slow" />
      <div className="glass-orb glass-orb-dark w-[250px] h-[250px] top-1/2 -left-32 animate-float-slow" style={{ animationDelay: '-4s' }} />
      <div className="glass-orb glass-orb-dark w-[150px] h-[150px] bottom-40 right-1/4 animate-float-slow" style={{ animationDelay: '-8s' }} />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 pt-36 lg:pt-44 pb-16">
        {/* Centered text content */}
        <div className="max-w-4xl mx-auto text-center">
          {/* Accent line + Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-4 mb-8"
          >
            <div className="accent-line" />
            <span className="font-heading text-xs font-medium text-brand-secondary uppercase tracking-[0.2em]">
              Pioneering Wearable Emergency Medicine
            </span>
            <div className="accent-line" />
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-5xl md:text-6xl lg:text-[5.5rem] font-bold text-white leading-[1.05] tracking-tight"
          >
            Life-Saving
            <br />
            Medication,{" "}
            <span className="text-brand-secondary">Delivered Instantly</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-8 font-body text-lg text-white/50 max-w-2xl mx-auto leading-relaxed"
          >
            Ezer Enterprises is developing wearable devices that autonomously
            deliver critical medications when every second counts — even when the
            wearer cannot act.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="#products"
              className="rounded-full bg-brand-secondary px-8 py-3.5 font-heading font-semibold text-white hover:bg-brand-primary transition-all hover:scale-[1.02]"
            >
              Explore Our Technology
            </a>
            <a
              href="#contact"
              className="rounded-full border border-white/20 px-8 py-3.5 font-heading font-semibold text-white/90 hover:bg-white/10 transition-all"
            >
              Investment Opportunities
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl mx-auto"
          >
            {[
              { value: "81,000+", label: "US opioid deaths in 2023" },
              { value: "69-75%", label: "Overdose deaths when alone" },
              { value: "3", label: "EzerGuard platforms" },
            ].map((stat) => (
              <div key={stat.label} className="glass-card-dark rounded-2xl px-6 py-6">
                <div className="font-display text-4xl lg:text-5xl font-bold text-brand-secondary">
                  {stat.value}
                </div>
                <div className="mt-2 font-body text-xs text-white/45 uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Media showcase — shown only when uploaded */}
          {mediaSrc && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mt-12 rounded-2xl overflow-hidden glass-card-dark aspect-video max-w-4xl mx-auto"
            >
              {renderMedia(mediaSrc)}
            </motion.div>
          )}
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ArrowDown size={20} className="text-white/30" />
        </motion.div>
      </motion.div>
    </section>
  );
}
