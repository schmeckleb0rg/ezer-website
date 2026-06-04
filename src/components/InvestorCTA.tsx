"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { Mail, ArrowRight, X } from "lucide-react";

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

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
      } else {
        setSuccess(true);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function closeModal() {
    setOpen(false);
    setTimeout(() => {
      setSuccess(false);
      setError("");
      setForm({ name: "", email: "", company: "", message: "" });
    }, 300);
  }

  return (
    <>
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
              <button
                onClick={() => setOpen(true)}
                className="inline-flex items-center gap-2 rounded-full bg-brand-secondary px-8 py-4 font-heading font-semibold text-white hover:bg-brand-primary transition-all hover:scale-[1.02]"
              >
                <Mail size={18} />
                Contact Our Team
              </button>
              <a
                href="#products"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-8 py-4 font-heading font-semibold text-white/90 hover:bg-white/10 transition-all"
              >
                Review Technology
                <ArrowRight size={18} />
              </a>
            </motion.div>

            {/* Investor media — shown only when uploaded */}
            {mediaSrc && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-10 rounded-2xl overflow-hidden aspect-video max-w-xl"
              >
                {renderMedia(mediaSrc)}
              </motion.div>
            )}

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

      {/* Contact Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
            onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl"
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>

              {success ? (
                <div className="text-center py-6">
                  <div className="w-14 h-14 rounded-full bg-[#e3eded] flex items-center justify-center mx-auto mb-4">
                    <Mail size={24} className="text-[#1e4c49]" />
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-[#1e4c49] mb-2">
                    Message Received
                  </h3>
                  <p className="font-body text-gray-500 text-sm">
                    {"We'll be in touch soon."}
                  </p>
                  <button
                    onClick={closeModal}
                    className="mt-6 rounded-full bg-[#1e4c49] px-6 py-2.5 font-heading text-sm font-semibold text-white hover:bg-[#5d99ba] transition-colors"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="font-heading text-2xl font-bold text-[#1e4c49] mb-1">
                    Contact Our Team
                  </h3>
                  <p className="font-body text-sm text-gray-400 mb-6">
                    We typically respond within 1–2 business days.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-heading text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                          Name <span className="text-red-400">*</span>
                        </label>
                        <input
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          required
                          placeholder="Jane Smith"
                          className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 font-body text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#5d99ba] focus:ring-1 focus:ring-[#5d99ba] transition"
                        />
                      </div>
                      <div>
                        <label className="block font-heading text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                          Email <span className="text-red-400">*</span>
                        </label>
                        <input
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={handleChange}
                          required
                          placeholder="jane@example.com"
                          className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 font-body text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#5d99ba] focus:ring-1 focus:ring-[#5d99ba] transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-heading text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                        Company / Organization
                      </label>
                      <input
                        name="company"
                        value={form.company}
                        onChange={handleChange}
                        placeholder="Optional"
                        className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 font-body text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#5d99ba] focus:ring-1 focus:ring-[#5d99ba] transition"
                      />
                    </div>

                    <div>
                      <label className="block font-heading text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                        Message <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        required
                        rows={4}
                        placeholder="Tell us about your interest in Ezer Enterprises..."
                        className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 font-body text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#5d99ba] focus:ring-1 focus:ring-[#5d99ba] transition resize-none"
                      />
                    </div>

                    {error && (
                      <p className="font-body text-sm text-red-500">{error}</p>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-full bg-[#1e4c49] py-3 font-heading font-semibold text-white hover:bg-[#5d99ba] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Sending..." : "Send Message"}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
