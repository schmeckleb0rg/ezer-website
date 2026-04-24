"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Mail, ArrowRight, Image as ImageIcon } from "lucide-react";

function renderMedia(src: string) {
  const ext = src.split(".").pop()?.split("?")[0]?.toLowerCase() || "";
  if (["mp4", "webm", "mov", "avi"].includes(ext)) {
    return <video src={src} autoPlay muted loop playsInline className="w-full h-full object-cover" />;
  }
  return <img src={src} alt="Investor media" className="w-full h-full object-cover" />;
}

interface InvestorCTAProps {
  mediaSrc?: string | null;
}

export default function InvestorCTA({ mediaSrc }: InvestorCTAProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="contact" className="relative py-20 lg:py-28 gradient-hero overflow-hidden" ref={ref}>
      {/* Decorative glass orbs */}
      <div className="glass-orb glass-orb-dark w-[300px] h-[300px] -top-20 right-1/3 animate-float-slow" style={{ animationDelay: '-4s' }} />
      <div className="glass-orb glass-orb-dark w-[180px] h-[180px] bottom-10 left-20 animate-float-slow" style={{ animationDelay: '-9s' }} />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-4 mb-6"
          >
            <div className="accent-line" />
            <span className="font-heading text-xs font-semibold text-brand-secondary uppercase tracking-[0.2em]">
              Investment Opportunity
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight"
          >
            Join Us in
            <br />
            Saving{" "}
            <span className="text-brand-secondary">Lives</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 font-body text-lg text-white/45 leading-relaxed max-w-lg"
          >
            Ezer Enterprises is seeking strategic partners and investors to
            bring our life-saving wearable technology from vision to reality.
            The opioid crisis, battlefield preparedness, and civilian defense
            represent enormous markets with urgent, unmet needs.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-start gap-4"
          >
            <a
              href="mailto:invest@ezerenterprises.com"
              className="inline-flex items-center gap-2 rounded-full bg-brand-secondary px-8 py-4 font-heading font-semibold text-white hover:bg-brand-primary transition-all hover:scale-[1.02]"
            >
              <Mail size={18} />
              Contact Our Team
            </a>
            <a
              href="#products"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-8 py-4 font-heading font-semibold text-white/90 hover:bg-white/10 transition-all"
            >
              Review Technology
              <ArrowRight size={18} />
            </a>
          </motion.div>

          {/* Investor media */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-10 max-w-xl"
          >
            {mediaSrc ? (
              <div className="rounded-2xl overflow-hidden aspect-video">
                {renderMedia(mediaSrc)}
              </div>
            ) : (
              <div className="media-zone media-zone-dark aspect-video rounded-2xl">
                <ImageIcon size={28} className="text-white/20" />
                <span className="font-heading text-xs text-white/25 tracking-wide">Investor Media</span>
              </div>
            )}
          </motion.div>

          {/* Trust badges — glass pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="mt-12 flex flex-wrap gap-3"
          >
            {[
              "Patented Technology",
              "FDA Pathway Identified",
              "US-Based R&D",
            ].map((badge) => (
              <div
                key={badge}
                className="glass-card-dark rounded-full px-4 py-2 flex items-center gap-2 text-xs font-heading text-white/40 uppercase tracking-wider"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-brand-secondary" />
                {badge}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
